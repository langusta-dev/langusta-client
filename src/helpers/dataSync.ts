import { IndexableBoolean } from '~/types/idb';

import type { SynchronizableData, IdbData } from '~/types/dataSync';

export const toIdbData = <T extends SynchronizableData>(
  item: T,
  toUpload = false,
  toDelete = false
): IdbData<T> => ({
  id: item.id,
  data: JSON.stringify(item),
  toUpload: toUpload ? IndexableBoolean.True : IndexableBoolean.False,
  toDelete: toDelete ? IndexableBoolean.True : IndexableBoolean.False,
});

export const parseIdbData = <T extends SynchronizableData>({
  data,
}: IdbData<T>): T | null => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};
