import { expectUuid, expectDateString } from '~test-utils';

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
});
