<script setup lang="ts">
import { useNamesStore } from '~/stores/names'

const { name } = defineProps<{ name: string }>()

const router = useRouter()

const { otherNames, pushName } = $(useNamesStore())

const canGoBack = $computed(() => !!router.options.history.state.back)

watchEffect(() => {
  pushName(name)
})

const { t } = useI18n()
</script>

<template>
  <div _text-center>
    <div _icon-mdi-human-greeting _inline-block _text-4xl _mb-1 />

    <div>
      <BaseFadeTransition>
        <p :key="name">
          {{ t('name.hi', { name }) }}
        </p>
      </BaseFadeTransition>

      <p>
        <em _text-xs _op60>{{ t('name.description') }}</em>
      </p>

      <div v-if="otherNames.length" _mt-4 _text-sm>
        <span _op75>{{ t('name.aka') }}:</span>
        <ul>
          <li v-for="otherName in otherNames" :key="otherName" _block>
            <BaseLink :to="`/hi/${otherName}`" replace>
              {{ otherName }}
            </BaseLink>
          </li>
        </ul>
      </div>
    </div>

    <div _my-6>
      <BaseButton :disabled="!canGoBack" _text-sm @click="router.back()">
        {{ t('common.button.back') }}
      </BaseButton>
    </div>
  </div>
</template>
