<template>
  <TransitionGroup
    enter-from-class="op0"
    leave-to-class="op0"
    move-class="!transition-300 z-1"
    enter-active-class="!pointer-events-none !transition-300"
    leave-active-class="absolute !pointer-events-none !transition-300"
  >
    <slot />
  </TransitionGroup>
</template>
