<script setup lang="ts">
interface Props {
  to?: string
  external?: boolean
  replace?: boolean
}

const { to, external = false, replace = false } = defineProps<Props>()

const router = useRouter()

const handleClick = () => {
  if (!to) {
    return
  }

  if (external) {
    window.open(to, '_blank')?.focus()
  } else if (replace) {
    router.replace(to)
  } else {
    router.push(to)
  }
}
</script>

<template>
  <a
    :href="to || 'javascript:;'"
    _inline-block
    _underline
    _fw500
    _text-secondary-interactive
    _transition-colors
    _cursor-pointer
    _select-none
    @click.prevent="handleClick()"
  >
    <slot />
  </a>
</template>
