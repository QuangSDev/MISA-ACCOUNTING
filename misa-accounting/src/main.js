import { createApp } from "vue";
import App from "./App.vue";
import {
  clickOutside,
  trapFocus,
  actionOnKeyPress,
  showTooltip,
  focusOutDropDown,
  handleDropdownMenu,
  actionOnEnter,
} from "./directives";
import router from "./router";
import store from "./store";
import BaseButton from "./components/base/BaseButton";
import BaseTextField from "./components/base/BaseTextField";
import BaseDropDownList from "./components/base/BaseDropDownList";
import BaseToast from "./components/base/BaseToast";
import BaseDialog from "./components/base/BaseDialog";
import BaseFilterButton from "./components/base/BaseFilterButton";
import { createI18n } from "vue-i18n";
import { ACCOUNTING_TEXT } from "./helpers/resources";

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  fallbackLocale: "vi",
  locale: "vi",
  messages: ACCOUNTING_TEXT,
});

createApp(App)
  .component("BaseButton", BaseButton)
  .component("BaseTextField", BaseTextField)
  .component("BaseDropDownList", BaseDropDownList)
  .component("BaseToast", BaseToast)
  .component("BaseDialog", BaseDialog)
  .component("BaseFilterButton", BaseFilterButton)
  .directive("click-outside", clickOutside)
  .directive("trapFocus", trapFocus)
  .directive("actionOnKeyPress", actionOnKeyPress)
  .directive("showTooltip", showTooltip)
  .directive("focusOutDropDown", focusOutDropDown)
  .directive("handleDropdownMenu", handleDropdownMenu)
  .directive("actionOnEnter", actionOnEnter)
  .use(store)
  .use(router)
  .use(i18n)
  .mount("#app");
