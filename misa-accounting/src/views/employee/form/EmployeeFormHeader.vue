<template>
  <div class="popup-header">
    <div class="popup-header--left">
      <h3 class="popup-header__title">
        {{
          mode == ACCOUNTING_ENUM.MODE.UPDATE
            ? $t("form.updateFormTitle")
            : $t("form.createFormTitle")
        }}
      </h3>
      <input
        :checked="formInfo.isEmployee == 1"
        type="checkbox"
        tabindex="1"
        :value="1"
        @click="changeInput('isEmployee')"
      />
      <label>{{ $t("words.isEmployee") }}</label>
      <input
        type="checkbox"
        tabindex="2"
        :value="1"
        :checked="formInfo.isSupplier == 1"
        @click="changeInput('isSupplier')"
      />
      <label>{{ $t("words.isCustomer") }}</label>
    </div>
    <div class="popup-header--right">
      <div
        class="info-icon tooltip-container"
        v-showTooltip="`${$t('words.help')} (F1)`"
      ></div>
      <div
        class="close-icon tooltip-container"
        v-showTooltip="`${$t('words.close')} (ESC)`"
        v-actionOnKeyPress="{ fn: closeForm, isCtrl: false, key: 27 }"
        @click="closeForm"
      ></div>
    </div>
  </div>
</template>
<script>
import { ACCOUNTING_ENUM } from "@/helpers/enums";
export default {
  name: "EmployeeFormHeader",
  props: {
    // Mode khi nhập form
    mode: {
      type: Number,
      default: 1,
    },
    // Object chứa thông tin form
    formInfo: {
      type: Object,
    },
  },
  emits: ["closeForm", "updateInfoState"],
  setup(props, { emit }) {
    //#region  Khai báo phương thức
    /**
     * Feature: Đóng form
     * Author: Lê Minh Quang (29/06/2023)
     */
    const closeForm = () => {
      emit("closeForm");
    };

    /**
     * Feature: Thay đổi checkbox update lên form state
     * Author: Lê Minh Quang (29/06/2023)
     * @param {{field: value}} prop property trong truyền vào
     */
    const changeInput = (prop) => {
      if (props.formInfo[prop] == 0) {
        emit("updateInfoState", { [prop]: 1 });
      } else {
        emit("updateInfoState", { [prop]: 0 });
      }
    };

    //#endregion
    return { ACCOUNTING_ENUM, closeForm, changeInput };
  },
};
</script>
