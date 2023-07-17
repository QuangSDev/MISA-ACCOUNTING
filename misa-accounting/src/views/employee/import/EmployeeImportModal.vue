<template>
  <BaseDialog
    v-if="isDialogShown"
    align="center"
    innerAlign="center"
    text="Bạn chưa chọn tệp dữ liệu. Vui lòng kiểm tra lại."
    type="error"
    continueText="Đóng"
    @continueAction="
      () => {
        isDialogShown = false;
      }
    "
  />
  <div class="import-modal">
    <div class="import-modal__header">
      <div class="import-modal__header--top">
        <p class="import-modal__header__title">Nhập nhân viên từ Excel</p>
        <div></div>
      </div>
      <div class="import-modal__stepper">
        <div class="step active-step">
          <div class="step-circle first-circle">1</div>
          <p>CHỌN TỆP NGUỒN</p>
        </div>
        <div class="step" :class="{ 'active-step': step >= 2 }">
          <div class="step-circle second-circle">2</div>
          <p>GHÉP DỮ LIỆU</p>
        </div>
        <div class="step" :class="{ 'active-step': step >= 3 }">
          <div class="step-circle third-circle">3</div>
          <p class="third-step-text">KIỂM TRA DỮ LIỆU</p>
        </div>
        <div class="step" :class="{ 'active-step': step >= 4 }">
          <div class="step-circle last-circle">4</div>
          <p class="last-step-text">KẾT QUẢ</p>
        </div>
        <div class="step-line">
          <div
            class="current-step-line"
            :style="{
              width:
                step == 2
                  ? '28%'
                  : step == 3
                  ? '64%'
                  : step == 4
                  ? '100%'
                  : '0%',
            }"
          ></div>
        </div>
      </div>
    </div>
    <div class="import-modal__body">
      <EmployeeImportSelectFileStep
        v-if="step == 1"
        @dropFile="dropFile"
        @changeMode="mode = $event"
        @uploadFile="uploadFile"
        :file="file"
        :mode="mode"
        :sheetName="sheetName"
        :startPos="startPos"
      />
      <EmployeeImportMergeStep
        v-if="step == 2"
        @updateExcelData="updateMergeData"
        :excelHeaders="excelHeaders"
      />
      <EmployeeImportValidateStep
        v-if="step == 3"
        :mergeData="mergeData"
        :mode="mode"
        :excelHeaders="excelHeaders"
        :validatedRows="validatedRows"
        @updateValidatedRows="updateValidatedRows"
      />
      <EmployeeImportResultStep v-if="step == 4" />
    </div>
    <div class="import-modal__footer">
      <div class="import-modal__footer-bg"></div>
      <div v-if="step == 1" @click="hideImportModal">
        <BaseButton type="secondary" text="Hủy" />
      </div>
      <div v-if="step != 1" @click="step--">
        <BaseButton type="secondary" text="Quay lại" />
      </div>
      <div @click="nextStep" v-if="step < 3">
        <BaseButton type="primary" text="Tiếp tục" />
      </div>

      <div
        @click="importData"
        v-if="
          validatedRows.filter((item) => !item.status).length == 0 &&
          validatedRows.filter((item) => item.status).length > 0 &&
          step == 3
        "
      >
        <BaseButton type="primary" text="Nhập dữ liệu" />
      </div>
      <div
        @click="hideImportModal"
        v-if="
          step == 4 ||
          (step == 3 && validatedRows.filter((item) => !item.status).length > 0)
        "
      >
        <BaseButton type="primary" text="Đóng" />
      </div>
    </div>
  </div>
</template>
<script>
import { ref, watch } from "vue";
import EmployeeImportSelectFileStep from "./EmployeeImportSelectFileStep.vue";
import EmployeeImportMergeStep from "./EmployeeImportMergeStep.vue";
import EmployeeImportValidateStep from "./EmployeeImportValidateStep.vue";
import EmployeeImportResultStep from "./EmployeeImportResultStep.vue";
import { readExcel } from "@/helpers/constants";
import { TABLE_HEADERS } from "@/helpers/constants";
import store from "@/store";
import { ACCOUNTING_ENUM } from "@/helpers/enums";
import { createManyEmployee, updateManyEmployee } from "@/helpers/api";

export default {
  name: "EmployeeImportModal",
  emits: ["hideImportModal", "refreshTable"],
  components: {
    EmployeeImportSelectFileStep,
    EmployeeImportMergeStep,
    EmployeeImportValidateStep,
    EmployeeImportResultStep,
  },
  setup(_, { emit }) {
    //#region Khai báo state
    const validatedRows = ref([]);
    const step = ref(1);
    const importMethod = ref(1);
    const file = ref(null);
    const sheetName = ref("");
    const startPos = ref(1);
    const excelData = ref([]);
    const excelHeaders = ref([]);
    const dropFile = (e) => {
      file.value = e;
    };
    const mode = ref(ACCOUNTING_ENUM.MODE.ADD);
    const mergeData = ref([]);
    const isDialogShown = ref(false);
    //#endregion

    //#region Khai báo phương thức

    /**
     * Feature: Cập nhật dữ liệu ghép
     * Author: Lê Minh Quang (29/06/2023)
     * @param {*} e

     */
    const updateMergeData = (e) => {
      mergeData.value = mergeData.value.map((item, index) => ({
        ...item,
        [e.model]: excelData.value[index][e.headerName],
      }));
    };

    // Cập nhật giữ liệu khi file thay đổi
    watch(
      () => file.value,
      async (newVal) => {
        // Đọc file
        const res = await readExcel(newVal);
        store.commit("showLoading");
        // Gán tên sheet
        sheetName.value = res.sheetName;
        // Gán vị trí bắt đầu dữ liệu
        startPos.value = res.startPos + 1;

        // Tạo một array chứa dữ liệu ghép mặc định
        var arr = res.data.map((item) => {
          let obj = {};
          // Từ headers trả về, dùng headers mặc định để kiểm tra tên cột giống nhau, từ đó gắn giá trị tương ứng với model từ cột mặc định
          res.headers.forEach((key) => {
            let model = TABLE_HEADERS.filter(
              (item) => item.headerName.toLowerCase() == key.toLowerCase()
            )[0]?.model;
            if (model) {
              obj[model] = item[key];
            }
          });
          // Trả về giá trị các model và dòng
          return { ...obj, row: item.row };
        });
        mergeData.value = arr;
        excelData.value = res.data;
        excelHeaders.value = res.headers.map((key) => ({
          headerName: key,
          model: TABLE_HEADERS.filter(
            (item) => item.headerName.toLowerCase() == key.toLowerCase()
          )[0]?.model,
        }));
        store.commit("hideLoading");
      },
      { deep: true }
    );

    /**
     * - Feature: Tắt modal nhập excel
     * - Author: Lê Minh Quang (29/06/2023)
     */
    const hideImportModal = () => {
      emit("hideImportModal");
    };

    /**
     * - Feature: Sang bước tiếp theo
     * - Author: Lê Minh Quang (29/06/2023)
     */
    const nextStep = () => {
      if (step.value == 1 && !file.value) {
        isDialogShown.value = true;
        return;
      }
      step.value++;
    };

    /**
     * - Feature: Cập nhật các rows được xác minh
     * - Author: Lê Minh Quang (01/07/2023)
     * @param {} rows

     */
    const updateValidatedRows = (rows) => {
      validatedRows.value = rows;
    };

    /**
     * - Feature: Upload file
     * - Author: Lê Minh Quang (29/06/2023)
     * @param {*} upFile
     */
    const uploadFile = (upFile) => {
      file.value = upFile;
    };

    const importData = async () => {
      try {
        if (mode.value == ACCOUNTING_ENUM.MODE.ADD) {
          await createManyEmployee(mergeData.value);
        } else {
          await updateManyEmployee(mergeData.value);
        }
        emit("refreshTable");
        step.value++;
      } catch (error) {
        console.log(error);
      }
    };

    //#endregion

    return {
      validatedRows,
      step,
      mode,
      importMethod,
      sheetName,
      startPos,
      file,
      mergeData,
      excelData,
      excelHeaders,
      isDialogShown,
      importData,
      updateValidatedRows,
      nextStep,
      dropFile,
      updateMergeData,
      hideImportModal,
      uploadFile,
    };
  },
};
</script>
