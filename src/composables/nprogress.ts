import { useNProgress } from '@vueuse/integrations/useNProgress'

const { start, done, isLoading } = useNProgress(null, { showSpinner: false })

let activeJobCount = $ref(0)

watchDebounced(
  $$(activeJobCount),
  (v) => {
    if (v && !isLoading.value) {
      start()
    } else if (!v && isLoading.value) {
      done()
    }
  },
  { debounce: 50, maxWait: 100 }
)

export const startNProgress = () => {
  activeJobCount++
}

export const stopNProgress = () => {
  activeJobCount = Math.max(0, activeJobCount - 1)
}
