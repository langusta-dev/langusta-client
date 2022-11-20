import { flushPromises } from '@vue/test-utils';

import { expectUuid, expectDateString } from '~test-utils';

import { useLocalProfileStore } from '~/stores/localProfile';
import { useSessionStore } from '~/stores/session';

import { useSynchronizableArray } from '~/composables/dataSync';

import type { Editable, SynchronizableData } from '~/types/dataSync';

interface ExampleDataItem extends SynchronizableData {
  someValue: string;
}

type EditableExampleDataItem = Editable<ExampleDataItem>;

const expectExampleDataItem = (item: EditableExampleDataItem) => ({
  ...item,
  id: expectUuid(),
  createdAt: expectDateString(),
  updatedAt: expectDateString(),
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

    const { state } = $(
      useSynchronizableArray<ExampleDataItem>(
        'some-data',
        vi.fn(() => Promise.resolve([testItem])),
        vi.fn(),
        vi.fn()
      )
    );

    await flushPromises();

    // Then
    expect(state).toStrictEqual([testItem]);
  });

  it('should allow to add new items to state', () => {
    const { state, push } = $(
      useSynchronizableArray<ExampleDataItem>(
        'some-data',
        vi.fn(() => Promise.resolve([])),
        vi.fn(),
        vi.fn()
      )
    );

    expect(state).toStrictEqual([]);

    push(testItem1);

    expect(state).toStrictEqual([expectExampleDataItem(testItem1)]);

    push(testItem2);
    push(testItem3);
    push(testItem1);

    expect(state).toStrictEqual([
      expectExampleDataItem(testItem1),
      expectExampleDataItem(testItem2),
      expectExampleDataItem(testItem3),
      expectExampleDataItem(testItem1),
    ]);
  });

  it('should allow to retrieve items by their id', () => {
    const { state, push, getById } = $(
      useSynchronizableArray<ExampleDataItem>(
        'some-data',
        vi.fn(() => Promise.resolve([])),
        vi.fn(),
        vi.fn()
      )
    );

    push(testItem1);
    push(testItem2);
    push(testItem3);

    expect(state).toStrictEqual([
      expectExampleDataItem(testItem1),
      expectExampleDataItem(testItem2),
      expectExampleDataItem(testItem3),
    ]);

    expect(getById(state[0].id)).toStrictEqual(
      expectExampleDataItem(testItem1)
    );

    expect(getById(state[1].id)).toStrictEqual(
      expectExampleDataItem(testItem2)
    );

    expect(getById(state[2].id)).toStrictEqual(
      expectExampleDataItem(testItem3)
    );

    expect(getById('non-existing-id')).toBe(null);
  });

  it('should allow to delete items from state', () => {
    const { state, push, deleteById } = $(
      useSynchronizableArray<ExampleDataItem>(
        'some-data',
        vi.fn(() => Promise.resolve([])),
        vi.fn(),
        vi.fn()
      )
    );

    push(testItem1);
    push(testItem2);
    push(testItem3);

    expect(state).toStrictEqual([
      expectExampleDataItem(testItem1),
      expectExampleDataItem(testItem2),
      expectExampleDataItem(testItem3),
    ]);

    deleteById(state[0].id);
    deleteById(state[1].id);

    expect(state).toStrictEqual([expectExampleDataItem(testItem2)]);
  });

  it('should allow to overwrite items in state', () => {
    const { state, push, editById } = $(
      useSynchronizableArray<ExampleDataItem>(
        'some-data',
        vi.fn(() => Promise.resolve([])),
        vi.fn(),
        vi.fn()
      )
    );

    push(testItem1);
    push(testItem2);
    push(testItem3);

    expect(state).toStrictEqual([
      expectExampleDataItem(testItem1),
      expectExampleDataItem(testItem2),
      expectExampleDataItem(testItem3),
    ]);

    editById(state[0].id, testItem2);
    editById(state[1].id, testItem3);
    editById(state[2].id, testItem2);

    expect(state).toStrictEqual([
      expectExampleDataItem(testItem2),
      expectExampleDataItem(testItem3),
      expectExampleDataItem(testItem2),
    ]);
  });

  it('it should sync added items', async () => {
    const uploader = vi.fn(() => Promise.resolve([]));

    const { push } = $(
      useSynchronizableArray<ExampleDataItem>(
        'some-data',
        vi.fn(() => Promise.resolve([])),
        uploader,
        vi.fn()
      )
    );

    push(testItem1);
    await flushPromises();
    expect(uploader).toHaveBeenCalledOnce();
    expect(uploader).toHaveBeenCalledWith([expectExampleDataItem(testItem1)]);

    push(testItem2);
    await flushPromises();
    expect(uploader).toHaveBeenCalledTimes(2);
    expect(uploader).toHaveBeenCalledWith([expectExampleDataItem(testItem2)]);

    push(testItem3);
    await flushPromises();
    expect(uploader).toHaveBeenCalledTimes(3);
    expect(uploader).toHaveBeenCalledWith([expectExampleDataItem(testItem3)]);
  });

  it('it should sync deleted items', async () => {
    const deleter = vi.fn(() => Promise.resolve([]));

    const { state, push, deleteById } = $(
      useSynchronizableArray<ExampleDataItem>(
        'some-data',
        vi.fn(() => Promise.resolve([])),
        vi.fn(),
        deleter
      )
    );

    push(testItem1);
    push(testItem2);
    push(testItem3);

    expect(state).toStrictEqual([
      expectExampleDataItem(testItem1),
      expectExampleDataItem(testItem2),
      expectExampleDataItem(testItem3),
    ]);

    await flushPromises();

    {
      const id = state[0].id;
      deleteById(id);
      await flushPromises();
      expect(deleter).toHaveBeenCalledOnce();
      expect(deleter).toHaveBeenCalledWith([id]);
    }

    {
      const id = state[0].id;
      deleteById(id);
      await flushPromises();
      expect(deleter).toHaveBeenCalledTimes(2);
      expect(deleter).toHaveBeenCalledWith([id]);
    }

    {
      const id = state[0].id;
      deleteById(id);
      await flushPromises();
      expect(deleter).toHaveBeenCalledTimes(3);
      expect(deleter).toHaveBeenCalledWith([id]);
    }
  });

  it('it should sync edited items', async () => {
    const uploader = vi.fn(() => Promise.resolve([]));

    const { state, push, editById } = $(
      useSynchronizableArray<ExampleDataItem>(
        'some-data',
        vi.fn(() => Promise.resolve([])),
        uploader,
        vi.fn()
      )
    );

    push(testItem1);
    push(testItem2);
    push(testItem3);
    await flushPromises();
    uploader.mockClear();

    {
      const id = state[0].id;
      editById(id, testItem2);
      await flushPromises();
      expect(uploader).toHaveBeenCalledOnce();
      expect(uploader).toHaveBeenCalledWith([
        { ...expectExampleDataItem(testItem2), id },
      ]);
    }

    {
      const id = state[0].id;
      editById(id, testItem3);
      await flushPromises();
      expect(uploader).toHaveBeenCalledTimes(2);
      expect(uploader).toHaveBeenCalledWith([
        { ...expectExampleDataItem(testItem3), id },
      ]);
    }

    {
      const id = state[2].id;
      editById(id, testItem1);
      await flushPromises();
      expect(uploader).toHaveBeenCalledTimes(3);
      expect(uploader).toHaveBeenCalledWith([
        { ...expectExampleDataItem(testItem1), id },
      ]);
    }
  });

  it(`Given authenticated user
      and some data in local storage,
      When initializer returns null,
      Then should use the data from local storage`, async () => {
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
    localStorage.setItem('some-data', JSON.stringify([testItem]));

    // When
    const initializer = vi.fn(() => Promise.resolve(null));

    const { state } = $(
      useSynchronizableArray<ExampleDataItem>(
        'some-data',
        initializer,
        vi.fn(),
        vi.fn()
      )
    );

    await flushPromises();

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

    useSynchronizableArray<ExampleDataItem>(
      'some-data',
      initializer,
      vi.fn(),
      vi.fn()
    );

    await flushPromises();

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

    const { state, push, editById, deleteById } = $(
      useSynchronizableArray<ExampleDataItem>(
        'some-data',
        vi.fn(() => Promise.resolve([])),
        uploader,
        deleter
      )
    );

    await flushPromises();

    // When
    push(testItem1);
    push(testItem2);
    push(testItem3);

    editById(state[0].id, testItem3);

    deleteById(state[2].id);

    await flushPromises();

    // Then
    expect(uploader).not.toHaveBeenCalled();
    expect(deleter).not.toHaveBeenCalled();

    expect(state).toStrictEqual([
      expectExampleDataItem({ ...testItem3, isLocalOnly: true }),
      expectExampleDataItem({ ...testItem2, isLocalOnly: true }),
    ]);
  });
});
