<template>
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
          @showEmployeeForm="showEmployeeForm"
          @deleteEmployee="deleteEmployee"
          :data="data"
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
  props: {
    // Danh sách nhân viên
    employeeList: {
      type: Array,
      default: () => [],
    },
    // Các dòng được chọn
    rowsSelected: {
      type: Array,
    },
    // Các cột hiển thị
    headerList: {
      type: Array,
    },
  },
  components: { EmployeeTableFeatureCellButton },
  emits: ["showEmployeeForm", "deleteEmployee", "selectRow"],
  setup(_, { emit }) {
    //#region Khai báo state
    const isDialogShown = ref(false);
    const menuPos = ref(null);
    //#endregion

    //#region Khai báo phương thức

    /**
     * Feature: Chọn dòng
     * Author: Lê Minh Quang (29/06/2023)
     * @param {string} id - ID dòng

     */
    const selectRow = (id) => {
      emit("selectRow", id);
    };

    /**
     * - Feature: Hiển thị form
     * - Author: Lê Minh Quang (29/06/2023)
     * @param {{data: object, mode: number}} formData - Dữ liệu form
     */
    const showEmployeeForm = (formData) => {
      emit("showEmployeeForm", formData);
    };

    /**
     * Feature: Xóa nhân viên
     * Author: Lê Minh Quang (29/06/2023)
     * @param {string} employeeId - ID nhân viên
     */
    const deleteEmployee = (employeeId) => {
      emit("deleteEmployee", employeeId);
    };

    //#endregion

    return {
      isDialogShown,
      menuPos,
      ACCOUNTING_ENUM,
      showEmployeeForm,
      deleteEmployee,
      selectRow,
      calculateWidth,
    };
  },
};
</script>
