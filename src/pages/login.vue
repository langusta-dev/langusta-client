<route lang="yaml">
meta:
  title: login.title
  layout: blank
</route>

<script setup lang="ts">
import { useLocalProfileStore } from '~/stores/localProfile';
import { useSessionStore } from '~/stores/session';

import { showConfirm } from '~/composables/confirm';
import { useInputGroup } from '~/composables/input';

const { t } = useI18n();
const router = useRouter();

const localProfileStore = useLocalProfileStore();
const sessionStore = useSessionStore();

const { hasErrorByKey, hasEmptyValues, triggerErrorByKey, injectValueByKey } =
  $(useInputGroup(['username', 'password']));

const username = $(injectValueByKey('username'));
let password = $(injectValueByKey('password'));

let errorLabel = $ref<string | null>(null);

const logIn = async () => {
  if (hasEmptyValues) {
    return;
  }

  await sessionStore.logIn({ username, password });

  if (!sessionStore.isAuth) {
    errorLabel = t('login.login_failed_error');
    password = '';
    triggerErrorByKey('password');
    return;
  }

  router.push('/');
};

const enableLocalProfile = () => {
  showConfirm({
    msg: t('login.local_profile_confirm'),
    cb: () => {
      localProfileStore.enableLocalProfile();
      router.push('/');
    },
  });
};
</script>

<template>
  <div _flex="~ col" _items-center _h-full>
    <div _h="[15%]" />

    <div _flex="~ col" _items-center _text-center _gap3>
      <BaseFadeTransitionGroup>
        <div v-if="errorLabel" key="errorLabel" _text-error>
          {{ errorLabel }}
        </div>

        <BaseInput
          key="username"
          v-model="username"
          autofocus
          :placeholder="t('login.username')"
        />

        <BaseInput
          key="password"
          v-model="password"
          type="password"
          :error="hasErrorByKey('password')"
          :placeholder="t('login.password')"
        />

        <div key="loginActions" _flex="~ col" _items-center _text-center _gap2>
          <BaseButton :disabled="hasEmptyValues" @click="logIn()">
            {{ t('login.log_in') }}
          </BaseButton>

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
