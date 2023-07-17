<template>
  <div class="locale-changer" @click="toggleLocaleList">
    <div>{{ locale }}</div>
    <div class="locale-select-container" v-if="isShown">
      <div
        class="locale-option"
        :class="{ 'locale-selected': lang == locale }"
        v-for="(lang, i) in langs"
        :key="`Lang${i}`"
        @click="changeLocale(lang)"
      >
        {{ lang }}
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
export default {
  name: "BaseLocaleChanger",
  setup() {
    //#region Khai báo state
    const { locale } = useI18n({ useScope: "global" });
    const isShown = ref(false);
    //#endregion

    //#region Khai báo phương thức

    /**
     * Feature: Thay đổi ngôn ngữ
     * Author: Lê Minh Quang (29/06/2023)
     * @param {string} lang
     */
    const changeLocale = (lang) => {
      locale.value = lang;
    };

    /**
     * Feature: Hiện thị menu chọn ngôn ngữ
     * Author: Lê Minh Quang (29/06/2023)
     */
    const toggleLocaleList = () => {
      isShown.value = !isShown.value;
    };
    //#endregion
    return {
      isShown,
      locale,
      langs: ["vi", "en"],
      changeLocale,
      toggleLocaleList,
    };
  },
};
</script>
