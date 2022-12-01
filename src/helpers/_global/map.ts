import type { Ref } from 'vue';

type SafeMapKey = string | number | symbol;

type MapEntries<K, V> = readonly (readonly [K, V])[] | null;

type SafeMapDefaultSetter<K, V> = (k: K) => V;

type SafeMapOptionsAllowedKeys<K> = K[] | Set<K> | Ref<K[]> | Ref<Set<K>>;

interface SafeMapOptions<K, V> {
  defaultSetter: SafeMapDefaultSetter<K, V>;
  allowedKeys?: SafeMapOptionsAllowedKeys<K>;
}

export class SafeMap<K extends SafeMapKey, V> extends Map<K, V> {
  private static forbiddenKeyCb = (
    accessedKey: SafeMapKey,
    allowedKeys: SafeMapKey[]
  ) => {
    // eslint-disable-next-line no-console
    console.warn(
      `[SafeMap]: Accessed a not allowed key: ${String(
        accessedKey
      )}. Allowed keys are: ${allowedKeys.map(String).join(', ')}`
    );
  };

  static setForbiddenKeyCb(cb: typeof this.forbiddenKeyCb) {
    this.forbiddenKeyCb = cb;
  }

  private defaultSetter: SafeMapDefaultSetter<K, V>;
  private allowedKeys: Ref<Set<K>> | undefined;

  constructor(options: SafeMapOptions<K, V>);
  constructor(entries: MapEntries<K, V>, options?: SafeMapOptions<K, V>);
  constructor(
    entriesOrOptions: MapEntries<K, V> | SafeMapOptions<K, V>,
    options?: SafeMapOptions<K, V>
  ) {
    let allowedKeys: SafeMapOptionsAllowedKeys<K> | undefined;

    if (options) {
      if (!isArray(entriesOrOptions)) {
        throw new Error('[SafeMap]: Incorrect constructor parameters');
      }

      super(entriesOrOptions);
      this.defaultSetter = options.defaultSetter;
      allowedKeys = options.allowedKeys;
    } else {
      if (!isObj(entriesOrOptions) || !('defaultSetter' in entriesOrOptions)) {
        throw new Error('[SafeMap]: Incorrect constructor parameters');
      }

      super();
      this.defaultSetter = entriesOrOptions.defaultSetter;
      allowedKeys = entriesOrOptions.allowedKeys;
    }

    if (allowedKeys) {
      this.allowedKeys = isRef(allowedKeys)
        ? computed(() => new Set((allowedKeys as Ref).value))
        : ref(new Set(allowedKeys));
    }
  }

  override get(k: K): V {
    if (!this.allowedKeys?.value.has(k)) {
      return this.defaultSetter(k);
    }

    if (!this.has(k)) {
      this.set(k, this.defaultSetter(k));
    }

    return this.get(k);
  }
}
