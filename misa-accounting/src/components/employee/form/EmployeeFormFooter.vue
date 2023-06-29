<template>
  <div class="user-dialog__footer popup-footer">
    <div @click="closeForm">
      <BaseButton :text="$t('words.cancel')" type="secondary" tabindex="21" />
    </div>

    <div class="popup-footer__btn-group">
      <div
        @click="
          mode === ACCOUNTING_ENUM.MODE.UPDATE
            ? updateEmployeeAndClose()
            : createNewEmployeeAndClose()
        "
        v-actionOnKeyPress="{
          fn:
            mode === ACCOUNTING_ENUM.MODE.UPDATE
              ? updateEmployeeAndClose
              : createNewEmployeeAndClose,
          isCtrl: true,
          isShift: false,
          key: 83,
        }"
        v-actionOnEnter
      >
        <BaseButton
          :text="$t('words.store')"
          type="secondary"
          tabindex="19"
          :tooltipText="`${$t('words.store')} (Ctrl + S)`"
        />
      </div>
      <div
        @click="
          mode === ACCOUNTING_ENUM.MODE.UPDATE
            ? updateEmployeeAndContinue()
            : createNewEmployeeAndContinue()
        "
        v-actionOnKeyPress="{
          fn:
            mode === ACCOUNTING_ENUM.MODE.UPDATE
              ? updateEmployeeAndContinue
              : createNewEmployeeAndContinue,
          isCtrl: true,
          isShift: true,
          key: 83,
        }"
        v-actionOnEnter
      >
        <BaseButton
          :text="$t('words.storeAndAdd')"
          type="primary"
          tabindex="20"
          :tooltipText="`${$t('words.storeAndAdd')} (Ctrl + Shift + S)`"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { ACCOUNTING_ENUM } from "@/helpers/enums";
export default {
  name: "EmployeeFormFooter",
  props: ["mode"],
  setup(_, { emit }) {
    //#region Khai báo phương thức
    /**
     * Feature: Đóng form
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */
    const closeForm = () => {
      emit("closeForm");
    };

    /**
     * Feature: Tạo nhân viên và giữ form
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */
    const createNewEmployeeAndContinue = () => {
      emit("createNewEmployeeAndContinue");
    };

    /**
     * Feature: Cập nhật nhân viên và giữ form
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */
    const updateEmployeeAndContinue = () => {
      emit("updateEmployeeAndContinue");
    };

    /**
     * Feature: Tạo nhân viên và đóng form
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */
    const createNewEmployeeAndClose = () => {
      emit("createNewEmployeeAndClose");
    };

    /**
     * Feature: Cập nhật nhân viên và đóng form
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */
    const updateEmployeeAndClose = () => {
      emit("updateEmployeeAndClose");
    };
    //#endregion
    return {
      ACCOUNTING_ENUM,
      closeForm,
      createNewEmployeeAndContinue,
      updateEmployeeAndClose,
      createNewEmployeeAndClose,
      updateEmployeeAndContinue,
    };
  },
};
</script>
