<template>
  <div class="filter__button-container">
    <div class="filter__button" @click="showDialog"></div>
  </div>
  <Teleport to="#shower">
    <div
      v-if="isDialogShown"
      v-click-outside="() => (isDialogShown = false)"
      class="filter__dialog"
      :style="{
        top: dialogPos.y + 15 + 'px',
        left: dialogPos.x - 328 + 'px',
      }"
    >
      <div class="filter__dialog-header">{{ $t("words.fixThisColumn") }}</div>
      <div class="filter__dialog-body">
        <div>
          {{ $t("words.filter") }}
          <span>{{ $t(`headers.${model}`) }}</span>
        </div>
        <div
          v-if="model !== 'genderName'"
          class="filter__type-button"
          @click="isTypeListShown = true"
        >
          {{ $t(`operator.${filter.text}`) }}
          <div
            v-if="isTypeListShown"
            @click.stop
            v-click-outside="() => (isTypeListShown = false)"
            class="filter__type-list"
          >
            <div
              v-for="filter in conditionList"
              :key="filter.operator"
              @click="() => changeFilterCondition(filter)"
            >
              {{ $t(`operator.${filter.text}`) }}
            </div>
          </div>
        </div>
      </div>
      <input
        v-if="model !== 'genderName' && !model.toLowerCase().includes('date')"
        class="filter__input"
        :placeholder="$t('words.inputFilterValue')"
        v-model="searchString"
        :disabled="filter.operator == '##' || filter.operator == '!#'"
      />
      <input
        type="date"
        v-if="model.toLowerCase().includes('date')"
        v-model="searchString"
        class="filter__input"
        :disabled="filter.operator == '##' || filter.operator == '!#'"
      />
      <BaseDropDownList
        v-if="model === 'genderName'"
        displayTextField="text"
        trueField="value"
        :defaultList="defaultList"
        :value="dValue"
        @fieldChange="searchString = $event.value"
      />
      <div class="filter__button-group">
        <div @click="removeFilter">
          <BaseButton :text="$t('words.unfilter')" type="secondary" />
        </div>
        <div @click="updateFilter">
          <BaseButton :text="$t('words.filter')" type="primary" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script>
import { ref, computed } from "vue";
import { filterConditions, dateFilterConditions } from "@/helpers/constants";
import { ACCOUNTING_ENUM } from "@/helpers/enums";
import { useI18n } from "vue-i18n";

export default {
  name: "BaseFilterButton",
  props: {
    // Model lọc
    model: {
      type: String,
    },
  },
  emits: ["updateFilter", "removeFilter"],
  setup(props, { emit }) {
    //#region Khai báo biến và state
    const { t } = useI18n();
    // Danh sách điều kiện mặc định cho bộ lọc giới tính
    const defaultList = [
      { text: t("words.male"), value: ACCOUNTING_ENUM.GENDER.MALE },
      { text: t("words.female"), value: ACCOUNTING_ENUM.GENDER.FEMALE },
      { text: t("words.other"), value: ACCOUNTING_ENUM.GENDER.OTHER },
    ];

    // Biến để hiển thị dialog
    const isDialogShown = ref(false);

    // Biến để hiển thị danh sách điều kiện
    const isTypeListShown = ref(false);

    // Giá trị lọc của bộ giới tính (1 - nam, 0 - nữ, 2 - khác)
    const searchString = ref("");
    // Bộ điều kiện lọc (bộ thường và bộ ngày)
    const conditionList = computed(() => {
      return props.model.toLowerCase().includes("date")
        ? dateFilterConditions
        : filterConditions;
    });

    // Điều kiện lọc hiện tại
    const filter = ref(
      props.model === "genderName"
        ? conditionList.value[2]
        : props.model.toLowerCase().includes("date")
        ? conditionList.value[0]
        : conditionList.value[4]
    );

    // Vị trí hiển thị dialog
    const dialogPos = ref({ x: 0, y: 0 });

    // Giá trị để hiển thị (1 - nam, 0 - nữ, 2 - khác)
    const dValue = computed(() =>
      searchString.value === ACCOUNTING_ENUM.GENDER.MALE
        ? t("words.male")
        : searchString.value === ACCOUNTING_ENUM.GENDER.FEMALE
        ? t("words.female")
        : searchString.value === ACCOUNTING_ENUM.GENDER.OTHER
        ? t("words.other")
        : ""
    );

    //#endregion

    /**
     * - Feature: Thay đổi điều kiện lọc
     * - Author: Lê Minh Quang (29/06/2023)
     * @param {{text: string, operator: string}} newFilterCondition
     */
    const changeFilterCondition = (newFilterCondition) => {
      // Tắt hiển thị danh sách chọn điều kiện và gắn điều kiện lọc mới
      isTypeListShown.value = false;
      filter.value = newFilterCondition;
    };

    /**
     * - Feature: Cập nhật điều kiện lọc
     * - Author: Lê Minh Quang (29/06/2023)
     */
    const updateFilter = () => {
      isDialogShown.value = false;
      emit("updateFilter", {
        [props.model === "genderName" ? "gender" : props.model]:
          searchString.value + filter.value.operator,
      });
    };

    /**
     * Feature: Hiển thị dialog
     * Author: Lê Minh Quang (29/06/2023)
     * @param {PointerEvent} e
     */
    const showDialog = (e) => {
      // Gắn vị trí và toggle dialog
      dialogPos.value = { x: e.x, y: e.y };
      isDialogShown.value = !isDialogShown.value;
    };

    /**
     * Feature: Xóa điều kiện lọc
     * Author: Lê Minh Quang (29/06/2023)
     */
    const removeFilter = () => {
      emit(
        "removeFilter",
        props.model === "genderName" ? "gender" : props.model
      );
      isDialogShown.value = false;
    };

    return {
      ACCOUNTING_ENUM,
      searchString,
      isDialogShown,
      isTypeListShown,
      filter,
      conditionList,
      dialogPos,
      defaultList,
      dValue,
      removeFilter,
      changeFilterCondition,
      updateFilter,
      showDialog,
    };
  },
};
</script>
