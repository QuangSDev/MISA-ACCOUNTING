<template>
  <thead class="table-content__header">
    <tr>
      <!--Chỉ hiện thị cột checkbox nếu có ít nhất một cột dữ liệu được hiển thị-->
      <th
        v-if="isCheckboxCellShown"
        class="align--center table__header-checkbox"
        style="position: sticky; top: 0; left: 0"
      >
        <div
          @click="selectAll"
          class="table__custom-checkbox"
          :class="isSelectedAll ? 'activated' : ''"
        >
          <div v-if="isSelectedAll" class="checkmark"></div>
        </div>
      </th>
      <!--Lặp các cột dữ liệu và render nếu cột đó được chọn hiển thị-->
      <th
        v-for="header in displayedColumns"
        :class="header.className"
        :style="{
          minWidth: header.width + 'px',
          position: 'sticky',
          top: 0,
          zIndex: header.sticky ? 3 : 'unset',
          // Nếu cột được cố định, tính khoảng cách tới cột checkbox
          left: header.sticky
            ? calculateWidth(
                headerList,
                headerList
                  .filter((item) => item.isShown && item.sticky)
                  .findIndex((item) => item.model == header.model)
              ) + 'px'
            : '',
        }"
        :key="header.headerName"
        v-showTooltip="`${header?.tooltipText ? $t(header.tooltipText) : ''}`"
      >
        <span>{{ header.headerName }}</span>
        <BaseFilterButton
          @updateFilter="updateFilter"
          :model="header.model"
          @removeFilter="removeFilter"
          v-if="header.className.includes('filter-container')"
        />
      </th>
      <!--Chỉ hiện thị cột chức năng nếu có ít nhất một cột dữ liệu được hiển thị-->
      <th
        class="align--center table__header-feature"
        style="position: sticky; top: 0; left: 0"
        v-if="headerList.some((item) => item.isShown)"
      >
        {{ $t("words.feature") }}
      </th>
    </tr>
  </thead>
</template>
<script>
import { calculateWidth } from "@/helpers/constants";
import { computed } from "vue";
export default {
  name: "EmployeeTableContentHeader",
  props: {
    isSelectedAll: {
      type: Boolean,
    },
    headerList: {
      type: Array,
    },
  },
  emits: ["updateFilter", "removeFilter", "selectAll", "deselectAll"],

  setup(props, { emit }) {
    const isCheckboxCellShown = computed(() =>
      props.headerList.some((item) => item.isShown)
    );
    const displayedColumns = computed(() =>
      props.headerList.filter((item) => item.isShown)
    );

    //#region Khai báo phương thức

    /**
     * - Feature: Chọn tất cả
     * - Author: Lê Minh Quang (28/06/2023)
     */
    const selectAll = () => {
      if (props.isSelectedAll) {
        emit("deselectAll");
      } else {
        emit("selectAll");
      }
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
    //#endregion
    return {
      isCheckboxCellShown,
      displayedColumns,
      selectAll,
      updateFilter,
      removeFilter,
      calculateWidth,
    };
  },
};
</script>
