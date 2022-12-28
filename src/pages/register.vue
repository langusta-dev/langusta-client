<route lang="yaml">
meta:
  title: register.title
  layout: blank
</route>

<script setup lang="ts">
import { useSessionStore } from '~/stores/session';

import { useInputGroup } from '~/composables/input';

import { isEmail } from '~/helpers/string';

const { t } = useI18n();

const router = useRouter();
const sessionStore = useSessionStore();

const errorLabels = $computed(() => ({
  invalidEmail: t('register.invalid_email_error'),
  passwordTooShort: t('register.password_too_short_error', {
    length: import.meta.env.VITE_PASSWORD_MIN_LENGTH,
  }),
  passwordsNotEqual: t('register.passwords_not_equal_error'),
  registrationFailed: t('register.registration_failed_error'),
}));

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
);

const email = $(injectValueByKey('email'));
const username = $(injectValueByKey('username'));
const firstname = $(injectValueByKey('firstname'));
const lastname = $(injectValueByKey('lastname'));
let password = $(injectValueByKey('password'));
let repeatedPassword = $(injectValueByKey('repeatedPassword'));

const isDisabled = $computed(() => hasEmptyValues || hasErrors);

let displayedErrorLabel = $ref<string | null>(null);

const updateDisplayedErrorLabel = async (text: string | null) => {
  await wait(200);
  displayedErrorLabel = text;
};

const clearDisplayedErrorLabel = () => updateDisplayedErrorLabel(null);

const validateEmail = () => {
  if (!email) {
    return true;
  }

  if (!isEmail(email)) {
    updateDisplayedErrorLabel(errorLabels.invalidEmail);
    triggerErrorByKey('email');
    return false;
  }

  if (displayedErrorLabel === errorLabels.invalidEmail) {
    clearDisplayedErrorLabel();
  }

  return true;
};

const validatePassword = () => {
  if (!password) {
    return true;
  }

  if (password.length < import.meta.env.VITE_PASSWORD_MIN_LENGTH) {
    password = '';
    triggerErrorByKey('password');
    updateDisplayedErrorLabel(errorLabels.passwordTooShort);
    return false;
  }

  if (displayedErrorLabel === errorLabels.passwordTooShort) {
    clearDisplayedErrorLabel();
  }

  return true;
};

const register = async () => {
  if (isDisabled || !validateEmail() || !validatePassword()) {
    return;
  }

  if (repeatedPassword !== password) {
    password = repeatedPassword = '';
    triggerErrorByKey('password');
    triggerErrorByKey('repeatedPassword');
    updateDisplayedErrorLabel(errorLabels.passwordsNotEqual);
    return;
  }

  await sessionStore.register({
    email,
    username,
    firstname,
    lastname,
    password,
  });

  if (!sessionStore.isAuth) {
    updateDisplayedErrorLabel(errorLabels.registrationFailed);
    return;
  }

  router.push('/');
};
</script>

<template>
  <div _flex="~ col" _items-center _h-full>
    <div _h="[3%]" />

    <div _flex="~ col" _items-center _text-center _gap3>
      <BaseFadeTransitionGroup>
        <div v-if="displayedErrorLabel" key="errorLabel" _text-error>
          {{ displayedErrorLabel }}
        </div>

        <BaseInput
          key="email"
          v-model="email"
          :error="hasErrorByKey('email')"
          autofocus
          :placeholder="t('register.email')"
          @blur="validateEmail()"
        />

        <BaseInput
          key="username"
          v-model="username"
          :placeholder="t('register.username')"
        />

        <BaseInput
          key="firstname"
          v-model="firstname"
          :placeholder="t('register.firstname')"
        />

        <BaseInput
          key="lastname"
          v-model="lastname"
          :placeholder="t('register.lastname')"
        />

        <BaseInput
          key="password"
          v-model="password"
          type="password"
          :error="hasErrorByKey('password')"
          :placeholder="t('register.password')"
          @blur="validatePassword()"
        />

        <BaseInput
          key="repeatedPassword"
          v-model="repeatedPassword"
          type="password"
          :error="hasErrorByKey('repeatedPassword')"
          :placeholder="t('register.repeat_password')"
        />

        <div
          key="registerActions"
          _flex="~ col"
          _items-center
          _text-center
          _gap2
        >
          <BaseButton :disabled="isDisabled" @click="register()">
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
