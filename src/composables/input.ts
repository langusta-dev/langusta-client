const useInput = () => {
  const value = $ref('');

  let hasError = $ref(false);

  const triggerError = () => {
    hasError = true;
    watchOnce($$(value), () => {
      hasError = false;
    });
  };

  return $$({ value, hasError, triggerError });
};

export const useInputGroup = <T extends string>(inputKeys: T[]) => {
  const inputsData = $ref(
    Object.fromEntries(inputKeys.map((key) => [key, reactive(useInput())]))
  );

  const setValueByKey = (key: T, value: string) => {
    inputsData[key].value = value;
  };

  const getValueByKey = (key: T) => inputsData[key].value;

  const hasErrorByKey = (key: T) => inputsData[key].hasError;

  const triggerErrorByKey = (key: T) => {
    inputsData[key].triggerError();
  };

  const hasEmptyValues = computed(() => !inputKeys.every(getValueByKey));

  const hasErrors = computed(() => inputKeys.some(hasErrorByKey));

  const injectValueByKey = (key: T) =>
    computed({
      get: () => getValueByKey(key),
      set: (v) => setValueByKey(key, v),
    });

  return $$({
    hasErrorByKey,
    triggerErrorByKey,
    hasEmptyValues,
    hasErrors,
    injectValueByKey,
  });
};
