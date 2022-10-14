<route lang="yaml">
meta:
  title: register.title
  layout: blank
</route>

<script setup lang="ts">
import { useSessionStore } from '~/stores/session'

import { useInputGroup } from '~/composables/input'
import { useRedirectOnAuth } from '~/composables/redirect'

import { isEmail } from '~/helpers/string'

const { t } = useI18n()

const sessionStore = useSessionStore()

const {
  hasErrorByKey,
  hasEmptyValues,
  triggerErrorByKey,
  injectValueByKey,
  hasErrors,
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

const email = $(injectValueByKey('email'))
const username = $(injectValueByKey('username'))
const firstname = $(injectValueByKey('firstname'))
const lastname = $(injectValueByKey('lastname'))
let password = $(injectValueByKey('password'))
let repeatedPassword = $(injectValueByKey('repeatedPassword'))

let errorLabel = $ref<string | null>(null)

const validateEmail = () => {
  if (!isEmail(email)) {
    errorLabel = t('register.invalid_email_error')
    triggerErrorByKey('email')
  }
}

const register = async () => {
  if (hasEmptyValues) {
    return
  }

  validateEmail()

  if (hasErrors) {
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
          <BaseInput
            v-model="email"
            :error="hasErrorByKey('email')"
            @blur="validateEmail()"
          />
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
          <BaseButton
            :disabled="hasEmptyValues || hasErrors"
            @click="register()"
          >
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
