<template>
  <Teleport to="#dialog">
    <BaseDialog
      v-if="isDialogShown"
      :text="errorText"
      :type="dialogType"
      continueText="OK"
      @continueAction="
        () => {
          isDialogShown = false;
          errorText = '';
        }
      "
    />
  </Teleport>

  <Teleport to="#dialog">
    <BaseDialog
      v-if="isCloseDialogShown"
      type="info"
      :text="$t('warningDialog.changeText')"
      :cancelText="$t('words.cancel')"
      :declineText="$t('words.no')"
      :continueText="$t('words.yes')"
      @declineAction="
        () => {
          isCloseDialogShown = false;
          $emit('closeForm');
        }
      "
      @cancelAction="() => (isCloseDialogShown = false)"
      @continueAction="
        () => {
          isCloseDialogShown = false;
          mode === ACCOUNTING_ENUM.MODE.UPDATE
            ? updateEmployeeAndClose()
            : createNewEmployeeAndClose();
        }
      "
    >
    </BaseDialog>
  </Teleport>

  <div class="popup-overlay">
    <div class="popup user-dialog" v-trapFocus>
      <div class="popup-top">
        <EmployeeFormHeader
          @closeForm="closeForm"
          :mode="mode"
          :formInfo="formInfo"
          @updateInfoState="updateInfoState"
        />
        <EmployeeFormBody
          :formInfo="formInfo"
          :isSubmitted="isSubmitted"
          @updateInfoState="updateInfoState($event)"
        />
      </div>
      <EmployeeFormFooter
        :mode="mode"
        @closeForm="closeForm"
        @createNewEmployeeAndContinue="createNewEmployeeAndContinue"
        @createNewEmployeeAndClose="createNewEmployeeAndClose"
        @updateEmployeeAndContinue="updateEmployeeAndContinue"
        @updateEmployeeAndClose="updateEmployeeAndClose"
      />
    </div>
  </div>
</template>
<script>
import EmployeeFormHeader from "./EmployeeFormHeader.vue";
import EmployeeFormBody from "./EmployeeFormBody.vue";
import EmployeeFormFooter from "./EmployeeFormFooter.vue";
import store from "@/store";
import { ref } from "vue";
import {
  createNewEmployee,
  updateEmployee,
  getGeneratedCode,
} from "@/helpers/api";
import { ACCOUNTING_ENUM } from "@/helpers/enums";
import { showToast } from "@/helpers/constants";
import { useI18n } from "vue-i18n";
import { onUnmounted } from "vue";
import { resetTabIndex } from "@/directives";

export default {
  name: "EmployeeForm",
  props: ["isFormOpen", "formDetail", "type"],
  emits: ["closeForm", "addNewEmployee", "refreshTable"],
  components: { EmployeeFormHeader, EmployeeFormBody, EmployeeFormFooter },

  setup(props, { emit }) {
    //#region Khai báo state
    const { t } = useI18n();
    const formInfo = ref(props?.formDetail?.data || {});
    const mode = ref(props?.formDetail?.mode || ACCOUNTING_ENUM.MODE.ADD);
    const isDialogShown = ref(false);
    const isCloseDialogShown = ref(false);
    const errorText = ref("");
    const dialogType = ref("");
    const isSubmitted = ref(false);
    onUnmounted(() => {
      resetTabIndex();
    });
    //#endregion

    //#region Khai báo phương thức
    /**
     * Feature: Đóng form
     * Author: Lê Minh Quang
     * Date: 28/03/2023
     */
    const closeForm = () => {
      // Kiểm tra có thay đổi nếu form hiện tại khác form ban đầu và có ít nhất một trường có giá trị thì hiển thị dialog còn không thì đóng
      if (
        formInfo.value !== props?.formDetail?.data &&
        Object.values(formInfo.value).some((vl) => vl !== null && vl !== "")
      ) {
        isCloseDialogShown.value = true;
      } else {
        emit("closeForm");
      }
    };

    /**
     * Feature: Xác thực các trường khi nhập
     * Author: Lê Minh Quang
     * Date: 27/03/2023
     */

    const validateOnSubmit = () => {
      isSubmitted.value = !isSubmitted.value;
      // Kiểm tra các trường bắt buộc có trống không và các trường ngày cố lớn hơn ngày hiện tại không, nếu có hiển thị dialog
      if (!formInfo.value.employeeCode) {
        errorText.value = t("requiredEmployeeCodeError");
      } else if (!formInfo.value.fullName) {
        errorText.value = t("requiredFullNameError");
      } else if (!formInfo.value.departmentID) {
        errorText.value = t("requiredDepartmentError");
      } else if (
        new Date(formInfo.value.dateOfBirth).getTime() > new Date().getTime() ||
        new Date(formInfo.value.identityDate).getTime() > new Date().getTime()
      ) {
        dialogType.value = "error";
        isDialogShown.value = true;
        errorText.value = t("dateInvalid");
        return false;
      }

      if (
        !formInfo.value.employeeCode ||
        !formInfo.value.fullName ||
        !formInfo.value.departmentID
      ) {
        dialogType.value = "error";
        isDialogShown.value = true;
        return false;
      }

      return true;
    };

    /**
     * Feature: Tạo mới một nhân viên và tiếp tục giữ form để tạo mới nhân viên khác
     * author: Lê Minh Quang
     * date: 27/03/2023
     */

    const createNewEmployeeAndContinue = async () => {
      if (validateOnSubmit()) {
        store.commit("showLoading");
        try {
          // Tạo mới nhân viên
          await createNewEmployee(formInfo.value);
          emit("refreshTable");
          showToast("success", t("successToast.addEmployee"));
          // Lấy mã nhân viên mới
          const newEmployeeCode = await getGeneratedCode();
          formInfo.value = { employeeCode: newEmployeeCode };
          mode.value = ACCOUNTING_ENUM.MODE.ADD;
          resetTabIndex();
        } catch (error) {
          // Hiện dialog nếu có lỗi
          isDialogShown.value = true;
          errorText.value = error.response.data.userMsg;
          dialogType.value = "error";
        }
        store.commit("hideLoading");
      }
    };

    /**
     * Feature: Tạo mới nhân viên và đóng form
     * Author: Lê Minh Quang
     * Date: 27/03/2023
     */

    const createNewEmployeeAndClose = async () => {
      if (validateOnSubmit()) {
        store.commit("showLoading");
        try {
          // Tạo mới nhân viên
          await createNewEmployee(formInfo.value);
          emit("refreshTable");
          emit("closeForm");
          showToast("success", t("successToast.addEmployee"));
        } catch (error) {
          // Hiện dialog nếu có lỗi
          isDialogShown.value = true;
          errorText.value = error.response.data.userMsg;
          dialogType.value = "error";
        }
        store.commit("hideLoading");
      }
    };

    /**
     * Feature: Cập nhật nhân viên và giữ form để thêm mới nhân viên
     * Author: Lê Minh Quang
     * Date: 27/03/2023
     */

    const updateEmployeeAndContinue = async () => {
      if (validateOnSubmit()) {
        store.commit("showLoading");
        try {
          // Cập nhật nhân viên
          await updateEmployee(formInfo.value.employeeID, formInfo.value);
          // Lấy mã nhân viên mới
          const newEmployeeCode = await getGeneratedCode();
          mode.value = ACCOUNTING_ENUM.MODE.ADD;
          emit("refreshTable");
          showToast("success", t("successToast.updateEmployee"));
          formInfo.value = { employeeCode: newEmployeeCode };
          resetTabIndex();
        } catch (error) {
          isDialogShown.value = true;
          errorText.value = error.response.data.userMsg;
          dialogType.value = "error";
        }
        store.commit("hideLoading");
      }
    };

    /**
     * Feature: Cập nhật nhân viên và đóng form
     * Author: Lê Minh Quang
     * Date: 27/03/2023
     */

    const updateEmployeeAndClose = async () => {
      if (validateOnSubmit()) {
        store.commit("showLoading");
        try {
          await updateEmployee(formInfo.value.employeeID, formInfo.value);
          emit("refreshTable");
          showToast("success", t("successToast.updateEmployee"));
          emit("closeForm");
        } catch (error) {
          isDialogShown.value = true;
          errorText.value = error.response.data.userMsg;
          dialogType.value = "error";
        }
        store.commit("hideLoading");
      }
    };

    /**
     *
     * @param {{field: value}} data Object chứa trường và giá trị của nó
     * Feature: Cập nhật state của form
     * Author: Le Minh Quang
     * Date: 27/03/2023
     */

    const updateInfoState = (data) => {
      formInfo.value = { ...formInfo.value, ...data };
    };

    //#endregion

    return {
      formInfo,
      mode,
      isDialogShown,
      isCloseDialogShown,
      errorText,
      isSubmitted,
      ACCOUNTING_ENUM,
      dialogType,
      closeForm,
      validateOnSubmit,
      createNewEmployeeAndContinue,
      createNewEmployeeAndClose,
      updateEmployeeAndContinue,
      updateEmployeeAndClose,
      updateInfoState,
    };
  },
};
</script>
