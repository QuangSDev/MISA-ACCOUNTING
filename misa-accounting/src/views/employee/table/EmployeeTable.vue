<template>
  <EmployeeTableFeatureRow
    @refreshTable="refreshTable"
    @showEmployeeForm="showEmployeeForm"
    @selectAllCheckboxes="selectAllCheckboxes"
    @dropAllCheckBoxes="dropAllCheckBoxes"
    @deleteSelectedRows="deleteSelectedRows"
    :rowsSelected="rowsSelected"
    :keyword="keyword"
    @updateSearch="updateSearch"
    :filters="filters"
    @removeFilter="removeFilter"
    @removeAllFilter="removeAllFilter"
    @updateDisplaySetting="updateDisplaySetting"
  />

  <div class="table-content-wrapper">
    <table class="table-content">
      <EmployeeTableContentHeader
        @selectAll="selectAllCheckboxes"
        @deselectAll="dropAllCheckBoxes"
        :isSelectedAll="isSelectedAll"
        :headerList="headerList"
        @updateFilter="updateFilter"
        @removeFilter="removeFilter"
      />
      <EmployeeTableContentBody
        :employeeList="employeeList"
        :rowsSelected="rowsSelected"
        :headerList="headerList"
        @showEmployeeForm="showEmployeeForm"
        @deleteEmployee="deleteEmployee"
        @selectRow="selectRow"
      />
    </table>
    <div v-if="records > 0" class="table-content__footer">
      <p>
        {{ $t("words.total") }}:
        <b id="record__number">{{ records?.toLocaleString("it-IT") }}</b>
        {{ $t("words.record") }}
      </p>
      <BasePagination
        :rowsPerPage="rowsPerPage"
        :page="page"
        :total="records"
        @setPage="setPage"
        @changeRowsPerPage="changeRowsPerPage"
      />
    </div>
  </div>
</template>
<script>
import EmployeeTableFeatureRow from "./EmployeeTableFeatureRow.vue";
import EmployeeTableContentHeader from "./EmployeeTableContentHeader.vue";
import EmployeeTableContentBody from "./EmployeeTableContentBody.vue";
import { ACCOUNTING_ENUM } from "@/helpers/enums";
import { computed, ref, onBeforeMount } from "vue";
import { TABLE_HEADERS } from "@/helpers/constants";
export default {
  name: "EmployeeTable",
  props: {
    // Kiểm tra form mở
    isFormOpen: {
      type: Boolean,
      default: false,
    },
    // Danh sách nhân viên
    employeeList: {
      type: Array,
      default: () => [],
    },
    // Số bản ghi
    records: {
      type: Number,
      default: 1,
    },
    // Trang hiện tại
    page: {
      type: Number,
      default: 1,
    },
    // Số bản ghi trên trang
    rowsPerPage: {
      type: Number,
      default: 10,
    },
    // Từ khóa tìm kiếm
    keyword: {
      type: String,
      default: "",
    },
    // Obj chứa các điều kiện lọc
    filters: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    EmployeeTableFeatureRow,
    EmployeeTableContentHeader,
    EmployeeTableContentBody,
  },
  emits: [
    "showEmployeeForm",
    "deleteEmployee",
    "refreshTable",
    "changeRowsPerPage",
    "prevPage",
    "nextPage",
    "deleteSelectedRows",
    "setPage",
    "updateSearch",
    "updateFilter",
    "removeFilter",
    "removeAllFilter",
  ],
  setup(props, { emit }) {
    //#region Khai báo state
    const rowsSelected = ref([]);
    const headerList = ref(
      localStorage.getItem("displaySettings")
        ? JSON.parse(localStorage.getItem("displaySettings"))
        : JSON.parse(JSON.stringify(TABLE_HEADERS))
    );
    const isSelectedAll = computed(() => {
      return props.employeeList.every((emp) =>
        rowsSelected.value.some((item) => emp.employeeID == item)
      );
    });

    onBeforeMount(() => {
      const stickyHeaderList = headerList.value.filter(
        (header) => header.sticky
      );
      const nonStickyHeaderList = headerList.value.filter(
        (header) => !header.sticky
      );
      const renderHeaderList = [...stickyHeaderList, ...nonStickyHeaderList];
      headerList.value = renderHeaderList;
    });
    //#endregion

    //#region Khai báo phương thức

    /**
     * Feature: Về trang trước
     * Author: Lê Minh Quang (28/06/2023)
     */
    const prevPage = () => {
      if (props.page > 1) {
        emit("prevPage");
      }
    };

    /**
     * Feature: Sang trang sau
     * Author: Lê Minh Quang (28/06/2023)
     */
    const nextPage = () => {
      if (props.rowsPerPage * props.page < props.records) {
        emit("nextPage");
      }
    };

    /**
     * Feature: Thay đổi số lượng dòng trên một trang
     * Author: Lê Minh Quang (28/06/2023)
     * @param {number} rowPerPage - Số bản ghi trên một trang

     */
    const changeRowsPerPage = (rowPerPage) => {
      emit("changeRowsPerPage", rowPerPage);
    };

    /**
     * Feature: Chọn trang
     * Author: Lê Minh Quang (28/06/2023)
     * @param {number} pageNumber - Trang được chọn
 
     */
    const setPage = (pageNumber) => {
      emit("setPage", pageNumber);
    };

    /**
     * Feature: Chọn dòng
     * Author: Lê Minh Quang (28/06/2023)
     * @param {string} rowID -ID của dòng
     */

    const selectRow = (rowID) => {
      /** Kiểm tra trong số các dòng đã chọn đã có dòng này chưa, 
      nếu chưa thì thêm và còn không bỏ dòng đó ra khỏi các dòng đã chọn */
      if (!rowsSelected.value.some((item) => item === rowID)) {
        rowsSelected.value.push(rowID);
      } else {
        const index = rowsSelected.value.findIndex((item) => item === rowID);
        rowsSelected.value.splice(index, 1);
      }
    };

    /**
     * - Feature: Lấy lại dữ liệu
     * - Author: Lê Minh Quang (28/06/2023)
     */

    const refreshTable = () => {
      emit("refreshTable");
    };

    /**
     * - Feature: Hiển thị form nhân viên
     * - Author: Lê Minh Quang (28/06/2023)
     * @param {{data: object, mode: number}} formData - Dữ liệu form
     */

    const showEmployeeForm = (formData) => {
      emit("showEmployeeForm", formData);
    };

    /**
     * Feature: Xóa nhân viên
     * Author: Lê Minh Quang (28/06/2023)
     * @param {string} employeeID id của nhân viên
     */

    const deleteEmployee = (employeeID) => {
      emit("deleteEmployee", employeeID);
    };

    /**
     * - Feature: Bỏ chọn tất cả checkbox
     * - Author: Lê Minh Quang (28/06/2023)
     */

    const dropAllCheckBoxes = () => {
      rowsSelected.value.splice(0);
    };

    /**
     * - Feature: Chọn tất cả checkbox
     * - Author: Lê Minh Quang (28/06/2023)
     */

    const selectAllCheckboxes = () => {
      // Tạo thành một dãy chứa các id nhân viên và thêm vào dãy các dòng đã chọn
      const all = props.employeeList.map((item) => item.employeeID);
      rowsSelected.value.push(...all);
    };

    /**
     * - Feature: Xóa các hàng được chọn
     * - Author: Lê Minh Quang (28/06/2023)
     */
    const deleteSelectedRows = () => {
      emit("deleteSelectedRows", rowsSelected.value);
      emit("setPage", 1);
      rowsSelected.value = [];
    };

    /**
     * - Feature: Cập nhật từ khóa tìm kiếm
     * - Author: Lê Minh Quang (28/06/2023)
     * @param {string} keyword - Từ khóa
     */
    const updateSearch = (keyword) => {
      emit("updateSearch", keyword);
    };

    /**
     * - Feature: Cập nhật bộ lọc
     * - Author: Lê Minh Quang (28/06/2023)
     * @param {Object.<string, string>} filter - Bộ lọc
     */
    const updateFilter = (filter) => {
      emit("updateFilter", filter);
    };

    /**
     * - Feature: Xóa một điều kiện lọc
     * - Author: Lê Minh Quang (28/06/2023)
     * @param {string} filterModel - Model bộ lọc
     */
    const removeFilter = (filterModel) => {
      emit("removeFilter", filterModel);
    };

    /**
     * Feature: Xóa tất cả điều kiện lọc
     * Author: Lê Minh Quang (28/06/2023)
     */
    const removeAllFilter = () => {
      emit("removeAllFilter");
    };

    /**
     * Feature: Cập nhật giao diện
     * Author: Lê Minh Quang (28/06/2023)
     * @param {Array.<Object>} newHeaderList - Danh sách header mới
     */
    const updateDisplaySetting = (newHeaderList) => {
      // Lọc ra các cột cố định và các không cố định, sau đó ghép lại theo thứ tự cột cố định trước, không cố định sau
      const stickyHeaderList = newHeaderList.filter((header) => header.sticky);
      const nonStickyHeaderList = newHeaderList.filter(
        (header) => !header.sticky
      );
      const renderHeaderList = [...stickyHeaderList, ...nonStickyHeaderList];
      headerList.value = renderHeaderList;
    };

    //#endregion

    return {
      ACCOUNTING_ENUM,
      rowsSelected,
      headerList,
      isSelectedAll,
      prevPage,
      nextPage,
      showEmployeeForm,
      refreshTable,
      deleteEmployee,
      selectRow,
      changeRowsPerPage,
      dropAllCheckBoxes,
      selectAllCheckboxes,
      deleteSelectedRows,
      setPage,
      updateSearch,
      updateFilter,
      removeFilter,
      removeAllFilter,
      updateDisplaySetting,
    };
  },
};
</script>
