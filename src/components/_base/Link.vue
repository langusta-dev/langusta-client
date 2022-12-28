<script setup lang="ts">
interface Props {
  to?: string;
  external?: boolean;
  replace?: boolean;
  alt?: boolean;
}

const { to, external, replace, alt } = defineProps<Props>();

const router = useRouter();

const handleClick = () => {
  if (!to) {
    return;
  }

  if (external) {
    window.open(to, '_blank')?.focus();
  } else if (replace) {
    router.replace(to);
  } else {
    router.push(to);
  }
};
</script>

<template>
  <a
    :href="to || 'javascript:;'"
    :class="
      !alt
        ? 'text-primary-contrast-interactive'
        : 'text-accent-contrast hover:text-accent-contrast/90'
    "
    _inline-block
    _underline
    _fw500
    _transition-colors
    _cursor-pointer
    _select-none
    @click.prevent="handleClick()"
  >
    <slot />
  </a>
</template>
