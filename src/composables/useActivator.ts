interface Props {
  onActivation?: () => void
  onDeactivation?: () => void
  debounce?: number
}

/**
 * Activator can be activated many times in sequence
 * it will then become inactive after the same number of deactivations
 */
export const useActivator = (props: Props = {}) => {
  let activationCount = $ref(0)
  const activationCountDebounced = $(
    refDebounced($$(activationCount), props.debounce)
  )

  const isActive = computed(() => !!activationCountDebounced)
  const isInactive = computed(() => !activationCountDebounced)

  if (props.onActivation) {
    whenever(isActive, props.onActivation)
  }

  if (props.onDeactivation) {
    whenever(isInactive, props.onDeactivation)
  }

  const activate = () => {
    activationCount++
  }

  const deactivate = () => {
    activationCount = Math.max(0, activationCount - 1)
  }

  return { isActive, isInactive, activate, deactivate }
}
