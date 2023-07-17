<template>
  <Teleport to="#dialog">
    <BaseDialog
      v-if="isDialogShown"
      :text="$t('deleteWarningText', { id: data?.employeeCode })"
      :cancelText="$t('words.no')"
      :continueText="$t('words.yes')"
      type="warning"
      @cancelAction="cancelDeleteAction"
      @continueAction="deleteEmployee(data?.employeeID)"
    />
  </Teleport>
  <span id="edit-text" @click="showEmployeeForm">{{ $t("words.modify") }}</span>
  <span
    @click="showMenu"
    class="triangle-dropdown"
    v-click-outside="() => (isMenuShown = false)"
  >
    <Teleport to="#triangle-modal">
      <div
        v-if="isMenuShown"
        class="table-feature-list-container"
        :style="{
          left: menuPos.x - 90 + 'px',
          top: (menuPos.isLast ? menuPos.y - 90 : menuPos.y + 8) + 'px',
        }"
      >
        <div class="table-feature-list">
          <div
            @click="
              () => {
                showEmployeeForm({
                  data,
                  mode: ACCOUNTING_ENUM.MODE.DUPLICATE,
                });
              }
            "
          >
            {{ $t("words.duplicate") }}
          </div>
          <div
            @click="
              () => {
                isDialogShown = true;
              }
            "
          >
            {{ $t("words.delete") }}
          </div>
          <div>{{ $t("words.stopUsing") }}</div>
        </div>
      </div>
    </Teleport>
  </span>
</template>
<script>
import { ref } from "vue";
import { ACCOUNTING_ENUM } from "@/helpers/enums";
export default {
  name: "EmployeeTableFeatureCellButton",
  props: {
    // Dữ liệu dòng
    data: {
      type: Object,
    },
  },
  emits: ["showEmployeeForm", "deleteEmployee"],
  setup(_, { emit }) {
    //#region Khai báo phương thức
    const isMenuShown = ref(false);
    const menuPos = ref({ x: 0, y: 0 });
    const isDialogShown = ref(false);
    /**
     * - Feature: Hiển thị form
     * - Author: Lê Minh Quang (28/06/2023)
     */
    const showEmployeeForm = (formData) => {
      emit("showEmployeeForm", formData);
    };

    /**
     * - Feature: Hiển thị menu
     * - Author: Lê Minh Quang (28/06/2023)
     * @param {event} e
     */
    const showMenu = (e) => {
      if (isMenuShown.value) {
        isMenuShown.value = false;
      } else {
        menuPos.value = { x: e.x, y: e.y };
        isMenuShown.value = true;
      }
    };

    /**
     * Feature: Hành động khi nhấn nút hủy ở dialog
     * Author: Lê Minh Quang (29/06/2023)
     */
    const cancelDeleteAction = () => {
      // Đóng menu và tắt dialog
      menuPos.value = null;
      isDialogShown.value = false;
    };

    /**
     * Feature: Xóa nhân viên
     * Author: Lê Minh Quang (29/06/2023)
     * @param {string} employeeId - ID nhân viên
     */
    const deleteEmployee = (employeeId) => {
      emit("deleteEmployee", employeeId);
      // Đóng menu và tắt dialog
      isDialogShown.value = false;
      menuPos.value = null;
    };
    //#endregion
    return {
      showMenu,
      isMenuShown,
      menuPos,
      ACCOUNTING_ENUM,
      isDialogShown,
      showEmployeeForm,
      cancelDeleteAction,
      deleteEmployee,
    };
  },
};
</script>
