import { v4 as uuid } from 'uuid';

import { useLocalProfileStore } from '~/stores/localProfile';
import { useSessionStore } from '~/stores/session';

import { isOnline } from './online';

import type { Ref } from 'vue';
import type {
  Editable,
  LocalOnly,
  Owned,
  SynchronizableData,
} from '~/types/dataSync';
import type { Uuid } from '~/types/uuid';

const now = () => new Date().toString();

const MAX_INIT_RETRY_COUNT = 1;
const SYNC_DEBOUNCE = 5000; // ms

export const useSynchronizableArray = <T extends SynchronizableData>(
  localStorageKey: string,
  initializer: (
    localOnlyData: LocalOnly<T>[]
  ) => T[] | null | Promise<T[] | null>,
  uploader: (data: T[]) => Promise<Uuid[] | null>,
  deleter: (data: Uuid[]) => Promise<Uuid[] | null>,
  initialData: T[] = []
) => {
  const sessionStore = useSessionStore();
  const localProfileStore = useLocalProfileStore();

  const data = $(useLocalStorage<T[]>(localStorageKey, initialData));

  const localOnlyData = $computed(() =>
    data.filter((item): item is LocalOnly<T> => !!item.isLocalOnly)
  );

  const dataToUpload = $(
    useLocalStorage<T[]>(`${localStorageKey}-to-upload`, [])
  );

  const dataIdsToDelete = $(
    useLocalStorage<Uuid[]>(`${localStorageKey}-ids-to-delete`, [])
  );

  const dataIdsToDeleteSet = $computed(() => new Set(dataIdsToDelete));

  const setData = (newData: T[]) => {
    let fullData = [...newData, ...dataToUpload];

    if (dataIdsToDelete.length) {
      fullData = fullData.filter(({ id }) => !dataIdsToDeleteSet.has(id));
    }

    data.splice(
      0,
      data.length,
      ...fullData,

      // data created via local profile should be always preserved
      ...localOnlyData
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
        let newData = await initializer(localOnlyData);

        while (!newData && retryCount < MAX_INIT_RETRY_COUNT) {
          retryCount++;
          newData = await initializer(localOnlyData);
        }

        if (newData) {
          setData(newData);
        }
      }

      isDataReady = true;
    },
    { immediate: true }
  );

  const _autosync = <U>(
    itemsRef: Ref<U[]>,
    synchronizer: (items: U[]) => Promise<Uuid[] | null>
  ) => {
    watch(
      [refDebounced(itemsRef, SYNC_DEBOUNCE), isOnline],
      async ([items, online]) => {
        if (!online || !items.length) {
          return;
        }

        const syncedIds = await synchronizer([...items]);

        if (syncedIds) {
          items.splice(0, items.length);
        }

        // TODO
        // what to do with items
        // that were not included in `syncedIds`?
      },
      { immediate: true, deep: true }
    );
  };

  _autosync($$(dataToUpload), uploader);
  _autosync($$(dataIdsToDelete), deleter);

  const ownedData = $computed(() =>
    data.filter((item): item is Owned<T> => !!item.isOwned)
  );

  const _dataPerId = $computed(
    () => new Map<Uuid, T>(data.map((item) => [item.id, item]))
  );

  const getById = (id: Uuid): T | null => _dataPerId.get(id) || null;

  const isOwnedById = (id: Uuid): boolean => !!getById(id)?.isOwned;

  const push = (item: Editable<T>): void => {
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

    data.push(newItem);

    if (!newItem.isLocalOnly) {
      dataToUpload.push(newItem);
    }
  };

  const editById = (id: Uuid, item: Editable<T>): void => {
    const oldItem = getById(id);
    const oldItemIndex = data.findIndex((item) => item.id === id);

    if (!oldItem?.isOwned || oldItemIndex === -1) {
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
    } else {
      const itemToUploadIndex = dataToUpload.findIndex(
        (item) => item.id === id
      );

      if (itemToUploadIndex !== -1) {
        dataToUpload.splice(itemToUploadIndex, 1);
      }

      dataToUpload.push(newItem);
    }

    data.splice(oldItemIndex, 1, newItem);
  };

  const deleteById = (id: Uuid): void => {
    const index = data.findIndex((item) => item.id === id);

    if (index === -1 || !data[index].isOwned) {
      // eslint-disable-next-line no-console
      console.warn(`Failed to delete item: ${id}`);
      return;
    }

    if (!data[index].isLocalOnly) {
      dataIdsToDelete.push(id);
    }

    data.splice(index, 1);
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
