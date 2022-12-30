import { liveQuery } from 'dexie';
import { v4 as uuid } from 'uuid';

import { IndexableBoolean } from '~/types/idb';

import { useLocalProfileStore } from '~/stores/localProfile';
import { useSessionStore } from '~/stores/session';

import { idb } from './idb';
import { isOnline } from './online';

import type { Table } from 'dexie';
import type { Ref } from 'vue';
import type {
  Editable,
  Idb,
  LocalOnly,
  Owned,
  SynchronizableData,
} from '~/types/dataSync';
import type { Uuid } from '~/types/uuid';

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

  const idbTable = idb[idbTableKey] as Table<Idb<T>>;

  let idbData = $ref<Idb<T>[]>([]);
  let isIdbDataReady = $ref(false);

  const idbDataObserver = liveQuery<Idb<T>[]>(() => idbTable.toArray());

  idbDataObserver.subscribe({
    next: (v) => {
      idbData = v;

      if (!isIdbDataReady) {
        isIdbDataReady = true;
      }
    },
  });

  const data = $computed(() =>
    isIdbDataReady
      ? idbData.map(({ data }) => JSON.parse(data) as T)
      : initialData()
  ) as T[];

  const localOnlyData = $computed<LocalOnly<T>[]>(() =>
    data.filter((item): item is LocalOnly<T> => !!item.isLocalOnly)
  );

  const dataToUpload = $computed<T[]>(() =>
    idbData
      .filter(({ toUpload }) => toUpload)
      .map(({ data }) => JSON.parse(data) as T)
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

    await idbTable.where('toUpload').equals(IndexableBoolean.False).delete();

    await idbTable.bulkAdd(
      [
        ...newData.filter(
          ({ id }) => !dataIdsToDeleteSet.has(id) && !dataIdsToUploadSet.has(id)
        ),

        // data created via local profile should be always preserved
        ...localOnlyDataCopy,
      ].map((item) => ({
        id: item.id,
        data: JSON.stringify(item),
        toUpload: IndexableBoolean.False,
        toDelete: IndexableBoolean.False,
      }))
    );
  };

  let isDataReady = $ref(!sessionStore.isAuth);
  whenever(
    () => sessionStore.isAuth,
    () => {
      isDataReady = false;
    }
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

  const ownedData = $computed(() =>
    data.filter((item): item is Owned<T> => !!item.isOwned)
  );

  const _dataPerId = $computed(
    () => new Map<Uuid, T>(data.map((item) => [item.id, item]))
  );

  const getById = (id: Uuid): T | null => _dataPerId.get(id) || null;

  const isOwnedById = (id: Uuid): boolean => !!getById(id)?.isOwned;

  const push = async (item: Editable<T>) => {
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

    await idbTable.add({
      id: newItem.id,
      data: JSON.stringify(newItem),
      toDelete: IndexableBoolean.False,
      toUpload: newItem.isLocalOnly
        ? IndexableBoolean.False
        : IndexableBoolean.True,
    });
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

    await idbTable.update(newItem.id, {
      data: JSON.stringify(newItem),
      toDelete: IndexableBoolean.False,
      toUpload: newItem.isLocalOnly
        ? IndexableBoolean.False
        : IndexableBoolean.True,
    });
  };

  const deleteById = async (id: Uuid) => {
    const item = getById(id);

    if (!item?.isOwned) {
      // eslint-disable-next-line no-console
      console.warn(`Failed to delete item: ${id}`);
      return;
    }

    await (item.isLocalOnly
      ? idbTable.where('id').equals(id).delete()
      : idbTable.update(id, { toDelete: IndexableBoolean.True }));
  };

  return {
    state: computed(() => data),
    ownedState: computed(() => ownedData),
    isReady: computed(() => isDataReady),
    isInSync: computed(() => !dataToUpload.length && !dataIdsToDelete.length),
    getById,
    isOwnedById,
    push,
    editById,
    deleteById,
  };
};
