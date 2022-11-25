<template>
  <div _flex="~ col" _gap4 _my4>
    <BaseFadeTransitionGroup>
      <slot name="metadata" />

      <BaseHr />

      <slot name="description" />

      <slot name="steps" />

      <BaseHr />

      <slot name="ingredients" />

      <slot name="submit-button" />
    </BaseFadeTransitionGroup>
  </div>
</template>
