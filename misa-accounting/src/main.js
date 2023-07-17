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
import BaseButton from "./components/button/BaseButton";
import BaseTextField from "./components/input/BaseTextField";
import BaseDropDownList from "./components/dropdownlist/BaseDropDownList";
import BaseToast from "./components/toast/BaseToast";
import BaseDialog from "./components/dialog/BaseDialog";
import BaseFilterButton from "./components/filter/BaseFilterButton";
import BasePagination from "./components/pagination/BasePagination";

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
  .component("BasePagination", BasePagination)
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
