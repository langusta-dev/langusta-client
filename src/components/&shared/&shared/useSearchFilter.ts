import type { Ref } from 'vue';
import type { Uuid } from '~/types/uuid';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useSearchFilter = <T extends Record<string, any> & { id: Uuid }>(
  search: Ref<string>,
  items: Ref<T[]>,
  stringifier: (item: T) => string
) => {
  const _trimmedSearch = $computed(() =>
    search.value ? search.value.replace(/\s/g, '').toLowerCase() : ''
  );

  const _foundSearchIndexPerId = $computed(
    () =>
      new SafeMap<Uuid, number>(
        items.value.map((item) => [
          item.id,
          stringifier(item).toLowerCase().indexOf(_trimmedSearch),
        ]),
        { defaultSetter: () => -1 }
      )
  );

  const filteredItems = $computed(() => {
    if (!_trimmedSearch) {
      return items.value;
    }

    return items.value
      .filter(({ id }) => _foundSearchIndexPerId.get(id) !== -1)
      .sort(
        (a, b) =>
          _foundSearchIndexPerId.get(a.id) - _foundSearchIndexPerId.get(b.id)
      );
  });

  return $$({ filteredItems });
};
