<route lang="yaml">
meta:
  layout: blank
</route>

<script setup lang="ts">
import { useSession } from '~/stores/session'

const { t } = useI18n()

const session = useSession()

const username = $ref('')
const password = $ref('')

const logIn = () => {
  session.logIn({ username, password })
}
</script>

<template>
  <div>
    <BaseInput v-model="username" />
    <BaseInput v-model="password" />
    <BaseButton @click="logIn()"> {{ t('login.sign_in') }} </BaseButton>
  </div>
</template>
