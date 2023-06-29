<template>
  <div
    :style="style"
    class="textfield"
    :type="type"
    :required="required ? true : false"
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
      <div v-if="icon" class="textfield__input-icon-container"></div>
    </div>
  </div>
</template>
<script>
import { ref, watch, onMounted } from "vue";
export default {
  name: "BaseTextField",
  props: {
    label: { default: "" },
    placeholder: { default: "" },
    icon: { default: false },
    type: { default: "text" },
    name: { default: "" },
    radioList: { default: [] },
    style: { default: "" },
    required: { default: false },
    value: {},
    tabindex: {},
    tooltipText: {},
    isSubmitted: {},
    regex: {},
    firstFocus: {},
  },
  setup(props, { emit }) {
    //#region state declarations
    const inpValue = ref(props.value);
    const isValid = ref(true);
    const firstFocusRef = ref();
    const tooltipError = ref("");
    //#endregion
    //#region Khai báo phương thức

    const checkRegex = (e) => {
      if (!new RegExp(props.regex).test(e.key)) {
        e.preventDefault();
      }
    };

    const validateOnBlur = () => {
      if (props.required && !inpValue.value) {
        isValid.value = false;
        tooltipError.value = `${props.label} không được để trống`;
      }
    };
    const removeValidate = () => {
      isValid.value = true;
      tooltipError.value = "";
    };
    //#endregion

    watch(
      () => inpValue.value,
      (newVal) => {
        emit("fieldChange", { [props.name]: newVal });
      }
    );

    watch(
      () => props.value,

      (newVal) => (inpValue.value = newVal)
    );

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
