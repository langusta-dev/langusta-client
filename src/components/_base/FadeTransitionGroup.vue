<template>
  <TransitionGroup
    enter-from-class="op0"
    leave-to-class="op0"
    enter-active-class="transition-opacity pointer-events-none"
    leave-active-class="transition-opacity pointer-events-none"
    mode="out-in"
  >
    <slot />
  </TransitionGroup>
</template>
