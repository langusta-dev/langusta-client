describe('is', () => {
  const SAMPLES = {
    array: [1, 2, 3],
    false: false,
    function: () => null,
    null: null,
    number: 123,
    numeric: '123',
    object: { value: 123 },
    string: 'abc',
    true: true,
    undefined,
  };

  type SampleKey = keyof typeof SAMPLES;

  const testSamples = (fn: (value: unknown) => boolean) =>
    Object.keys(SAMPLES).filter((key) => fn(SAMPLES[key as SampleKey]));

  describe('isArray', () => {
    it('should be array', () => {
      const results = testSamples(isArray);
      expect(results).toHaveLength(1);
      expect(results).toContain('array');
    });
  });

  describe('isBool', () => {
    it('should be boolean', () => {
      const results = testSamples(isBool);
      expect(results).toHaveLength(2);
      expect(results).toContain('true');
      expect(results).toContain('false');
    });
  });

  describe('isFn', () => {
    it('should be function', () => {
      const results = testSamples(isFn);
      expect(results).toHaveLength(1);
      expect(results).toContain('function');
    });
  });

  describe('isNullish', () => {
    it('should be nullish', () => {
      const results = testSamples(isNullish);
      expect(results).toHaveLength(2);
      expect(results).toContain('null');
      expect(results).toContain('undefined');
    });
  });

  describe('isNum', () => {
    it('should be number', () => {
      const results = testSamples(isNum);
      expect(results).toHaveLength(1);
      expect(results).toContain('number');
    });
  });

  describe('isNumeric', () => {
    it('should be numeric', () => {
      const results = testSamples(isNumeric);
      expect(results).toHaveLength(2);
      expect(results).toContain('number');
      expect(results).toContain('numeric');
    });
  });

  describe('isObj', () => {
    it('should be object', () => {
      const results = testSamples(isObj);
      expect(results).toHaveLength(1);
      expect(results).toContain('object');
    });
  });

  describe('isStr', () => {
    it('should be string', () => {
      const results = testSamples(isStr);
      expect(results).toHaveLength(2);
      expect(results).toContain('numeric');
      expect(results).toContain('string');
    });
  });
});
