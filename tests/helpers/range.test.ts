describe('range', () => {
  it('should create range array', () => {
    expect(range(3)).toStrictEqual([0, 1, 2])
    expect(range(1, 4)).toStrictEqual([1, 2, 3])
    expect(range(1, 8, 2)).toStrictEqual([1, 3, 5, 7])
  })
})
