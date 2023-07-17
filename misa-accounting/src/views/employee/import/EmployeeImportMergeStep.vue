<template>
  <div class="import-merge-body">
    <div class="import-merge-intro">
      <div class="import-merge-intro--left">
        <p>Ghép cột trên phần mềm với cột trên tệp dữ liệu</p>
        <input type="text" />
      </div>
    </div>

    <table class="table-content">
      <thead class="table-content__header">
        <tr>
          <th style="width: 80px" class="align--center">
            Thông tin cột bắt buộc
          </th>
          <th>Cột trên phần mềm</th>
          <th style="width: 250px">Cột trên tệp dữ liệu</th>
          <th>Diễn giải</th>
        </tr>
      </thead>
      <tbody class="table-content__body">
        <tr v-for="header in TABLE_HEADERS" :key="header.headerName">
          <td class="align--center">
            <input
              type="checkbox"
              :disabled="header.required"
              :checked="header.required"
            />
          </td>

          <td>
            {{ header.headerName }}
          </td>
          <td>
            <BaseDropDownList
              :value="
                excelHeaders.filter((item) => item.model == header.model)[0]
                  ?.headerName
              "
              @fieldChange="updateExcelData(header.model, $event)"
              displayTextField="headerName"
              trueField="model"
              :readonly="true"
              :defaultList="excelHeaders"
            />
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { TABLE_HEADERS } from "@/helpers/constants";
import { ACCOUNTING_ENUM } from "@/helpers/enums";

export default {
  name: "EmployeeImportMergeStep",
  props: {
    // Các đầu excel chứa model và tên
    excelHeaders: {
      type: Array,
    },
  },
  emits: ["updateExcelData"],
  setup(_, { emit }) {
    //#region
    /**
     * Feature: Cập nhật dữ liệu excel
     * @param {string} model
     * @param {string} headerName
     * Author: Lê Minh Quang (29/06/2023)
     */

    const updateExcelData = (model, event) => {
      emit("updateExcelData", { model, headerName: event["headerName"] });
    };
    //#endregion
    return { updateExcelData, TABLE_HEADERS, ACCOUNTING_ENUM };
  },
};
</script>
