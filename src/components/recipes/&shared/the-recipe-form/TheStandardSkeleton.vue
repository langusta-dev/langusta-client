<template>
  <div _flex _mt6 _children="flex-(~ col) gap4 px3 min-w-1/3">
    <div _relative>
      <slot name="metadata" />

      <BaseHr />

      <slot name="submit-button" />
    </div>

    <div>
      <slot name="description" />

      <slot name="steps" />
    </div>

    <div>
      <slot name="ingredients" />
    </div>
  </div>
</template>
