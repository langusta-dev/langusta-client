import type { DateString, JSONString } from './basic';
import type { IndexableBoolean } from './idb';
import type { Uuid } from './uuid';

export interface SynchronizableData {
  id: Uuid;
  createdAt: DateString;
  updatedAt: DateString;

  /**
   * data created via local profile is always preserved in local storage
   * it cannot be synchronized or published
   */
  isLocalOnly?: boolean;

  /**
   * data created by the current user is "owned" by them
   * it can be modified or deleted
   */
  isOwned?: boolean;
}

export interface PublishableData extends SynchronizableData {
  isPublic?: boolean;
  author?: string;
  description?: string;
}

export type LocalOnly<T extends SynchronizableData> = T & { isLocalOnly: true };

export type Owned<T extends SynchronizableData> = T & { isOwned: true };

export type Editable<T extends SynchronizableData> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | 'isLocalOnly' | 'isOwned'
>;

export interface Idb<_ extends SynchronizableData> {
  id: Uuid;
  data: JSONString;
  toUpload: IndexableBoolean;
  toDelete: IndexableBoolean;
}
