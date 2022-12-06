import type { DateString } from './basic';
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

export type Editable<T extends SynchronizableData> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | 'isLocalOnly' | 'isOwned'
>;
