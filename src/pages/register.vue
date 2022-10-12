<route lang="yaml">
meta:
  title: register.title
  layout: blank
</route>

<script setup lang="ts">
import { useSessionStore } from '~/stores/session'

import { useInputGroup } from '~/composables/input'
import { useRedirectOnAuth } from '~/composables/redirect'

const { t } = useI18n()

const sessionStore = useSessionStore()

const {
  setValueByKey,
  getValueByKey,
  hasErrorByKey,
  hasEmptyValues,
  triggerErrorByKey,
} = $(
  useInputGroup([
    'email',
    'username',
    'firstname',
    'lastname',
    'password',
    'repeatedPassword',
  ])
)

const email = $computed({
  get: () => getValueByKey('email'),
  set: (v) => setValueByKey('email', v),
})

const username = $computed({
  get: () => getValueByKey('username'),
  set: (v) => setValueByKey('username', v),
})

const firstname = $computed({
  get: () => getValueByKey('firstname'),
  set: (v) => setValueByKey('firstname', v),
})

const lastname = $computed({
  get: () => getValueByKey('lastname'),
  set: (v) => setValueByKey('lastname', v),
})

let password = $computed({
  get: () => getValueByKey('password'),
  set: (v) => setValueByKey('password', v),
})

let repeatedPassword = $computed({
  get: () => getValueByKey('repeatedPassword'),
  set: (v) => setValueByKey('repeatedPassword', v),
})

let errorLabel = $ref<string | null>(null)

const register = async () => {
  if (hasEmptyValues) {
    return
  }

  if (repeatedPassword !== password) {
    password = repeatedPassword = ''
    triggerErrorByKey('password')
    triggerErrorByKey('repeatedPassword')
    errorLabel = t('register.passwords_not_equal_error')
    return
  }

  await sessionStore.register({
    email,
    username,
    firstname,
    lastname,
    password,
  })

  if (!sessionStore.isAuth) {
    errorLabel = t('register.register_failed_error')
  }
}

useRedirectOnAuth()
</script>

<template>
  <div _flex="~ col" _items-center>
    <div _h="[3%]" />

    <div _flex="~ col" _items-center _text-center _gap3>
      <BaseFadeTransitionGroup>
        <div v-if="errorLabel" key="errorLabel" _text-error>
          {{ errorLabel }}
        </div>

        <div key="email">
          <div>{{ t('register.email') }}</div>
          <BaseInput v-model="email" />
        </div>

        <div key="username">
          <div>{{ t('register.username') }}</div>
          <BaseInput v-model="username" />
        </div>

        <div key="firstname">
          <div>{{ t('register.firstname') }}</div>
          <BaseInput v-model="firstname" />
        </div>

        <div key="lastname">
          <div>{{ t('register.lastname') }}</div>
          <BaseInput v-model="lastname" />
        </div>

        <div key="password">
          <div>{{ t('register.password') }}</div>
          <BaseInput
            v-model="password"
            type="password"
            :error="hasErrorByKey('password')"
          />
        </div>

        <div key="repeatedPassword">
          <div>{{ t('register.repeat_password') }}</div>
          <BaseInput
            v-model="repeatedPassword"
            type="password"
            :error="hasErrorByKey('repeatedPassword')"
          />
        </div>

        <div
          key="registerActions"
          _flex="~ col"
          _items-center
          _text-center
          _gap2
        >
          <BaseButton :disabled="hasEmptyValues" @click="register()">
            {{ t('register.sign_up') }}
          </BaseButton>
        </div>

        <div key="loginActions">
          {{ t('register.has_account') }}
          <BaseLink to="/login">{{ t('register.log_in') }}</BaseLink>
        </div>
      </BaseFadeTransitionGroup>
    </div>
  </div>
</template>
