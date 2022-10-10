import type { Ref } from 'vue'

interface Options {
  modelValue: Ref<number | undefined>
  wrapperScrollTopPx: Ref<number>
  wrapperEl: Ref<HTMLDivElement>
}

type EmitFn = (event: 'update:modelValue', value: number) => void

export const useModelValue = (options: Options, emit: EmitFn) => {
  const { modelValue = 0, wrapperScrollTopPx, wrapperEl } = $(options)

  watchDebounced(
    $$(wrapperScrollTopPx),
    (v) => {
      if (v !== modelValue) {
        emit('update:modelValue', v)
      }
    },
    { debounce: 200 }
  )

  watch($$(modelValue), (v) => {
    if (isNum(v) && v !== wrapperScrollTopPx) {
      wrapperEl.scroll({ top: v, behavior: 'smooth' })
    }
  })

  onMounted(() => {
    if (modelValue) {
      wrapperEl.scroll({ top: modelValue })
    }
  })
}
