<template>
  <div
    :style="style"
    class="textfield"
    :type="type"
    :required="required"
    :error="isValid ? null : true"
  >
    <label
      v-if="label"
      class="textfield__label"
      :class="tooltipText ? 'tooltip-container' : ''"
      v-showTooltip="tooltipText"
      >{{ label }}
    </label>
    <div
      class="textfield__input-wrapper"
      :class="{
        'textfield__input-radio': type == 'radio',
      }"
    >
      <input
        :class="{
          'tooltip-container': tooltipError,
        }"
        v-showTooltip="tooltipError"
        v-model="inpValue"
        v-if="type !== 'date' && type !== 'radio'"
        v-on:blur="validateOnBlur"
        v-on:focus="removeValidate"
        class="textfield__input"
        :placeholder="placeholder"
        :tabindex="tabindex"
        ref="firstFocusRef"
        @keypress="checkRegex($event)"
      />
      <input
        v-model="inpValue"
        v-if="type === 'date'"
        class="textfield__input"
        type="date"
        :tabindex="tabindex"
      />
      <div class="radio-group" v-if="type === 'radio'">
        <div class="radio-items" v-for="item in radioList" :key="item.text">
          <input
            v-model="inpValue"
            :value="item.value"
            type="radio"
            :name="name"
            :tabindex="tabindex"
            :checked="item.value === inpValue"
          />
          <label>{{ item.text }}</label>
        </div>
      </div>
      <!-- <BaseDatePicker v-if="type == 'date'" /> -->
      <div class="textfield__input-icon-container"></div>
    </div>
    <!-- <BaseDatePicker v-if="type == 'date'" :tabindex="tabindex" /> -->
  </div>
</template>
<script>
import { ref, watch, onMounted } from "vue";
export default {
  name: "BaseTextField",
  props: {
    // Label cho textfield
    label: { type: String, default: "" },
    // Placeholder cho textfield
    placeholder: { type: String, default: "" },
    // Kiểu textfield (text, date, radio)
    type: { type: String, default: "" },
    // Name cho input
    name: { type: String, default: "" },
    // Radio list mặc định
    radioList: { type: Array, default: () => [] },
    // Style
    style: { type: String, default: "" },
    // Kiểm tra bắt buộc
    required: { type: Boolean, default: false },
    // Giá trị mặc định
    value: { type: String || Number },
    // Số tabindex
    tabindex: { type: Number, default: 1 },
    // Tooltip text
    tooltipText: { type: String, default: "" },
    // Kiểm tra nhập chưa
    isSubmitted: { type: Boolean, default: false },
    // Regex kiểm tra
    regex: {
      type: String,
      default: "",
    },
    // Kiểm tra xem có focus ngay khi hiển thị
    firstFocus: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    //#region state declarations
    const inpValue = ref(props.value);
    const isValid = ref(true);
    const firstFocusRef = ref();
    const tooltipError = ref("");
    //#endregion
    //#region Khai báo phương thức

    /**
     * Feature: Check regex
     * Author: Lê Minh Quang (25/06/2023)
     * @param {string} e - Chuỗi kiểm tra
     */
    const checkRegex = (e) => {
      if (!new RegExp(props.regex).test(e.key)) {
        e.preventDefault();
      }
    };

    /**
     * Feature: Kiểm tra trường khi blur ra ngoài
     * Author: Lê Minh Quang (25/06/2023)
     */
    const validateOnBlur = () => {
      if (props.required && !inpValue.value) {
        isValid.value = false;
        tooltipError.value = `${props.label} không được để trống`;
      }
    };

    /**
     * Feature: Xóa lỗi khi trường valid
     * Author: Lê Minh Quang (25/06/2023)
     */
    const removeValidate = () => {
      isValid.value = true;
      tooltipError.value = "";
    };
    //#endregion

    /**
     * Feature: Cập nhật giá trị khi trường thay đổi
     * Author: Lê Minh Quang (25/06/2023)
     */
    watch(
      () => inpValue.value,
      (newVal) => {
        emit("fieldChange", { [props.name]: newVal });
      }
    );

    /**
     * Feature: Gắn giá trị mặc định cho trường
     * Author: Lê Minh Quang (25/06/2023)
     */

    watch(
      () => props.value,

      (newVal) => (inpValue.value = newVal)
    );

    /**
     * Feature: Kiểm tra đã nhập form chưa
     * Author: Lê Minh Quang (25/06/2023)
     */
    watch(
      () => props.isSubmitted,
      (newVal) => {
        if (newVal) {
          if (!inpValue.value && props.required) {
            isValid.value = false;
            tooltipError.value = `${props.label} không được để trống`;
          }
        }
      }
    );

    // Focus nếu có là first focus
    onMounted(() => {
      if (props.firstFocus) {
        firstFocusRef.value.focus();
      }
    });

    return {
      inpValue,
      firstFocusRef,
      tooltipError,
      checkRegex,
      validateOnBlur,
      removeValidate,
      isValid,
    };
  },
};
</script>
