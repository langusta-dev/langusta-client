<template>
  <TransitionGroup
    enter-from-class="op0"
    leave-to-class="op0"
    move-class="duration-300"
    enter-active-class="pointer-events-none duration-300"
    leave-active-class="absolute pointer-events-none duration-300"
  >
    <slot />
  </TransitionGroup>
</template>
