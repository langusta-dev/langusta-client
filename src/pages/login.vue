<route lang="yaml">
meta:
  title: login.title
  layout: blank
</route>

<script setup lang="ts">
import { useLocalProfileStore } from '~/stores/localProfile'
import { useSessionStore } from '~/stores/session'

import { showConfirm } from '~/composables/confirm'
import { useRedirectOnAuth } from '~/composables/redirect'

const { t } = useI18n()

const localProfileStore = useLocalProfileStore()
const sessionStore = useSessionStore()

const username = $ref('')
const password = $ref('')

const logIn = () => {
  // todo errors
  sessionStore.logIn({ username, password })
}

const enableLocalProfile = () => {
  showConfirm({ cb: localProfileStore.enableLocalProfile })
}

useRedirectOnAuth()
</script>

<template>
  <div _flex="~ col" _items-center>
    <div _h="[15%]" />

    <div _flex="~ col" _items-center _text-center _gap3>
      <div>
        <div>{{ t('login.username') }}</div>
        <BaseInput v-model="username" />
      </div>

      <div>
        <div>{{ t('login.password') }}</div>
        <BaseInput v-model="password" />
      </div>

      <div _flex="~ col" _items-center _text-center _gap2>
        <BaseButton @click="logIn()"> {{ t('login.log_in') }} </BaseButton>

        <BaseButton alt sm @click="enableLocalProfile()">
          {{ t('login.enable_local_profile') }}
        </BaseButton>
      </div>

      <div>
        {{ t('login.has_no_account') }}
        <BaseLink to="/register">{{ t('login.sign_up') }}</BaseLink>
      </div>
    </div>
  </div>
</template>
