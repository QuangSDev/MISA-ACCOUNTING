<template>
  <div class="import-validate">
    <p
      style="color: green"
      v-if="validatedRows.filter((item) => item.status).length > 0"
    >
      {{ validatedRows.filter((item) => item.status).length }} dòng dữ liệu nhân
      viên hợp lệ
    </p>
    <div v-if="validatedRows.filter((item) => !item.status).length > 0">
      <p style="color: red; font-size: 18px">
        {{ validatedRows.filter((item) => !item.status).length }} dòng dữ liệu
        nhân viên không hợp lệ
      </p>
    </div>
    <table class="table-content">
      <thead class="table-content__header">
        <tr>
          <th>Dòng số</th>
          <th>Tình trạng</th>
          <th>Chi tiết lỗi</th>
          <th
            v-for="header in TABLE_HEADERS.filter((item) =>
              mergeData.some((data) => data[item.model])
            )"
            :key="header"
          >
            {{ header.headerName }}
          </th>
        </tr>
      </thead>
      <tbody class="table-content__body">
        <tr v-for="(row, index) in validatedRows" :key="row.row">
          <td>{{ row.row }}</td>
          <td :style="{ color: row.status ? 'green' : 'red' }">
            {{ row.status ? "Hợp lệ" : "Không hợp lệ" }}
          </td>
          <td style="color: red">{{ row.errorMessage }}</td>
          <td
            v-for="prop in TABLE_HEADERS.filter((item) =>
              mergeData.some((data) => data[item.model])
            )"
            :key="prop.model"
          >
            {{
              prop.model == "genderName"
                ? row.employee["gender"] == 0
                  ? "Nữ"
                  : row.employee["gender"] == 1
                  ? "Nam"
                  : row.employee["gender"] == 2
                  ? "Khác"
                  : mergeData[index]["genderName"]
                : row.employee[prop.model]
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { TABLE_HEADERS } from "@/helpers/constants";
import { onMounted } from "vue";
import { validateExcelData } from "@/helpers/api";
import store from "@/store";
export default {
  name: "EmployeeImportValidateStep",
  props: ["mergeData", "excelData", "excelHeaders", "validatedRows", "mode"],
  setup(props, { emit }) {
    // Xác minh dữ liệu khi mounted
    onMounted(async () => {
      store.commit("showLoading");
      const res = await validateExcelData(props.mergeData, props.mode);
      if (res.length > 0) {
        emit("updateValidatedRows", res);
      }
      store.commit("hideLoading");
    });
    return { TABLE_HEADERS };
  },
};
</script>
