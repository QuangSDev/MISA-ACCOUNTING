<template>
  <BaseDialog
    v-if="isDialogShown"
    :text="$t('deleteWarningText', { id: menuPos?.data?.employeeCode })"
    :cancelText="$t('words.no')"
    :continueText="$t('words.yes')"
    type="warning"
    @cancelAction="cancelDeleteAction"
    @continueAction="deleteEmployee(menuPos?.data?.employeeID)"
    innerAlign="between"
  />
  <!--Triangle button-->
  <div
    v-click-outside:triangle-dropdown="
      () => {
        isMenuShown = false;
      }
    "
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
              data: menuPos?.data,
              mode: ACCOUNTING_ENUM.MODE.DUPLICATE,
            });
            isMenuShown = false;
          }
        "
      >
        {{ $t("words.duplicate") }}
      </div>
      <div
        @click="
          () => {
            isDialogShown = true;
            isMenuShown = false;
          }
        "
      >
        {{ $t("words.delete") }}
      </div>
      <div>{{ $t("words.stopUsing") }}</div>
    </div>
  </div>
  <!--Table body-->
  <tbody class="table-content__body">
    <tr
      v-for="data in employeeList"
      :key="data.employeeID"
      :class="
        // Kiểm tra dòng có được chọn không nếu có thêm class được chọn
        rowsSelected.some((item) => item === data.employeeID)
          ? 'row--checked'
          : ''
      "
    >
      <!--Chỉ hiện thị cột checkbox nếu có ít nhất một cột dữ liệu được hiển thị-->
      <td
        class="table__checkbox-cell align--center"
        v-if="headerList.some((item) => item.isShown)"
      >
        <div
          class="table__custom-checkbox"
          :class="
            rowsSelected.some((item) => item == data.employeeID)
              ? 'activated'
              : ''
          "
          @click="() => selectRow(data.employeeID)"
        >
          <div
            v-if="rowsSelected.some((item) => item == data.employeeID)"
            class="checkmark"
          ></div>
        </div>
      </td>
      <!--Hiển thị các cột được chọn hiển thị-->
      <td
        @dblclick="
          showEmployeeForm({ data, mode: ACCOUNTING_ENUM.MODE.UPDATE })
        "
        v-for="header in headerList.filter((item) => item.isShown)"
        :class="header.className"
        :key="header.className"
        :style="{
          position: header.sticky ? 'sticky' : 'unset',
          zIndex: header.sticky ? 2 : 'unset',
          left:
            calculateWidth(
              headerList,
              headerList
                .filter((item) => item.isShown && item.sticky)
                .findIndex((item) => item.model == header.model)
            ) + 'px',
        }"
        v-showTooltip="data[header.model]"
      >
        <!--Format các cell có giá trị là ngày-->
        {{
          header.model.toLowerCase().includes("date")
            ? data[header.model]
              ? new Date(data[header.model]).toLocaleDateString("en-GB")
              : null
            : data[header.model]
        }}
      </td>
      <!--Chỉ hiện thị cột chức năng nếu có ít nhất một cột dữ liệu được hiển thị-->
      <td
        class="align--center table__feature-cell"
        v-if="headerList.some((item) => item.isShown)"
      >
        <EmployeeTableFeatureCellButton
          @showMenu="isMenuShown = $event"
          @updateMenu="menuPos = $event"
          @showEmployeeForm="
            showEmployeeForm({ data, mode: ACCOUNTING_ENUM.MODE.UPDATE })
          "
          :data="data"
          :isMenuShown="isMenuShown"
        />
      </td>
    </tr>
  </tbody>
</template>
<script>
import { ACCOUNTING_ENUM } from "@/helpers/enums";
import EmployeeTableFeatureCellButton from "./EmployeeTableFeatureCellButton.vue";
import { calculateWidth } from "@/helpers/constants";
import { ref } from "vue";
export default {
  name: "EmployeeTableContentBody",
  props: ["employeeList", "rowsSelected", "headerList"],
  components: { EmployeeTableFeatureCellButton },
  emits: ["showEmployeeForm", "deleteEmployee", "selectRow"],
  setup(_, { emit }) {
    //#region Khai báo state
    const isDialogShown = ref(false);
    const menuPos = ref(null);
    const isMenuShown = ref(false);
    //#endregion

    //#region Khai báo phương thức

    /**
     * Feature: Chọn dòng
     * @param {string} id
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */
    const selectRow = (id) => {
      emit("selectRow", id);
    };

    /**
     * Feature: Hiển thị form
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     * @param {{data: object, mode: number}} formData dữ liệu form
     */
    const showEmployeeForm = (formData) => {
      emit("showEmployeeForm", formData);
    };

    /**
     * Feature: Hành động khi nhấn nút hủy ở dialog
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */
    const cancelDeleteAction = () => {
      // Đóng menu và tắt dialog
      menuPos.value = null;
      isDialogShown.value = false;
    };

    /**
     * Feature: Xóa nhân viên
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     * @param {string} employeeId id nhân viên
     */
    const deleteEmployee = (employeeId) => {
      emit("deleteEmployee", employeeId);
      // Đóng menu và tắt dialog
      isDialogShown.value = false;
      menuPos.value = null;
    };
    //#endregion

    return {
      isDialogShown,
      menuPos,
      isMenuShown,
      ACCOUNTING_ENUM,
      showEmployeeForm,
      cancelDeleteAction,
      deleteEmployee,
      selectRow,
      calculateWidth,
    };
  },
};
</script>
