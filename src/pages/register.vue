<route lang="yaml">
meta:
  title: register.title
  layout: blank
</route>

<script setup lang="ts">
import { useSessionStore } from '~/stores/session'

import { useRedirectOnAuth } from '~/composables/redirect'

const { t } = useI18n()

const sessionStore = useSessionStore()

const email = $ref('')
const username = $ref('')
const firstname = $ref('')
const lastname = $ref('')
const password = $ref('')

const repeatedPassword = $ref('')

const register = () => {
  // todo errors
  sessionStore.register({ email, username, firstname, lastname, password })
}

useRedirectOnAuth()
</script>

<template>
  <div _flex="~ col" _items-center>
    <div _h="[3%]" />

    <div _flex="~ col" _items-center _text-center _gap3>
      <div>
        <div>{{ t('register.email') }}</div>
        <BaseInput v-model="email" />
      </div>

      <div>
        <div>{{ t('register.username') }}</div>
        <BaseInput v-model="username" />
      </div>

      <div>
        <div>{{ t('register.firstname') }}</div>
        <BaseInput v-model="firstname" />
      </div>

      <div>
        <div>{{ t('register.lastname') }}</div>
        <BaseInput v-model="lastname" />
      </div>

      <div>
        <div>{{ t('register.password') }}</div>
        <BaseInput v-model="password" />
      </div>

      <div>
        <div>{{ t('register.repeat_password') }}</div>
        <BaseInput v-model="repeatedPassword" />
      </div>

      <div _flex="~ col" _items-center _text-center _gap2>
        <BaseButton @click="register()">
          {{ t('register.sign_up') }}
        </BaseButton>
      </div>

      <div>
        {{ t('register.has_account') }}
        <BaseLink to="/login">{{ t('register.log_in') }}</BaseLink>
      </div>
    </div>
  </div>
</template>
