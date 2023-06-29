<template>
  <span id="edit-text" @click="showEmployeeForm">{{ $t("words.modify") }}</span>
  <span @click="showMenu" class="triangle-dropdown"></span>
</template>
<script>
export default {
  name: "EmployeeTableFeatureCellButton",
  props: ["data", "isMenuShown"],
  emits: ["showEmployeeForm", "showMenu", "updateMenu"],
  setup(props, { emit }) {
    //#region Khai báo phương thức

    /**
     * Feature: Hiển thị form
     * Author: Lê Minh Quang
     * Date: 28/03/2023
     */
    const showEmployeeForm = () => {
      emit("showEmployeeForm");
    };

    /**
     * Feature: Hiển thị menu
     * Author: Lê Minh Quang
     * Date: 28/03/2023
     * @param {event} e
     */
    const showMenu = (e) => {
      e.stopPropagation();
      if (props.isMenuShown) {
        emit("showMenu", false);
      } else {
        emit("showMenu", true);
        emit("updateMenu", {
          x: e.x,
          y: e.y,
          data: props.data,
          isLast: !e.target.parentNode.parentNode.nextElementSibling,
        });
      }
    };
    //#endregion
    return { showMenu, showEmployeeForm };
  },
};
</script>
