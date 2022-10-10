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
import { useInput } from '~/composables/useInput'

const { t } = useI18n()

const localProfileStore = useLocalProfileStore()
const sessionStore = useSessionStore()

const {
  value: username,
  hasError: showUsernameError,
  triggerError: triggerUsernameError,
} = $(useInput())

const {
  value: password,
  hasError: showPasswordError,
  triggerError: triggerPasswordError,
} = $(useInput())

let errorLabel = $ref<string | null>(null)

const logIn = async () => {
  if (!username) {
    triggerUsernameError()
  }

  if (!password) {
    triggerPasswordError()
  }

  if (!username || !password) {
    return
  }

  await sessionStore.logIn({ username, password })

  if (!sessionStore.isAuth) {
    errorLabel = t('login.login_failed_error')
  }
}

const enableLocalProfile = () => {
  showConfirm({
    msg: t('login.local_profile_confirm'),
    cb: localProfileStore.enableLocalProfile,
  })
}

useRedirectOnAuth()
</script>

<template>
  <div _flex="~ col" _items-center>
    <div _h="[15%]" />

    <div _flex="~ col" _items-center _text-center _gap3>
      <BaseFadeTransitionGroup>
        <div v-if="errorLabel" key="errorLabel" _text-error>
          {{ errorLabel }}
        </div>

        <div key="username">
          <div>{{ t('login.username') }}</div>
          <BaseInput v-model="username" :error="showUsernameError" />
        </div>

        <div key="password">
          <div>{{ t('login.password') }}</div>
          <BaseInput
            v-model="password"
            type="password"
            :error="showPasswordError"
          />
        </div>

        <div key="loginActions" _flex="~ col" _items-center _text-center _gap2>
          <BaseButton @click="logIn()"> {{ t('login.log_in') }} </BaseButton>

          <BaseButton alt sm @click="enableLocalProfile()">
            {{ t('login.enable_local_profile') }}
          </BaseButton>
        </div>

        <div key="registerActions">
          {{ t('login.has_no_account') }}
          <BaseLink to="/register">{{ t('login.sign_up') }}</BaseLink>
        </div>
      </BaseFadeTransitionGroup>
    </div>
  </div>
</template>
