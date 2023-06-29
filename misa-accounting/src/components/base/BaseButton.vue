<template>
  <div
    :tabindex="tabindex"
    v-if="type === 'primary'"
    class="button"
    :class="tooltipText ? 'tooltip-container' : ''"
    v-showTooltip="tooltipText"
  >
    <div v-if="icon"></div>
    {{ text }}
  </div>
  <div
    :tabindex="tabindex"
    v-if="type == 'secondary'"
    class="button button--secondary"
    :class="tooltipText ? 'tooltip-container' : ''"
    v-showTooltip="tooltipText"
  >
    {{ text }}
    <div v-if="icon"></div>
  </div>
  <div :tabindex="tabindex" v-if="type == 'icon'" class="button button-icon">
    <div></div>
  </div>
</template>
<script>
export default {
  name: "BaseButton",
  props: ["icon", "text", "type", "tabindex", "tooltipText"],
};
</script>
