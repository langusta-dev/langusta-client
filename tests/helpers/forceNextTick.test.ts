describe('forceNextTick', () => {
  it('should request animation frame twice', async () => {
    const requestAnimationFrameMock = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: any) => cb())

    await forceNextTick()

    expect(requestAnimationFrameMock).toHaveBeenCalledTimes(2)
  })
})
