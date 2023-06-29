<template>
  <Teleport to="#import-modal">
    <EmployeeImportModal
      v-if="isImportModalShown"
      @hideImportModal="isImportModalShown = false"
      @refreshTable="refreshTable"
    />
  </Teleport>
  <BaseDialog
    v-if="isDialogShown"
    :text="$t('deleteManyEmployeeWarning')"
    :cancelText="$t('words.no')"
    :continueText="$t('words.yes')"
    type="warning"
    @cancelAction="isDialogShown = false"
    @continueAction="deleteSelectedRows"
  />
  <!--Feature row-->
  <div class="table__feature-row">
    <!--Batch execution button-->
    <div
      class="batch-execution-button"
      :class="{ deactive: !isActive }"
      @click.stop="showBatchActionList"
      v-click-outside="() => (isBatchActionListShown = false)"
    >
      <p>{{ $t("words.batchExecution") }}</p>
      <div class="batch-execution-feature-list" v-if="isBatchActionListShown">
        <div @click="isDialogShown = true">{{ $t("words.delete") }}</div>
      </div>
    </div>

    <!--Filter list-->
    <div
      v-if="!rowsSelected.length && Object.keys(filters).length > 0"
      class="table__feature-filter-container"
    >
      <div
        class="selected__filter-container"
        v-for="filter in Object.keys(filters)"
        :key="filter"
      >
        <p class="filter__quote">
          {{ $t(`headers.${filter}`) }}
          {{
            // Format kí hiệu sang chữ
            convertOperator(
              filters[filter].slice(-2), // Operator
              filters[filter].substring(0, filters[filter].length - 2), // Value
              filter // Model
            )
          }}
        </p>
        <div class="remove-filter-btn" @click="removeFilter(filter)"></div>
      </div>
      <div class="remove-all-filter-btn" @click="removeAllFilter">
        {{ $t("words.removeFilters") }}
      </div>
    </div>
    <!--Feature group-->
    <div class="table__feature-container">
      <BaseTextField
        :placeholder="$t('words.searchByCodeAndName')"
        :value="keyword"
        name="search"
        @fieldChange="updateSearch"
      />
      <div
        @click="refreshTable"
        class="table__refresh-icon tooltip-container"
        v-showTooltip="$t('words.refetchData')"
      ></div>
      <div
        class="table__excel-icon tooltip-container"
        @click="exportExcel"
        v-showTooltip="$t('words.exportExcel')"
      ></div>
      <div
        class="table__setting-icon tooltip-container"
        v-showTooltip="$t('words.modifyDisplaySettings')"
        @click="showSettings"
      ></div>
      <div class="customBtn">
        <div @click="showEmployeeForm">
          <BaseButton :text="$t('words.add')" type="primary" />
        </div>
        <div
          class="showImportModalBtn"
          @click="importExcelDialogShown = !importExcelDialogShown"
        >
          <div class="arrowDown"></div>
          <div
            class="dialog"
            @click="showImportModal"
            v-if="importExcelDialogShown"
          >
            {{ $t("words.importExcel") }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <EmployeeTableSettings
    v-if="isSettingsShown"
    @updateDisplaySetting="updateDisplaySetting($event)"
    @closeSettings="closeSettings"
  />
</template>
<script>
import { ref, watch } from "vue";
import { TABLE_HEADERS, convertOperator } from "@/helpers/constants";
import { ACCOUNTING_ENUM } from "@/helpers/enums";
import { exportToExcel } from "@/helpers/api";
import EmployeeTableSettings from "./EmployeeTableSettings.vue";
import store from "@/store";
import EmployeeImportModal from "../import/EmployeeImportModal.vue";
export default {
  name: "EmployeeTableFeatureRow",
  props: ["rowsSelected", "keyword", "filters"],
  emits: [
    "refreshTable",
    "showEmployeeForm",
    "dropAllCheckBoxes",
    "selectAllCheckboxes",
    "deleteSelectedRows",
    "updateSearch",
    "removeFilter",
    "removeAllFilter",
    "updateDisplaySetting",
  ],
  setup(props, { emit }) {
    //#region Khai báo state
    const isDialogShown = ref(false);
    const isSettingsShown = ref(false);
    const isImportModalShown = ref(false);
    const importExcelDialogShown = ref(false);
    const isActive = ref(props.rowsSelected.length > 1);
    const isBatchActionListShown = ref(false);
    //#endregion

    // Cho phép thực hiện hàng loạt nếu số lượng dòng được chọn lớn hơn hoặc bằng 1
    watch(
      () => props.rowsSelected,
      (newVal) => {
        isActive.value = newVal.length >= 1;
      },
      { deep: true }
    );

    //#region Khai báo phương thức

    /**
     * Feature: Lấy lại dữ liệu
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */

    const refreshTable = () => {
      emit("refreshTable");
    };

    /**
     * Feature: Hiển thị form
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */

    const showEmployeeForm = () => {
      emit("showEmployeeForm", { mode: ACCOUNTING_ENUM.MODE.ADD, data: {} });
    };

    /**
     * Feature: Bỏ tất cả checkbox
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */

    const dropAllCheckBoxes = () => {
      emit("dropAllCheckBoxes");
    };

    /**
     * Feature: Chọn tất cả checkbox
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */

    const selectAllCheckboxes = () => {
      emit("selectAllCheckboxes");
    };

    /**
     * Feature: Xóa tất cả các hàng đã chọn
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */

    const deleteSelectedRows = () => {
      emit("deleteSelectedRows");
      isDialogShown.value = false;
    };

    /**
     * Feature: Cập nhật tìm kiếm
     * @param {{search:string}} e keyword tìm kiếm
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */
    const updateSearch = (e) => {
      emit("updateSearch", e.search);
    };

    /**
     * Feature: Bỏ chọn tất cả bộ lọc
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */
    const removeAllFilter = () => {
      emit("removeAllFilter");
    };

    /**
     * Feature: Xóa lọc
     * @param {*} e
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */

    const removeFilter = (e) => {
      emit("removeFilter", e);
    };

    /**
     * Feature: Hiển thị modal tùy chỉnh giao diện
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */

    const showSettings = () => {
      isSettingsShown.value = true;
    };

    /**
     * Feature: Cập nhật giao diện
     * @param {*} e
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */

    const updateDisplaySetting = (e) => {
      emit("updateDisplaySetting", e);
      isSettingsShown.value = false;
    };

    /**
     * Feature: Đóng modal tùy chỉnh giao diện
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */

    const closeSettings = () => {
      isSettingsShown.value = false;
    };

    /**
     * Feature: Xuất excel
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */

    const exportExcel = async () => {
      store.commit("showLoading");
      // Truyền vào search keyword và các headers đang hiển thị
      await exportToExcel(props.keyword, {
        headers: JSON.parse(localStorage.getItem("displaySettings"))
          ? JSON.parse(localStorage.getItem("displaySettings"))
              .filter((item) => item.isShown)
              .map((item) => ({
                headerName: item.headerName,
                model: item.model,
                align: item.className[0].split("--")[1],
                width: item.width,
              }))
          : TABLE_HEADERS.filter((item) => item.isShown).map((item) => ({
              headerName: item.headerName,
              model: item.model,
              align: item.className[0].split("--")[1],
              width: item.width,
            })),
        filterList: props.filters,
      });
      store.commit("hideLoading");
    };

    /**
     * Feature: Hiển thị modal nhập excel
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */

    const showImportModal = () => {
      isImportModalShown.value = true;
    };

    /**
     * Feature: Hiển thị các chức năng gộp
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */
    const showBatchActionList = () => {
      if (isActive.value) {
        isBatchActionListShown.value = !isBatchActionListShown.value;
      }
    };

    //#endregion
    return {
      isDialogShown,
      isSettingsShown,
      isImportModalShown,
      importExcelDialogShown,
      isActive,
      isBatchActionListShown,
      showImportModal,
      updateSearch,
      refreshTable,
      showEmployeeForm,
      dropAllCheckBoxes,
      selectAllCheckboxes,
      deleteSelectedRows,
      convertOperator,
      removeAllFilter,
      removeFilter,
      showSettings,
      updateDisplaySetting,
      closeSettings,
      exportExcel,
      showBatchActionList,
    };
  },
  components: { EmployeeTableSettings, EmployeeImportModal },
};
</script>
