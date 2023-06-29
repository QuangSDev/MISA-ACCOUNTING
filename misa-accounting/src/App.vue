<template>
  <div v-if="loading" class="loading__layout">
    <img src="./assets/loading.svg" />
  </div>
  <div class="toast-container">
    <div v-for="(item, index) in toasts" :key="index">
      <BaseToast :text="item.text" :type="item.type" />
    </div>
  </div>
  <div class="layout">
    <TheSidebar />

    <div class="content-container">
      <TheNavbar />
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TheNavbar from "./components/layout/TheNavbar.vue";
import TheSidebar from "./components/layout/TheSidebar.vue";

export default {
  components: { TheSidebar, TheNavbar },

  computed: mapState(["loading", "toasts"]),
};
</script>

<style>
@import url("./css/main.css");
</style>
