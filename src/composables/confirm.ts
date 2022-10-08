import type { ConfirmPayload } from '~/types/confirm'

const confirmEventBus = useEventBus<Partial<ConfirmPayload>>('confirm')

export const showConfirm = (payload: Partial<ConfirmPayload>) => {
  confirmEventBus.emit(payload)
}

export const addConfirmListener = (
  confirmListener: (payload: Partial<ConfirmPayload>) => void
) => confirmEventBus.on(confirmListener)
