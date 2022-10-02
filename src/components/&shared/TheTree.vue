<script setup lang="ts">
const { ready, start } = $(
  useTimeout(1000, { controls: true, immediate: false })
)

const shake = $computed(() => !ready)

const handleClick = () => {
  if (ready) {
    start()
  }
}
</script>

<template>
  <div
    :class="{ shake }"
    _icon-carbon-tree
    _text="secondary hover:accent"
    _transition-colors
    _cursor-pointer
    @click="handleClick()"
  />
</template>

<style lang="scss" scoped>
.shake {
  animation: shake 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0) rotate(-1deg);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0) rotate(2deg);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0) rotate(-4deg);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0) rotate(4deg);
  }
}
</style>
