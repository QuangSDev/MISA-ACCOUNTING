<template>
  <div class="user-dialog__body">
    <!--Row 1-->
    <div class="user-dialog__row" style="gap: 20px">
      <div class="user-dialog__column">
        <div class="user-dialog__row">
          <BaseTextField
            :label="$t('form.employeeCode.label')"
            :placeholder="$t('form.employeeCode.placeholder')"
            required="true"
            :value="formInfo?.employeeCode"
            name="employeeCode"
            tabindex="3"
            :firstFocus="true"
            :isSubmitted="isSubmitted"
            @fieldChange="updateInfoState"
          />
          <BaseTextField
            :label="$t('form.fullName.label')"
            :placeholder="$t('form.fullName.placeholder')"
            required="true"
            :value="formInfo?.fullName"
            name="fullName"
            tabindex="4"
            :isSubmitted="isSubmitted"
            @fieldChange="updateInfoState"
          />
        </div>
        <div class="user-dialog__row">
          <BaseDropDownList
            :label="$t('form.departmentName.label')"
            :placeholder="$t('form.departmentName.placeholder')"
            tabindex="5"
            displayTextField="departmentName"
            queryString="Departments"
            trueField="departmentID"
            :value="formInfo?.departmentName"
            :isSubmitted="isSubmitted"
            @fieldChange="updateInfoState"
            required="true"
            :mode="ACCOUNTING_ENUM.DROPDOWN.FORM"
          />
        </div>
        <div class="user-dialog__row">
          <BaseDropDownList
            :label="$t('form.positionName.label')"
            :placeholder="$t('form.positionName.placeholder')"
            tabindex="6"
            displayTextField="positionName"
            trueField="positionID"
            queryString="Positions"
            :value="formInfo?.positionName"
            @fieldChange="updateInfoState"
            :mode="ACCOUNTING_ENUM.DROPDOWN.FORM"
          />
        </div>
      </div>
      <div class="user-dialog__column">
        <div class="user-dialog__row">
          <BaseTextField
            :label="$t('form.dateOfBirth.label')"
            :placeholder="$t('form.dateOfBirth.placeholder')"
            type="date"
            name="dateOfBirth"
            :value="
              formInfo?.dateOfBirth ? formInfo?.dateOfBirth.split('T')[0] : null
            "
            @fieldChange="updateInfoState"
            tabindex="7"
          />
          <BaseTextField
            :label="$t('form.gender.label')"
            type="radio"
            name="gender"
            :radioList="[
              { value: 1, text: 'Nam' },
              { value: 0, text: 'Nữ' },
              { value: 2, text: 'Khác' },
            ]"
            :value="formInfo?.gender"
            @fieldChange="updateInfoState"
            tabindex="8"
          />
        </div>
        <!--##-->
        <div class="user-dialog__row">
          <BaseTextField
            :label="$t('form.identityNumber.label')"
            :placeholder="$t('form.identityNumber.placeholder')"
            :value="formInfo?.identityNumber"
            name="identityNumber"
            regex="[0-9]"
            :tooltipText="$t('form.identityNumber.tooltipText')"
            tabindex="9"
            @fieldChange="updateInfoState"
          />

          <BaseTextField
            :label="$t('form.identityDate.label')"
            :placeholder="$t('form.identityDate.placeholder')"
            name="identityDate"
            :value="
              formInfo?.identityDate
                ? formInfo?.identityDate.split('T')[0]
                : null
            "
            type="date"
            tabindex="10"
            @fieldChange="updateInfoState"
          />
        </div>
        <div class="user-dialog__row">
          <BaseTextField
            :placeholder="$t('form.identityPlace.placeholder')"
            :label="$t('form.identityPlace.placeholder')"
            tabindex="11"
            name="identityPlace"
            :value="formInfo?.identityPlace"
            @fieldChange="updateInfoState"
          />
        </div>
      </div>
    </div>
    <!--##-->
    <div class="user-dialog__row">
      <BaseTextField
        :label="$t('form.address.label')"
        :placeholder="$t('form.address.placeholder')"
        :value="formInfo?.address"
        name="address"
        @fieldChange="updateInfoState"
        tabindex="12"
      />
    </div>
    <!--##-->
    <div class="user-dialog__row custom_row">
      <div class="user-dialog__column">
        <BaseTextField
          :label="$t('form.phoneNumber.label')"
          :placeholder="$t('form.phoneNumber.placeholder')"
          :value="formInfo?.phoneNumber"
          name="phoneNumber"
          regex="[0-9]"
          :tooltipText="$t('form.phoneNumber.tooltipText')"
          @fieldChange="updateInfoState"
          tabindex="13"
        />
        <BaseTextField
          :label="$t('form.landline.label')"
          :placeholder="$t('form.landline.placeholder')"
          :value="formInfo?.landline"
          name="landline"
          regex="[0-9]"
          @fieldChange="updateInfoState"
          :tooltipText="$t('form.landline.tooltipText')"
          tabindex="14"
        />
      </div>
      <div class="user-dialog__column">
        <BaseTextField
          :label="$t('form.email.label')"
          :placeholder="$t('form.email.placeholder')"
          name="email"
          :value="formInfo?.email"
          @fieldChange="updateInfoState"
          tabindex="15"
        />
      </div>
    </div>
    <!--##-->
    <div class="user-dialog__row custom_row">
      <div class="user-dialog__column">
        <BaseTextField
          :label="$t('form.bankAccount.label')"
          :placeholder="$t('form.bankAccount.placeholder')"
          name="bankAccount"
          :value="formInfo?.bankAccount"
          tabindex="16"
        />
        <BaseTextField
          :label="$t('form.bankName.label')"
          :placeholder="$t('form.bankName.placeholder')"
          name="bankName"
          :value="formInfo?.bankName"
          tabindex="17"
        />
      </div>
      <div class="user-dialog__column">
        <BaseTextField
          :label="$t('form.bankBranch.label')"
          :placeholder="$t('form.bankBranch.placeholder')"
          name="bankBranch"
          :value="formInfo?.bankBranch"
          tabindex="18"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { ACCOUNTING_ENUM } from "@/helpers/enums";

export default {
  name: "EmployeeFormBody",
  props: ["formInfo", "isSubmitted"],
  emits: ["updateInfoState"],
  setup(_, { emit }) {
    //#region Khai báo phương thức

    /**
     * Feature: Cập nhật state của form
     * Author: Lê Minh Quang
     * Date: 27/03/2023
     * @param {{field: value}} data Object chứa tên trường và giá trị của nó
     */
    const updateInfoState = (data) => {
      emit("updateInfoState", data);
    };

    //#endregion
    return { ACCOUNTING_ENUM, updateInfoState };
  },
};
</script>
