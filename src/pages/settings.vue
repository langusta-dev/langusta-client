<route lang="yaml">
meta:
  auth: true
  nav: true
  navOrder: 99
  title: settings.title
  icon: fa6-solid:gear
</route>

<script setup lang="ts">
import Option from '~/components/settings/Option.vue'

import { useLocalProfileStore } from '~/stores/localProfile'
import { useSessionStore } from '~/stores/session'

import { isDark, toggleDark } from '~/composables/dark'

const router = useRouter()
const { t } = useI18n()

const localProfileStore = useLocalProfileStore()
const sessionStore = useSessionStore()

const logOutLabel = localProfileStore.isLocalProfileEnabled
  ? t('settings.log_in')
  : t('settings.log_out')

const logOutIcon = localProfileStore.isLocalProfileEnabled
  ? 'icon-ion:log-in-outline'
  : 'icon-ion:log-out-outline'

const logOut = () => {
  if (localProfileStore.isLocalProfileEnabled) {
    localProfileStore.disableLocalProfile()
  } else {
    sessionStore.logOut()
  }

  router.push('/login')
}
</script>

<template>
  <div _pt10 _flex="~ col" _items-center _gap3>
    <Option clickable @click="logOut()">
      <template #title>
        {{ logOutLabel }}
      </template>

      <div :class="logOutIcon" _text-3xl />
    </Option>

    <Option clickable @click="toggleDark()">
      <template #title>{{ t('settings.dark_mode') }}</template>
      <BaseToggler v-model="isDark" />
    </Option>
  </div>
</template>
