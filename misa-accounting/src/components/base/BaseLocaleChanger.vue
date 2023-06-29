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
    const { locale } = useI18n({ useScope: "global" });
    const isShown = ref(false);
    const changeLocale = (lang) => {
      locale.value = lang;
    };
    const toggleLocaleList = () => {
      isShown.value = !isShown.value;
    };
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
