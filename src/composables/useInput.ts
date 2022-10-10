export const useInput = () => {
  const value = $ref('')

  let hasError = $ref(false)

  const triggerError = () => {
    hasError = true
  }

  watch($$(value), () => {
    if (hasError) {
      hasError = false
    }
  })

  return $$({ value, hasError, triggerError })
}
