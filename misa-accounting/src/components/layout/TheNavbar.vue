<template>
  <div class="navbar">
    <div class="navbar--left">
      <div class="navbar__menu-icon"></div>
      <div class="navbar__items--left">CÔNG TY CỔ PHẦN MISA</div>
    </div>
    <div class="navbar--right">
      <BaseLocaleChanger />
      <div class="navbar__user-container">
        <div class="navbar__avatar"></div>
        <span class="navbar__username">Lê Minh Quang</span>
      </div>
    </div>
  </div>
</template>
<script>
import BaseLocaleChanger from "../base/BaseLocaleChanger.vue";

export default {
  name: "TheNavbar",
  components: { BaseLocaleChanger },
};
</script>
