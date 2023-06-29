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
        top: dialogPos.y + 17 + 'px',
        left: dialogPos.x + 14 + 'px',
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
        :mode="1"
        :defaultList="[
          { text: $t('words.male'), value: 1 },
          { text: $t('words.female'), value: 0 },
          { text: $t('words.other'), value: 2 },
        ]"
        :value="
          searchString === 1
            ? $t('words.male')
            : searchString === 0
            ? $t('words.female')
            : searchString === 3
            ? $t('words.other')
            : ''
        "
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

export default {
  name: "BaseFilterButton",
  props: ["filters", "model"],
  emits: ["updateFilter", "removeFilter"],
  setup(props, { emit }) {
    const isDialogShown = ref(false);
    const isTypeListShown = ref(false);
    const searchString = ref("");
    const conditionList = computed(() => {
      return props.model.toLowerCase().includes("date")
        ? dateFilterConditions
        : filterConditions;
    });
    const filter = ref(
      props.model === "genderName"
        ? conditionList.value[2]
        : props.model.toLowerCase().includes("date")
        ? conditionList.value[0]
        : conditionList.value[4]
    );

    const dialogPos = ref({ x: 0, y: 0 });

    /**
     * Feature: Thay đổi điều kiện lọc
     * @param {*} newFilter
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */
    const changeFilterCondition = (newFilter) => {
      isTypeListShown.value = false;
      filter.value = newFilter;
    };

    /**
     * Feature: Cập nhật lọc
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */
    const updateFilter = () => {
      isDialogShown.value = false;
      emit("updateFilter", {
        [props.model === "genderName" ? "gender" : props.model]:
          searchString.value + filter.value.operator,
      });
    };
    const showDialog = (e) => {
      dialogPos.value = { x: e.x, y: e.y };
      isDialogShown.value = !isDialogShown.value;
    };

    /**
     * Feature: Xóa điều kiện lọc
     * Author: Lê Minh Quang
     * Date: 29/03/2023
     */
    const removeFilter = () => {
      emit(
        "removeFilter",
        props.model === "genderName" ? "gender" : props.model
      );
      isDialogShown.value = false;
    };

    return {
      searchString,
      isDialogShown,
      isTypeListShown,
      filter,
      conditionList,
      dialogPos,
      removeFilter,
      changeFilterCondition,
      updateFilter,
      showDialog,
    };
  },
};
</script>
