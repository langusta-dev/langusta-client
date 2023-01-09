import Dexie, { liveQuery } from 'dexie';
import { v4 as uuid } from 'uuid';

import { IndexableBoolean } from '~/types/idb';

import { useLocalProfileStore } from '~/stores/localProfile';
import { useSessionStore } from '~/stores/session';

import { parseIdbData, toIdbData } from '~/helpers/dataSync';

import { isOnline } from './online';

import type { Table, IndexableType } from 'dexie';
import type { Ref } from 'vue';
import type {
  Editable,
  IdbData,
  LocalOnly,
  Owned,
  SynchronizableData,
} from '~/types/dataSync';
import type { MealPlan } from '~/types/mealPlan';
import type { Recipe } from '~/types/recipe';
import type { RecipeCollection } from '~/types/recipeCollection';
import type { Uuid } from '~/types/uuid';

const SYNCHRONIZABLE_TABLE = 'id, data, toUpload, toDelete';

class IdbInstance extends Dexie {
  recipes!: Table<IdbData<Recipe>>;
  recipeCollections!: Table<IdbData<RecipeCollection>>;
  mealPlans!: Table<IdbData<MealPlan>>;

  constructor() {
    super('langusta');
    this.version(1).stores({
      recipes: SYNCHRONIZABLE_TABLE,
      recipeCollections: SYNCHRONIZABLE_TABLE,
      mealPlans: SYNCHRONIZABLE_TABLE,
    });
  }

  async clear() {
    await Promise.all(this.tables.map((table) => table.clear()));
  }
}

export const idb = new IdbInstance();

const now = () => new Date().toString();

const MAX_INIT_RETRY_COUNT = 1;
const SYNC_DEBOUNCE = 5000; // ms

export const useSynchronizableArray = <T extends SynchronizableData>(
  idbTableKey: keyof typeof idb,
  initializer: (
    localOnlyData: LocalOnly<T>[]
  ) => T[] | null | Promise<T[] | null>,
  uploader: (data: T[]) => Promise<Uuid[] | null>,
  deleter: (data: Uuid[]) => Promise<Uuid[] | null>,
  initialData: () => T[] = () => []
) => {
  const sessionStore = useSessionStore();
  const localProfileStore = useLocalProfileStore();

  const idbTable = idb[idbTableKey] as Table<IdbData<T>>;

  let idbData = $ref<IdbData<T>[]>([]);
  let isIdbDataReady = $ref(false);

  let idbTransactionCount = $ref(0);
  let idbRequestedTransactionCount = 0;

  const waitForTransaction = async (transaction: Promise<IndexableType>) => {
    idbRequestedTransactionCount++;

    const result = await transaction;

    if (!result && idbTransactionCount < idbRequestedTransactionCount) {
      idbTransactionCount++;
    }

    await Promise.any([
      until($$(idbTransactionCount)).toBe(idbRequestedTransactionCount),

      // FIXME: operations are usually almost instant
      // this hack handles operations that update records without modifying them
      wait(100),
    ]);
  };

  const idbDataObserver = liveQuery<IdbData<T>[]>(() => idbTable.toArray());

  idbDataObserver.subscribe({
    next: (v) => {
      idbData = v;

      if (isIdbDataReady) {
        if (idbTransactionCount < idbRequestedTransactionCount) {
          idbTransactionCount++;
        }
      } else {
        isIdbDataReady = true;
      }
    },
  });

  const data = $computed(() =>
    isIdbDataReady
      ? idbData
          .filter(({ toDelete }) => !toDelete)
          .map(parseIdbData)
          .filter(Boolean)
      : initialData()
  ) as T[];

  const localOnlyData = $computed<LocalOnly<T>[]>(() =>
    data.filter((item): item is LocalOnly<T> => !!item.isLocalOnly)
  );

  const dataToUpload = $computed<T[]>(() =>
    idbData
      .filter(({ toUpload }) => toUpload)
      .map(parseIdbData)
      .filter((item): item is T => !!item)
  );

  const dataIdsToUploadSet = $computed(
    () => new Set(dataToUpload.map(({ id }) => id))
  );

  const dataIdsToDelete = $computed<Uuid[]>(() =>
    idbData
      .filter(({ toDelete }) => toDelete)
      .map(({ data }) => (JSON.parse(data) as T).id)
  );

  const dataIdsToDeleteSet = $computed(() => new Set(dataIdsToDelete));

  const setData = async (newData: T[]) => {
    const localOnlyDataCopy = [...localOnlyData];

    await waitForTransaction(
      idbTable.where('toUpload').equals(IndexableBoolean.False).delete()
    );

    await waitForTransaction(
      idbTable.bulkAdd(
        [
          ...newData.filter(
            ({ id }) =>
              !dataIdsToDeleteSet.has(id) && !dataIdsToUploadSet.has(id)
          ),

          // data created via local profile should be always preserved
          ...localOnlyDataCopy,
        ].map((item) => toIdbData(item))
      )
    );

    // FIXME: makes sure that idb is updated
    await wait(100);
  };

  let isDataReady = $ref(!sessionStore.isAuth);
  whenever(
    () => sessionStore.isAuth,
    () => {
      isDataReady = false;
    },
    { flush: 'sync' }
  );

  let retryCount = 0;

  whenever(
    () => !isDataReady,
    async () => {
      if (sessionStore.isAuth) {
        await until($$(isIdbDataReady)).toBe(true);

        let newData = await initializer(localOnlyData);

        while (!newData && retryCount < MAX_INIT_RETRY_COUNT) {
          retryCount++;
          newData = await initializer(localOnlyData);
        }

        if (newData) {
          await setData(newData);
        }
      }

      isDataReady = true;
    },
    { immediate: true }
  );

  const _autosync = <U>(
    itemsRef: Ref<U[]>,
    synchronizer: (items: U[]) => Promise<void>
  ) => {
    watch(
      [refDebounced(itemsRef, SYNC_DEBOUNCE), isOnline],
      ([items, online]) => {
        if (!online || !items.length) {
          return;
        }

        synchronizer([...items]);
      },
      { immediate: true, deep: true }
    );
  };

  // TODO
  // what to do with items
  // that were not synchronized?

  _autosync($$(dataToUpload), async (items) => {
    const syncedIds = await uploader(items);

    if (syncedIds) {
      await idbTable
        .where('toUpload')
        .equals(IndexableBoolean.True)
        .modify({ toUpload: IndexableBoolean.False });
    }
  });

  _autosync($$(dataIdsToDelete), async (ids) => {
    const syncedIds = await deleter(ids);

    if (syncedIds) {
      await idbTable.where('toDelete').equals(IndexableBoolean.True).delete();
    }
  });

  const dataReadyPromise = $computed(() => until($$(isDataReady)).toBe(true));

  const isDataInSync = $computed(
    () => isDataReady && !dataToUpload.length && !dataIdsToDelete.length
  );

  const dataSyncPromise = $computed(() => until($$(isDataInSync)).toBe(true));

  const ownedData = $computed(() =>
    data.filter((item): item is Owned<T> => !!item.isOwned)
  );

  const _dataPerId = $computed(
    () => new Map<Uuid, T>(data.map((item) => [item.id, item]))
  );

  const getById = (id: Uuid): T | null => _dataPerId.get(id) || null;

  const isOwnedById = (id: Uuid): boolean => !!getById(id)?.isOwned;

  const push = async (item: Editable<T>): Promise<Uuid> => {
    const newItem = {
      ...item,
      id: uuid(),
      createdAt: now(),
      updatedAt: now(),
      isOwned: true,
    } as T;

    if (localProfileStore.isLocalProfileEnabled) {
      newItem.isLocalOnly = true;
    }

    await waitForTransaction(
      idbTable.add(toIdbData(newItem, !newItem.isLocalOnly))
    );

    return newItem.id;
  };

  const editById = async (id: Uuid, item: Editable<T>) => {
    const oldItem = getById(id);

    if (!oldItem?.isOwned) {
      // eslint-disable-next-line no-console
      console.error(`Failed to modify item: ${id}`);
      return;
    }

    const newItem = {
      ...item,
      id,
      createdAt: oldItem.createdAt,
      updatedAt: now(),
      isOwned: true,
    } as T;

    if (oldItem.isLocalOnly) {
      newItem.isLocalOnly = true;
    }

    await waitForTransaction(
      idbTable.update(id, toIdbData(newItem, !newItem.isLocalOnly))
    );
  };

  const deleteById = async (id: Uuid) => {
    const item = getById(id);

    if (!item?.isOwned) {
      // eslint-disable-next-line no-console
      console.warn(`Failed to delete item: ${id}`);
      return;
    }

    await waitForTransaction(
      item.isLocalOnly
        ? idbTable.where('id').equals(id).delete()
        : idbTable.update(id, { toDelete: IndexableBoolean.True })
    );
  };

  return {
    state: computed(() => data),
    ownedState: computed(() => ownedData),
    isReady: computed(() => isDataReady),
    isInSync: computed(() => isDataInSync),
    readyPromise: computed(() => dataReadyPromise),
    syncPromise: computed(() => dataSyncPromise),
    getById,
    isOwnedById,
    push,
    editById,
    deleteById,
  };
};
