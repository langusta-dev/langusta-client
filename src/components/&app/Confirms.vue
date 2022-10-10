<script setup lang="ts">
import { addConfirmListener } from '~/composables/confirm'
import { hideOverlay, showOverlay } from '~/composables/overlay'

import type { ConfirmPayload } from '~/types/confirm'

type PayloadId = number

const { t } = useI18n()

const defaultPayload = $computed<ConfirmPayload>(() => ({
  msg: t('confirm.default_msg'),
  confirmMsg: t('confirm.default_confirm_msg'),
  cancelMsg: t('confirm.default_cancel_msg'),
  cb: null,
}))

let totalPayloadCount = $ref(0)

const payloadQueue = $ref<(ConfirmPayload & { id: PayloadId })[]>([])

const unsubscribe = addConfirmListener((payload) => {
  payloadQueue.push({
    ...defaultPayload,
    ...payload,
    id: totalPayloadCount++,
  })
  showOverlay()
})

const dropPayload = (id: PayloadId) => {
  const confirmIndex = payloadQueue.findIndex((payload) => payload.id === id)

  if (confirmIndex === -1) {
    return
  }

  payloadQueue.splice(confirmIndex, 1)
  hideOverlay()
}

const executePayloadCb = (id: PayloadId, cb: (() => void) | null) => {
  if (cb) {
    cb()
  }

  dropPayload(id)
}

onBeforeUnmount(unsubscribe)
</script>

<template>
  <BaseFadeTransitionGroup>
    <div
      v-for="{ id, msg, confirmMsg, cancelMsg, cb } in payloadQueue"
      :key="id"
      _w-86
      _absolute
      _top="[25%]"
      _left-0
      _right-0
      _mx-auto
      _rounded
      _p4
      _bg-primary
    >
      <div _text-center>
        {{ msg }}
      </div>

      <div _mt4 _flex _justify-center _gap4>
        <BaseButton alt @click="dropPayload(id)">{{ cancelMsg }}</BaseButton>

        <BaseButton @click="executePayloadCb(id, cb)">
          {{ confirmMsg }}
        </BaseButton>
      </div>
    </div>
  </BaseFadeTransitionGroup>
</template>
