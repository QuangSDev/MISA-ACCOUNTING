<template>
  <div
    :tabindex="tabindex"
    v-if="type === 'primary'"
    class="button"
    :class="tooltipText ? 'tooltip-container' : ''"
    v-showTooltip="tooltipText"
  >
    <div></div>
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
    <div></div>
  </div>
  <div :tabindex="tabindex" v-if="type == 'icon'" class="button button-icon">
    <div></div>
  </div>
</template>
<script>
export default {
  name: "BaseButton",
  props: {
    // Từ hiển thị cho nút
    text: {
      type: String,
      default: "",
    },
    // Số tabindex
    tabindex: {
      type: Number,
      default: 1,
    },
    // Câu hiển thị trong tooltip
    tooltipText: {
      type: String,
      default: "",
    },
    // Kiểu nút (primary, secondary)
    type: {
      type: String,
      default: "",
    },
  },
};
</script>
