import {
  expectUuid,
  expectDateString,
  flushDelayedPromises,
} from '~test-utils';

import { useLocalProfileStore } from '~/stores/localProfile';
import { useSessionStore } from '~/stores/session';

import { useSynchronizableArray, idb } from '~/composables/dataSync';

import { toIdbData } from '~/helpers/dataSync';

import type { Editable, SynchronizableData } from '~/types/dataSync';

interface ExampleDataItem extends SynchronizableData {
  someValue: string;
}

type EditableExampleDataItem = Editable<ExampleDataItem>;

const expectExampleDataItem = (
  item: EditableExampleDataItem & Partial<ExampleDataItem>
) => ({
  ...item,
  id: expectUuid(),
  createdAt: expectDateString(),
  updatedAt: expectDateString(),
  isOwned: true,
});

describe('useSynchronizableArray', () => {
  const testItem1: EditableExampleDataItem = { someValue: 'abc1' };
  const testItem2: EditableExampleDataItem = { someValue: 'abc2' };
  const testItem3: EditableExampleDataItem = { someValue: 'abc3' };

  it(`Given authenticated user,
      Then should set data from initializer`, async () => {
    const testItem: ExampleDataItem = {
      ...testItem1,
      id: 'some-id',
      createdAt: 'abc',
      updatedAt: 'def',
    };

    const sessionStore = useSessionStore();

    // Given
    // @ts-expect-error it's readonly
    sessionStore.isAuth = true;

    const { state, readyPromise } = $(
      useSynchronizableArray<ExampleDataItem>(
        'recipes',
        vi.fn(() => Promise.resolve([testItem])),
        vi.fn(),
        vi.fn()
      )
    );

    await readyPromise;

    // Then
    expect(state).toStrictEqual([testItem]);
  });

  it('should allow to add new items to state', async () => {
    const { state, push, readyPromise } = $(
      useSynchronizableArray<ExampleDataItem>(
        'recipes',
        vi.fn(() => Promise.resolve([])),
        vi.fn(),
        vi.fn()
      )
    );

    await readyPromise;

    expect(state).toStrictEqual([]);

    await push(testItem1);

    expect(state).toStrictEqual([expectExampleDataItem(testItem1)]);

    await push(testItem2);
    await push(testItem3);
    await push(testItem1);

    expect(state).toContainEqual(expectExampleDataItem(testItem1));
    expect(state).toContainEqual(expectExampleDataItem(testItem2));
    expect(state).toContainEqual(expectExampleDataItem(testItem3));
    expect(
      state.filter(({ someValue }) => someValue === testItem1.someValue)
    ).toHaveLength(2);
  });

  it('should allow to retrieve items by their id', async () => {
    const { state, push, getById, readyPromise } = $(
      useSynchronizableArray<ExampleDataItem>(
        'recipes',
        vi.fn(() => Promise.resolve([])),
        vi.fn(),
        vi.fn()
      )
    );

    await readyPromise;

    await push(testItem1);
    await push(testItem2);
    await push(testItem3);

    expect(state).toContainEqual(expectExampleDataItem(testItem1));
    expect(state).toContainEqual(expectExampleDataItem(testItem2));
    expect(state).toContainEqual(expectExampleDataItem(testItem3));

    expect(getById(state[0].id)).toStrictEqual(state[0]);
    expect(getById(state[1].id)).toStrictEqual(state[1]);
    expect(getById(state[2].id)).toStrictEqual(state[2]);

    expect(getById('non-existing-id')).toBe(null);
  });

  it('should allow to delete items from state', async () => {
    const { state, push, deleteById, readyPromise } = $(
      useSynchronizableArray<ExampleDataItem>(
        'recipes',
        vi.fn(() => Promise.resolve([])),
        vi.fn(),
        vi.fn()
      )
    );

    await readyPromise;

    await push(testItem1);
    await push(testItem2);
    await push(testItem3);

    expect(state).toContainEqual(expectExampleDataItem(testItem1));
    expect(state).toContainEqual(expectExampleDataItem(testItem2));
    expect(state).toContainEqual(expectExampleDataItem(testItem3));

    const preservedItem = state[2];

    await deleteById(state[0].id);
    await deleteById(state[0].id);

    expect(state).toStrictEqual([preservedItem]);
  });

  it('should allow to overwrite items in state', async () => {
    const { state, getById, push, editById, readyPromise } = $(
      useSynchronizableArray<ExampleDataItem>(
        'recipes',
        vi.fn(() => Promise.resolve([])),
        vi.fn(),
        vi.fn()
      )
    );

    await readyPromise;

    await push(testItem1);
    await push(testItem2);
    await push(testItem3);

    expect(state).toContainEqual(expectExampleDataItem(testItem1));
    expect(state).toContainEqual(expectExampleDataItem(testItem2));
    expect(state).toContainEqual(expectExampleDataItem(testItem3));

    const id1 = state[0].id;
    const id2 = state[1].id;
    const id3 = state[2].id;

    await editById(id1, testItem2);
    await editById(id2, testItem3);
    await editById(id3, testItem2);

    expect(getById(id1)).toStrictEqual(expectExampleDataItem(testItem2));
    expect(getById(id2)).toStrictEqual(expectExampleDataItem(testItem3));
    expect(getById(id3)).toStrictEqual(expectExampleDataItem(testItem2));
  });

  it('should preserve `createdAt` entry on edit', async () => {
    vi.useFakeTimers();

    const { state, getById, push, editById, readyPromise } = $(
      useSynchronizableArray<ExampleDataItem>(
        'recipes',
        vi.fn(() => Promise.resolve([])),
        vi.fn(),
        vi.fn()
      )
    );

    await readyPromise;

    const getItem = () => getById(state[0].id) as ExampleDataItem;

    const createdAtDate = new Date();

    await push(testItem1);
    expect(getItem().createdAt).toBe(createdAtDate.toString());

    vi.advanceTimersByTime(1000);

    await editById(state[0].id, testItem2);
    expect(getItem().createdAt).toBe(createdAtDate.toString());
  });

  it('should update `updatedAt` entry on edit', async () => {
    vi.useFakeTimers();

    const { state, getById, push, editById, readyPromise } = $(
      useSynchronizableArray<ExampleDataItem>(
        'recipes',
        vi.fn(() => Promise.resolve([])),
        vi.fn(),
        vi.fn()
      )
    );

    await readyPromise;

    const getItem = () => getById(state[0].id) as ExampleDataItem;

    const createdAtDate = new Date();
    const updatedAtDate = new Date(createdAtDate);

    await push(testItem1);
    expect(getItem().updatedAt).toBe(getItem().createdAt);
    expect(getItem().updatedAt).toBe(updatedAtDate.toString());

    vi.advanceTimersByTime(1000);
    updatedAtDate.setSeconds(createdAtDate.getSeconds() + 1);

    await editById(state[0].id, testItem2);
    expect(getItem().updatedAt).not.toBe(getItem().createdAt);
    expect(getItem().updatedAt).toBe(updatedAtDate.toString());
  });

  it('it should sync added items', async () => {
    vi.useFakeTimers();
    const uploader = vi.fn(() => Promise.resolve([]));

    const { push, readyPromise } = $(
      useSynchronizableArray<ExampleDataItem>(
        'recipes',
        vi.fn(() => Promise.resolve([])),
        uploader,
        vi.fn()
      )
    );

    await readyPromise;

    await push(testItem1);
    await flushDelayedPromises();
    expect(uploader).toHaveBeenCalledOnce();
    expect(uploader).toHaveBeenCalledWith([expectExampleDataItem(testItem1)]);

    await push(testItem2);
    await flushDelayedPromises();
    expect(uploader).toHaveBeenCalledTimes(2);
    expect(uploader).toHaveBeenCalledWith([expectExampleDataItem(testItem2)]);

    await push(testItem3);
    await flushDelayedPromises();
    expect(uploader).toHaveBeenCalledTimes(3);
    expect(uploader).toHaveBeenCalledWith([expectExampleDataItem(testItem3)]);
  });

  it('it should sync deleted items', async () => {
    vi.useFakeTimers();
    const deleter = vi.fn(() => Promise.resolve([]));

    const { state, push, deleteById, readyPromise } = $(
      useSynchronizableArray<ExampleDataItem>(
        'recipes',
        vi.fn(() => Promise.resolve([])),
        vi.fn(),
        deleter
      )
    );

    await readyPromise;

    await push(testItem1);
    await push(testItem2);
    await push(testItem3);

    expect(state).toContainEqual(expectExampleDataItem(testItem1));
    expect(state).toContainEqual(expectExampleDataItem(testItem2));
    expect(state).toContainEqual(expectExampleDataItem(testItem3));

    await flushDelayedPromises();

    {
      const id = state[0].id;
      await deleteById(id);
      await flushDelayedPromises();
      expect(deleter).toHaveBeenCalledOnce();
      expect(deleter).toHaveBeenCalledWith([id]);
    }

    {
      const id = state[0].id;
      await deleteById(id);
      await flushDelayedPromises();
      expect(deleter).toHaveBeenCalledTimes(2);
      expect(deleter).toHaveBeenCalledWith([id]);
    }

    {
      const id = state[0].id;
      await deleteById(id);
      await flushDelayedPromises();
      expect(deleter).toHaveBeenCalledTimes(3);
      expect(deleter).toHaveBeenCalledWith([id]);
    }
  });

  it('it should sync edited items', async () => {
    vi.useFakeTimers();
    const uploader = vi.fn(() => Promise.resolve([]));

    const { state, push, editById, readyPromise } = $(
      useSynchronizableArray<ExampleDataItem>(
        'recipes',
        vi.fn(() => Promise.resolve([])),
        uploader,
        vi.fn()
      )
    );

    await readyPromise;

    await push(testItem1);
    await push(testItem2);
    await push(testItem3);
    await flushDelayedPromises();
    uploader.mockClear();

    {
      const id = state[0].id;
      await editById(id, testItem2);
      await flushDelayedPromises();
      expect(uploader).toHaveBeenCalledOnce();
      expect(uploader).toHaveBeenCalledWith([
        { ...expectExampleDataItem(testItem2), id },
      ]);
    }

    {
      const id = state[0].id;
      await editById(id, testItem3);
      await flushDelayedPromises();
      expect(uploader).toHaveBeenCalledTimes(2);
      expect(uploader).toHaveBeenCalledWith([
        { ...expectExampleDataItem(testItem3), id },
      ]);
    }

    {
      const id = state[2].id;
      await editById(id, testItem1);
      await flushDelayedPromises();
      expect(uploader).toHaveBeenCalledTimes(3);
      expect(uploader).toHaveBeenCalledWith([
        { ...expectExampleDataItem(testItem1), id },
      ]);
    }
  });

  it(`Given authenticated user
      and some data in IndexedDB,
      When initializer returns null,
      Then should use the data from IndexedDB`, async () => {
    const sessionStore = useSessionStore();

    const testItem: ExampleDataItem = {
      ...testItem1,
      id: 'some-id',
      createdAt: 'abc',
      updatedAt: 'def',
    };

    // Given
    // @ts-expect-error it's readonly
    sessionStore.isAuth = true;
    await idb.recipes.add(toIdbData(testItem));

    // When
    const initializer = vi.fn(() => Promise.resolve(null));

    const { state, readyPromise } = $(
      useSynchronizableArray<ExampleDataItem>(
        'recipes',
        initializer,
        vi.fn(),
        vi.fn()
      )
    );

    await readyPromise;

    expect(initializer).toHaveBeenCalled();

    // Then
    expect(state).toStrictEqual([testItem]);
  });

  it(`Given authenticated user,
      When initializer returns null,
      Then it should be called again`, async () => {
    const sessionStore = useSessionStore();

    // Given
    // @ts-expect-error it's readonly
    sessionStore.isAuth = true;

    // When
    const initializer = vi.fn(() => Promise.resolve(null));

    const { readyPromise } = $(
      useSynchronizableArray<ExampleDataItem>(
        'recipes',
        initializer,
        vi.fn(),
        vi.fn()
      )
    );

    await readyPromise;

    // Then
    expect(initializer).toHaveBeenCalledTimes(2);
  });

  it(`Given user using local profile,
      When items are added, editied or deleted,
      Then they should be marked as local only
      and should not be synchronized`, async () => {
    const uploader = vi.fn();
    const deleter = vi.fn();

    // Given
    const localProfileStore = useLocalProfileStore();
    localProfileStore.enableLocalProfile();

    const { state, push, editById, deleteById, readyPromise } = $(
      useSynchronizableArray<ExampleDataItem>(
        'recipes',
        vi.fn(() => Promise.resolve([])),
        uploader,
        deleter
      )
    );

    await readyPromise;

    // When
    const id1 = await push(testItem1);
    const id2 = await push(testItem3);
    await push(testItem2);

    await editById(id1, testItem3);
    await deleteById(id2);

    // Then
    expect(uploader).not.toHaveBeenCalled();
    expect(deleter).not.toHaveBeenCalled();

    expect(state).toHaveLength(2);

    expect(state).toContainEqual(
      expectExampleDataItem({ ...testItem3, isLocalOnly: true })
    );

    expect(state).toContainEqual(
      expectExampleDataItem({ ...testItem2, isLocalOnly: true })
    );
  });
});
