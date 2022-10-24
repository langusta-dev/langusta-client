describe('deepEqual', () => {
  it('should compare primitive values', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual('abc', 'abc')).toBe(true);
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(true, true)).toBe(true);
  });

  it('should compare compound values', () => {
    expect(deepEqual({ abc: '123' }, { abc: '123' })).toBe(true);
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(deepEqual([1, 'b', 3], [1, 'b', 3])).toBe(true);
    expect(
      deepEqual({ abc: '123', def: [1, 2, 3] }, { abc: '123', def: [1, 2, 3] })
    ).toBe(true);

    expect(
      deepEqual(
        { abc: '123', def: [1, 2, 3], ghi: { jkl: true } },
        { abc: '123', def: [1, 2, 3], ghi: { jkl: true } }
      )
    ).toBe(true);

    expect(deepEqual([1, 2, 3], [1, 3, 2])).toBe(false);
    expect(
      deepEqual(
        { abc: '123', def: [1, 2, 3], ghi: { jkl: true } },
        { abc: '123', def: [1, 2, 3], ghi: { jkl: false } }
      )
    ).toBe(false);
  });

  it('should compare mixed values', () => {
    expect(deepEqual(null, [])).toBe(false);
    expect(deepEqual(1, [1])).toBe(false);
    expect(deepEqual([1], 1)).toBe(false);
    expect(deepEqual('abc', { abc: 'abc' })).toBe(false);
  });
});
