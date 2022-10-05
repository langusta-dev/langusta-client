import { useNProgress } from '@vueuse/integrations/useNProgress'

const { start, done, isLoading } = useNProgress(null, { showSpinner: false })

let activeJobCount = $ref(0)

const activeJobCountDebounced = refDebounced($$(activeJobCount), 50)
watch(activeJobCountDebounced, (v) => {
  if (v && !isLoading.value) {
    start()
  } else if (!v && isLoading.value) {
    done()
  }
})

export const startNProgress = () => {
  activeJobCount++
}

export const stopNProgress = () => {
  activeJobCount = Math.max(0, activeJobCount - 1)
}
