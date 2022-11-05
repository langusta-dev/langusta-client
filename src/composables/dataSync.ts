import { v4 as uuid } from 'uuid';

import { useLocalProfileStore } from '~/stores/localProfile';
import { useSessionStore } from '~/stores/session';

import { isOnline } from './online';

import type { Ref } from 'vue';
import type { Editable, SynchronizableData } from '~/types/dataSync';
import type { Uuid } from '~/types/uuid';

const now = () => new Date().toString();

export const useSynchronizableArray = <T extends SynchronizableData>(
  localStorageKey: string,
  initializer: () => T[] | Promise<T[]>,
  uploader: (data: T[]) => Promise<boolean>,
  deleter: (data: Uuid[]) => Promise<boolean>,
  initialData: T[]
) => {
  const sessionStore = useSessionStore();
  const localProfileStore = useLocalProfileStore();

  const data = $(useLocalStorage<T[]>(localStorageKey, initialData));

  const dataPerId = $computed(
    () => new Map<Uuid, T>(data.map((item) => [item.id, item]))
  );

  const setData = (newData: T[]) => {
    data.splice(
      0,
      data.length,
      ...newData,

      // data created via local profile should be always preserved
      ...data.filter(({ isLocalOnly }) => isLocalOnly)
    );
  };

  let isDataReady = $ref(!sessionStore.isAuth);
  whenever(
    () => sessionStore.isAuth,
    () => {
      isDataReady = false;
    }
  );

  whenever(
    () => !isDataReady,
    async () => {
      if (sessionStore.isAuth) {
        setData(await initializer());
      }

      isDataReady = true;
    },
    { immediate: true }
  );

  const dataToUpload = $(
    useLocalStorage<T[]>(`${localStorageKey}-to-upload`, [])
  );

  const dataIdsToDelete = $(
    useLocalStorage<Uuid[]>(`${localStorageKey}-ids-to-delete`, [])
  );

  const _autosync = <U>(
    itemsRef: Ref<U[]>,
    synchronizer: (items: U[]) => boolean | Promise<boolean>
  ) => {
    watch(
      [itemsRef, isOnline],
      async () => {
        if (isOnline.value && itemsRef.value.length) {
          const isSync = await synchronizer(itemsRef.value);

          if (isSync) {
            itemsRef.value.splice(0, itemsRef.value.length);
          }
        }
      },
      { immediate: true }
    );
  };

  _autosync($$(dataToUpload), uploader);
  _autosync($$(dataIdsToDelete), deleter);

  const getById = (id: Uuid): T | null => dataPerId.get(id) || null;

  const push = (item: Editable<T>): void => {
    const newItem = {
      id: uuid(),
      createdAt: now(),
      updatedAt: now(),
      ...item,
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

    if (!oldItem) {
      // eslint-disable-next-line no-console
      console.error(`Failed to modify item: ${id}`);
      return;
    }

    const newItem = {
      id,
      createdAt: oldItem.createdAt,
      updatedAt: now(),
      ...item,
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

    deleteById(id);
    data.push(newItem);
  };

  const deleteById = (id: Uuid): void => {
    const index = data.findIndex((item) => item.id === id);

    if (index !== -1) {
      data.splice(index, 1);
    } else {
      // eslint-disable-next-line no-console
      console.warn(`Failed to delete item: ${id}`);
    }

    dataIdsToDelete.push(id);
  };

  return {
    state: computed(() => data),
    isReady: computed(() => isDataReady),
    isInSync: computed(() => !dataToUpload.length && !dataIdsToDelete.length),
    getById,
    push,
    editById,
    deleteById,
  };
};
