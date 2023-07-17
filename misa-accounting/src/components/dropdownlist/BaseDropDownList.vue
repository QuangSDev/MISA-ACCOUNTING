<template>
  <div
    class="dropdownlist textfield"
    :required="required"
    :error="isValid ? null : true"
  >
    <label v-if="label" class="textfield__label">{{ label }}</label>
    <div
      class="textfield__input-wrapper"
      @click="focusInput($event)"
      :class="{ 'tooltip-container': tooltipError }"
      v-showTooltip="tooltipError"
    >
      <input
        class="textfield__input"
        ref="inpFocus"
        :value="selectedValue"
        :placeholder="placeholder"
        :readonly="readonly || null"
        :tabindex="tabindex"
        @blur="validateOnBlur"
        @input="showMenuOnInput($event)"
        @keydown="showMenuOnKeyPress($event)"
        v-focusOutDropDown="() => (isMenuDisplayed = false)"
      />
    </div>
    <div
      v-if="isMenuDisplayed"
      class="dropdown-menu-wrapper"
      v-click-outside:textfield__input-wrapper="() => (isMenuDisplayed = false)"
      v-handleDropdownMenu="{
        fn: handleDropdownMenu,
        selectedValue,
        list,
        name: displayTextField,
        selectOption,
        hoverItem,
      }"
    >
      <div class="dropdown-menu">
        <div
          v-for="item in list"
          class="dropdown-items"
          :key="item[displayTextField]"
          :value="item[displayTextField]"
          :class="{
            'dropdown-items--selected':
              item[displayTextField] === selectedValue,
            'dropdown-items--hovering':
              hoverItem?.[displayTextField] === item[displayTextField],
          }"
          @click="() => selectOption(item)"
        >
          {{ item[displayTextField] }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, watch, onMounted } from "vue";
import { baseUrl } from "@/helpers/constants";
import axios from "axios";
import { ACCOUNTING_ENUM } from "@/helpers/enums";
import { useI18n } from "vue-i18n";

export default {
  name: "BaseDropDownList",
  props: {
    // Label của dropdownlist
    label: {
      type: String,
      default: "",
    },
    // Placeholder của dropdownlist
    placeholder: {
      type: String,
      default: "",
    },
    // Số tabindex của dropdownlist
    tabindex: {
      type: Number,
      default: 1,
    },
    // Trường dùng để hiển thị text
    displayTextField: {
      type: String,
    },
    // Trường dùng để thay đổi đổi giá trị thật
    trueField: {
      type: String,
    },
    // Giá trị ban đầu
    value: {
      type: String || Number,
    },
    // Kiểm tra đã nhập hay chưa
    isSubmitted: {
      type: Boolean,
      default: false,
    },
    // Kiểm tra có bắt buộc không
    required: {
      type: Boolean,
      default: false,
    },
    // string dùng để lấy dữ liệu về hiển thị
    queryString: {
      type: String,
      default: "",
    },
    // array mặc định nếu có
    defaultList: {
      type: Array,
      default: () => [],
    },
    // kiểm tra chỉ được dùng để đọc
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["fieldChange"],

  setup(props, { emit }) {
    //#region Khai báo biến và state

    const { t } = useI18n();
    // Giá trị được chọn
    const selectedValue = ref(props.value ? props.value : "");
    // Hiển thị dropdown
    const isMenuDisplayed = ref(false);
    // Danh sách giá trị dropdown
    const list = ref([]);
    // Kiểm tra giá trị nhập có hợp lệ
    const isValid = ref(true);
    // Text cho tooltip lỗi
    const tooltipError = ref("");
    // Item được hover
    const hoverItem = ref(null);
    // Template ref để truy cập dom
    const inpFocus = ref();

    //#endregion

    // Gán lại selectedValue nếu value truyền từ bên ngoài thay đổi
    watch(
      () => props.value,
      (newvl) => (selectedValue.value = newvl || "")
    );

    // Nếu selectedValue thay đổi, tìm trong list item đầu tiên có chứa selectedValue và hover
    watch(
      () => selectedValue.value,
      (newVal) => {
        if (newVal) {
          hoverItem.value = list.value.filter((item) =>
            item[props.displayTextField]
              .toLowerCase()
              .includes(newVal.toLowerCase())
          )[0];
        }
      }
    );

    // Nếu form được submit, validate dropdown và hiển thị lỗi ở tooltip nếu có
    watch(
      () => props.isSubmitted,
      () => {
        if (props.required && !selectedValue.value) {
          isValid.value = false;
          tooltipError.value = t("validate.required", { label: props.label });
        }
      }
    );

    //#region Khai báo phương thức
    /**
     * Feature: Validate các trường khi blur ra ngoài
     * Author: Lê Minh Quang (29/06/2023)
     */
    const validateOnBlur = () => {
      if (props.required && !selectedValue.value) {
        isValid.value = false;
        tooltipError.value = tooltipError.value = t("validate.required", {
          label: props.label,
        });
      }
    };

    /**
     * Feature: Focus khi tab vào
     * Author: Lê Minh Quang (29/06/2023)
     */
    const focusInput = async () => {
      inpFocus.value.focus();
      isValid.value = true;
      tooltipError.value = "";
      isMenuDisplayed.value = !isMenuDisplayed.value;
    };

    /**
     * Feature: Xử lý khi chọn một lựa chọn trong dropdown
     * @param {*} value
     * Author: Lê Minh Quang (29/06/2023)
     */
    const selectOption = (value) => {
      selectedValue.value = value[props.displayTextField];
      isMenuDisplayed.value = false;
      isValid.value = true;
      tooltipError.value = "";
      emit("fieldChange", {
        [props.displayTextField]: selectedValue.value,
        [props.trueField]: value[props.trueField],
      });
    };

    /**
     * Feature: Lấy danh sách lựa chọn
     * Author: Le Minh Quang (29/06/2023)
     */
    const getListData = async () => {
      // Nếu có query string thì lấy dữ liệu còn không thì lấy từ danh sách mặc định được truyền vào
      if (props.queryString) {
        const res = await axios.get(`${baseUrl}/${props.queryString}`);
        list.value = res.data;
      } else {
        list.value = props.defaultList;
      }
    };

    /**
     * Feature: Hiện dropdown khi nhập
     * @param {*} e
     * Author: Lê Minh Quang (29/06/2023)
     */
    const showMenuOnInput = (e) => {
      isMenuDisplayed.value = true;
      selectedValue.value = e.target.value;
    };

    /**
     * Feature: Hiện dropdown khi nhấn nút xuống
     * @param {*} e
     * Author: Lê Minh Quang (29/06/2023)
     */
    const showMenuOnKeyPress = async (e) => {
      if (e.key == "ArrowDown") {
        isMenuDisplayed.value = true;
      }
    };

    /**
     * Feature: Gán giá trị cho item đang được hover
     * @param {*} newVal
     */
    const handleDropdownMenu = (newVal) => {
      hoverItem.value = newVal;
    };

    //#region Khai báo lifecycle

    // Lấy danh sách lựa chọn khi mounted
    onMounted(async () => {
      await getListData();
    });

    //#endregion

    return {
      selectedValue,
      isMenuDisplayed,
      isValid,
      inpFocus,
      hoverItem,
      list,
      ACCOUNTING_ENUM,
      tooltipError,
      showMenuOnInput,
      showMenuOnKeyPress,
      handleDropdownMenu,
      selectOption,
      validateOnBlur,
      getListData,
      focusInput,
    };
  },
};
</script>
