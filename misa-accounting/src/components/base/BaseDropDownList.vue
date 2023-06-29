<template>
  <div
    class="dropdownlist"
    :required="required"
    :error="isValid ? null : true"
    :class="
      mode === ACCOUNTING_ENUM.DROPDOWN.PAGINATION ? 'dropdown_paginate' : ''
    "
  >
    <label v-if="label" class="textfield__label">{{ label }}</label>
    <div
      class="textfield__input-wrapper"
      @click="focusInput($event)"
      :class="{ 'tooltip-container': tooltipError }"
      v-showTooltip="tooltipError"
    >
      <input
        class="textfield__input"
        ref="inpFocus"
        :value="selectedValue"
        :placeholder="placeholder"
        :readonly="readonly || null"
        :tabindex="tabindex"
        @blur="validateOnBlur"
        @input="showMenuOnInput($event)"
        @keydown="showMenuOnKeyPress($event)"
        v-focusOutDropDown="() => (isMenuDisplayed = false)"
      />
    </div>
    <div
      v-if="isMenuDisplayed"
      class="dropdown-menu-wrapper"
      v-click-outside:textfield__input-wrapper="() => (isMenuDisplayed = false)"
      v-handleDropdownMenu="{
        fn: handleDropdownMenu,
        selectedValue,
        list,
        name: displayTextField,
        selectOption,
        hoverItem,
      }"
    >
      <div class="dropdown-menu">
        <div
          v-for="item in list"
          class="dropdown-items"
          :key="item[displayTextField]"
          :value="item[displayTextField]"
          :class="{
            'dropdown-items--selected':
              item[displayTextField] === selectedValue,
            'dropdown-items--hovering':
              hoverItem?.[displayTextField] === item[displayTextField],
          }"
          @click="() => selectOption(item)"
        >
          {{ item[displayTextField] }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, watch, onMounted } from "vue";
import { baseUrl } from "@/helpers/constants";
import axios from "axios";
import { ACCOUNTING_ENUM } from "@/helpers/enums";
import { useI18n } from "vue-i18n";

export default {
  name: "BaseDropDownList",
  props: [
    "label",
    "placeholder",
    "tabindex",
    "displayTextField",
    "trueField",
    "value",
    "isSubmitted",
    "required",
    "queryString",
    "defaultList",
    "mode",
    "readonly",
  ],
  emits: ["fieldChange"],

  setup(props, { emit }) {
    //#region state declaration
    let selectedValue = ref(props.value ? props.value : "");
    let isMenuDisplayed = ref(false);
    let list = ref([]);
    const isValid = ref(true);
    const tooltipError = ref("");
    const hoverItem = ref(null);
    const inpFocus = ref();
    const { t } = useI18n();
    //#endregion

    // Gán lại selectedValue nếu value truyền từ bên ngoài thay đổi
    watch(
      () => props.value,
      (newvl) => (selectedValue.value = newvl || "")
    );

    // Nếu selectedValue thay đổi, tìm trong list item đầu tiên có chứa selectedValue và hover
    watch(
      () => selectedValue.value,
      (newVal) => {
        if (newVal) {
          hoverItem.value = list.value.filter((item) =>
            item[props.displayTextField]
              .toLowerCase()
              .includes(newVal.toLowerCase())
          )[0];
        }
      }
    );

    watch(
      () => props.isSubmitted,
      () => {
        if (props.required && !selectedValue.value) {
          isValid.value = false;
          tooltipError.value = t("validate.required", { label: props.label });
        }
      }
    );

    //#region Khai báo phương thức
    /**
     * Feature: Xác minh các trường khi blur ra ngoài
     * @param {*} e
     * Author: Le Minh Quang
     * Date: 29/03/2023
     */
    const validateOnBlur = () => {
      if (props.mode !== ACCOUNTING_ENUM.DROPDOWN.PAGINATION) {
        if (props.required && !selectedValue.value) {
          isValid.value = false;
          tooltipError.value = tooltipError.value = t("validate.required", {
            label: props.label,
          });
        }
      }
    };

    /**
     * Feature: Focus khi tab vào
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */
    const focusInput = async () => {
      inpFocus.value.focus();
      isValid.value = true;
      tooltipError.value = "";
      isMenuDisplayed.value = !isMenuDisplayed.value;
    };

    /**
     * Feature: Xử lý khi chọn một lựa chọn trong dropdown
     * @param {*} value
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */
    const selectOption = (value) => {
      selectedValue.value = value[props.displayTextField];
      isMenuDisplayed.value = false;
      isValid.value = true;
      tooltipError.value = "";
      emit("fieldChange", {
        [props.displayTextField]: selectedValue.value,
        [props.trueField]: value[props.trueField],
      });
    };

    /**
     * Feature: Lấy danh sách lựa chọn
     * Author: Le Minh Quang
     * Date: 29/03/2023
     */
    const getListData = async () => {
      // Nếu có query string thì lấy dữ liệu còn không thì lấy từ danh sách mặc định được truyền vào
      if (props.queryString) {
        const res = await axios.get(`${baseUrl}/${props.queryString}`);
        list.value = res.data;
      } else {
        list.value = props.defaultList;
      }
    };

    /**
     * Feature: Hiện dropdown khi nhập
     * @param {*} e
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */
    const showMenuOnInput = (e) => {
      isMenuDisplayed.value = true;
      selectedValue.value = e.target.value;
    };

    /**
     * Feature: Hiện dropdown khi nhấn nút xuống
     * @param {*} e
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */
    const showMenuOnKeyPress = async (e) => {
      if (e.key == "ArrowDown") {
        isMenuDisplayed.value = true;
      }
    };

    /**
     * Feature: Gán giá trị cho item đang được hover
     * @param {*} newVal
     */
    const handleDropdownMenu = (newVal) => {
      hoverItem.value = newVal;
    };

    //#region Khai báo lifecycle

    // Lấy danh sách lựa chọn khi mounted
    onMounted(async () => {
      await getListData();
    });

    //#endregion

    return {
      selectedValue,
      isMenuDisplayed,
      isValid,
      inpFocus,
      hoverItem,
      list,
      ACCOUNTING_ENUM,
      tooltipError,
      showMenuOnInput,
      showMenuOnKeyPress,
      handleDropdownMenu,
      selectOption,
      validateOnBlur,
      getListData,
      focusInput,
    };
  },
};
</script>
