<route lang="yaml">
meta:
  title: About
</route>

<script setup lang="ts">
import TheTree from '~/components/&shared/TheTree.vue'
import Section from '~/components/about/Section.vue'

const BASE_PARAGRAPH_COUNT = 3

let paragraphCountModifier = $ref(0)

const paragraphCount = $computed({
  get: () => BASE_PARAGRAPH_COUNT + paragraphCountModifier,
  set: (v) => {
    paragraphCountModifier = Math.max(0, v) - BASE_PARAGRAPH_COUNT
  },
})

const { t } = useI18n()
</script>

<template>
  <div>
    <div _text-center _mb-3>
      <TheTree _inline-block _text-4xl />
      <p _text-2xl _fw600>{{ t('about.title') }}</p>
    </div>

    <div _flex _flex-col _items-center _gap-3 _mb-5>
      <Section>
        <p>
          <BaseLink to="https://github.com/brofrain/vitestrict" external>
            ViteStrict
          </BaseLink>
          is an opinionated
          <BaseLink to="https://vuejs.org/" external>Vue</BaseLink>+<BaseLink
            to="https://vitejs.dev/"
            external
          >
            Vite
          </BaseLink>
          starter template for intuitive and easily-scalable development with
          projects both medium and large in mind, based on
          <BaseLink to="https://github.com/antfu/vitesse" external>
            Vitesse
          </BaseLink>
          made by
          <BaseLink to="https://github.com/antfu" external> @anfu </BaseLink>.
        </p>
        <p>
          The template enforces the use of a single pre-defined application
          development pattern, so you can fully focus on filling the schema with
          some usable code.
        </p>
        <p>
          You will find plenty of must-have features inside, like
          <b>File-based routing</b>, <b>Layouts</b>, <b>APIs auto-importing</b>,
          <b>SSG</b>, <b>PWA</b>, <b>i18n</b>, <b>UnoCSS</b>, <b>Iconify</b>,
          <b>Pinia</b>, <b>Vitest</b> and more.
        </p>
        <p>
          Check out the
          <BaseLink to="https://github.com/brofrain/vitestrict" external>
            GitHub repo
          </BaseLink>
          of this project or the original
          <BaseLink to="https://github.com/antfu/vitesse" external>
            Vitesse
          </BaseLink>
          starter template for more details.
        </p>
      </Section>
      <Section>
        <p v-for="i in paragraphCount" :key="i">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Necessitatibus, quas. Fugiat vero cumque porro quis. Veritatis, illo!
          Molestiae, aliquid. At fuga consequuntur, odio laborum excepturi
          dolorem cum. Dolor, impedit voluptates.
        </p>
      </Section>
      <div _flex="~ col md:row" _flex-wrap _justify-center _gap-2>
        <BaseButton @click="paragraphCount++">
          {{ t('about.add_paragraph') }}
        </BaseButton>
        <BaseButton @click="paragraphCount--">
          {{ t('about.remove_paragraph') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
