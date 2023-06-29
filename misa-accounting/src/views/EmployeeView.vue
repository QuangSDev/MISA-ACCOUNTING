<template>
  <div class="main-content__header">
    <p class="main-content__title">{{ $t("words.employee") }}</p>
  </div>
  <EmployeeForm
    v-if="isFormOpen"
    :isFormOpen="isFormOpen"
    :formDetail="formDetail"
    @closeForm="closeForm"
    @refreshTable="refreshTable"
  />
  <EmployeeTable
    :page="page"
    :rowsPerPage="rowsPerPage"
    :employeeList="employeeList"
    :records="total"
    :keyword="keyword"
    :filters="filters"
    @prevPage="page -= 1"
    @nextPage="page += 1"
    @refreshTable="refreshTable"
    @deleteEmployee="deleteEmployee"
    @showEmployeeForm="showEmployeeForm"
    @changeRowsPerPage="changeRowsPerPage"
    @deleteSelectedRows="deleteSelectedRows"
    @setPage="setPage"
    @updateSearch="updateSearch"
    @updateFilter="updateFilter"
    @removeAllFilter="removeAllFilter"
    @removeFilter="removeFilter"
  />
</template>
<script>
//#region import component
import EmployeeTable from "../components/employee/table/EmployeeTable.vue";
import EmployeeForm from "@/components/employee/form/EmployeeForm.vue";
import { ref, onMounted, watch } from "vue";
import { getGeneratedCode } from "@/helpers/api";
import store from "@/store";
import {
  deleteEmployee as deleteEmployeeById,
  getFilterEmployees,
  deleteManyEmployees,
} from "@/helpers/api";
import { ACCOUNTING_TEXT } from "@/helpers/resources";
import { ACCOUNTING_ENUM } from "@/helpers/enums";
import { showToast } from "@/helpers/constants";

//#endregion

export default {
  name: "EmployeeView",
  components: { EmployeeTable, EmployeeForm },

  setup() {
    //#region Khai báo state

    const isFormOpen = ref(false);
    const formDetail = ref(null);
    const employeeList = ref([]);
    const total = ref(0);
    const page = ref(1);
    const rowsPerPage = ref(20);
    const keyword = ref("");
    const filters = ref({});
    const isDialogOpen = ref(false);
    //#endregion

    /**
     * Feature: Lấy dữ liệu khi mounted
     * Author: Lê Minh Quang
     * Date: 22/03/2023
     */

    onMounted(async () => {
      store.commit("showLoading");

      try {
        const res = await getFilterEmployees(
          keyword.value,
          rowsPerPage.value,
          page.value
        );
        employeeList.value = res.data;
        total.value = res.totalRecord;
      } catch (error) {
        showToast(
          "error",
          error.response.data?.userMsg || ACCOUNTING_TEXT.vi.systemError
        );
      }
      store.commit("hideLoading");
    });

    //#region Khai báo phương thức
    /**
     * Feature: Thay đổi trang
     * Author: Lê Minh Quang
     * Date: 28/03/2023
     * @param {number} pageNumber: trang
     */
    const setPage = (pageNumber) => {
      page.value = pageNumber;
    };

    /**
     * Feature: Thay đổi số dòng trên một trang
     * Author: Lê Minh Quang
     * Date: 28/03/2023
     * @param {*} rowNumber: số lượng dòng
     */
    const changeRowsPerPage = (rowNumber) => {
      rowsPerPage.value = rowNumber;
    };

    /**
     *
     * @param {*} e
     * Feature: Hiển thị form
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */

    const showEmployeeForm = async (e) => {
      if (
        e.mode === ACCOUNTING_ENUM.MODE.ADD ||
        e.mode === ACCOUNTING_ENUM.MODE.DUPLICATE
      ) {
        const newEmployeeCode = await getGeneratedCode();
        e = { ...e, data: { ...e.data, employeeCode: newEmployeeCode } };
      }
      formDetail.value = e;
      isFormOpen.value = true;
    };

    /**
     * Feature: Xóa dữ liệu form
     * Author: Le Minh Quang
     * Date: 29/03/2023
     */

    const clearInformation = () => {
      formDetail.value = null;
    };

    /**
     * Feature: Đóng form và reset dữ liệu
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */

    const closeForm = () => {
      formDetail.value = null;
      isFormOpen.value = false;
    };

    /**
     * Feature: Lấy lại dữ liệu
     * Author: Lê Minh Quang
     * Date: 22/03/2023
     */

    const refreshTable = async () => {
      store.commit("showLoading");
      try {
        const res = await getFilterEmployees(
          keyword.value,
          rowsPerPage.value,
          page.value,
          filters.value
        );
        employeeList.value = res.data;
        total.value = res.totalRecord;
      } catch (error) {
        showToast(
          "error",
          error.response.data?.userMsg || ACCOUNTING_TEXT.VI.systemError
        );
      }
      store.commit("hideLoading");
    };

    /**Feature: Xóa nhân viên
     * @param {string} employeeId
     * Author: Le Minh Quang
     * Date: 24/03/2023
     */

    const deleteEmployee = async (employeeId) => {
      store.commit("showLoading");
      try {
        // Xóa nhân viên
        await deleteEmployeeById(employeeId);
        // Lấy lại dữ liệu sau xóa
        await refreshTable();
        showToast("success", ACCOUNTING_TEXT.vi.successToast.deleteEmployee);
      } catch (error) {
        showToast(
          "error",
          error.response.data?.userMsg ||
            ACCOUNTING_TEXT.vi.errorToast.deleteEmployee
        );
      }
      store.commit("hideLoading");
    };

    /**
     * Feature: Xóa các dòng được chọn
     * Author: Lê Minh Quang
     * Date: 28/03/2023
     */

    const deleteSelectedRows = async (selectedRows) => {
      store.commit("showLoading");
      try {
        await deleteManyEmployees(selectedRows);
        await refreshTable();
        showToast("success", ACCOUNTING_TEXT.vi.successToast.deleteEmployee);
      } catch (error) {
        showToast(
          "error",
          error.response.data?.userMsg ||
            ACCOUNTING_TEXT.vi.errorToast.deleteEmployee
        );
      }
      store.commit("hideLoading");
    };

    /**
     * Feature: Cập nhật keyword tìm kiếm
     * Author: Lê Minh Quang
     * Date: 28/03/2023
     * @param {string} newKeyword
     */
    const updateSearch = (newKeyword) => {
      keyword.value = newKeyword;
    };

    /**
     * Feature: Cập nhật bộ lọc
     * Author: Lê Minh Quang
     * Date: 28/03/2023
     * @param {{filterName: string}} newFilter giá trị lọc mới
     */
    const updateFilter = (newFilter) => {
      filters.value[Object.keys(newFilter)[0]] =
        newFilter[Object.keys(newFilter)[0]];
    };

    /**
     * Feature: Xóa một điều kiện lọc
     * Author: Lê Minh Quang
     * Date: 28/03/2023
     * @param {string} filterName tên bộ lọc
     */
    const removeFilter = (filterName) => {
      delete filters.value[filterName];
    };

    /**
     * Feature: Xóa tất cả điều kiện lọc
     * Author: Lê Minh Quang
     * Date: 28/03/2023
     */
    const removeAllFilter = () => {
      filters.value = {};
    };

    //#endregion

    // Lấy lại dữ liệu nếu bộ lọc thay đổi
    watch(
      () => filters.value,
      () => {
        refreshTable();
        page.value = 1;
      },
      {
        deep: true,
      }
    );

    // Lấy lại dữ liệu nếu thay đổi trang
    watch(
      () => page.value,
      () => {
        refreshTable();
      }
    );

    // Lấy lại dữ liệu nếu thay đổi số dòng trên một trang
    watch(
      () => rowsPerPage.value,
      () => {
        refreshTable();
        page.value = 1;
      }
    );

    // Lấy lại dữ liệu nếu từ khóa tìm kiếm thay đổi
    let timeout = null;
    watch(
      () => keyword.value,
      () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          refreshTable();
        }, 500);
        page.value = 1;
      }
    );

    return {
      page,
      rowsPerPage,
      isFormOpen,
      employeeList,
      formDetail,
      isDialogOpen,
      total,
      keyword,
      filters,
      changeRowsPerPage,
      showEmployeeForm,
      closeForm,
      clearInformation,
      refreshTable,
      deleteEmployee,
      deleteSelectedRows,
      setPage,
      updateSearch,
      updateFilter,
      removeFilter,
      removeAllFilter,
    };
  },

  //#endregion
};
</script>
