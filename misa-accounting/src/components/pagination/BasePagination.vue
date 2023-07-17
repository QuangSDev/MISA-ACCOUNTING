<template>
  <div class="pagination">
    <BaseDropDownList
      :value="defaultList[0].rowsPerPage"
      @fieldChange="changeRowsPerPage($event)"
      :required="true"
      displayTextField="rowsPerPage"
      trueField="value"
      :readonly="true"
      :defaultList="defaultList"
    />
    <div class="pagination__page-list-container">
      <div
        class="pagination__prev-button"
        @click="clickPrevPage()"
        :class="{ disabled: page == 1 }"
      >
        {{ $t("words.previous") }}
      </div>
      <div class="pagination__page-list">
        <div
          class="pagination__page-button"
          :class="{ current: showPage == 1 }"
          @click="() => setPage(1)"
        >
          1
        </div>
        <div
          class="pagination__page-ellipsis"
          v-if="showPage > 2 && testLength > 3"
          @click="
            () => {
              if (testLength < 5) {
                showPage -= 3;
              } else {
                showPage -= 3;
              }
            }
          "
        >
          ...
        </div>
        <div style="display: flex" v-if="testLength > 2">
          <div
            class="pagination__page-button"
            :class="{
              current: page == showPage,
            }"
            @click="setPage(showPage)"
            v-if="showPage > 1 && Math.abs(testLength - showPage > 2)"
          >
            {{ showPage }}
          </div>
          <div
            v-if="
              (showPage + 1 != testLength || testLength - showPage < 2) &&
              testLength > 3 &&
              showPage + 1 != 1
            "
            class="pagination__page-button"
            :class="{
              current: testLength - showPage == 2 || showPage + 1 == page,
            }"
            @click="
              setPage(
                testLength - showPage <= 2 ? testLength - 2 : showPage + 1
              )
            "
          >
            {{ testLength - showPage <= 2 ? testLength - 2 : showPage + 1 }}
          </div>
          <div
            class="pagination__page-button"
            :class="{ current: page == testLength - 1 || showPage + 2 == page }"
            @click="
              setPage(
                showPage + 2 >= testLength ? testLength - 1 : showPage + 2
              )
            "
          >
            {{ showPage + 2 >= testLength ? testLength - 1 : showPage + 2 }}
          </div>
        </div>
        <div
          class="pagination__page-ellipsis"
          v-if="testLength - showPage > 2"
          @click="showPage = showPage + 3"
        >
          ...
        </div>
        <div
          class="pagination__page-button"
          v-if="testLength > 1"
          :class="{ current: page == testLength }"
          @click="() => setPage(testLength)"
        >
          {{ testLength }}
        </div>
      </div>

      <div
        class="pagination__next-button"
        @click="clickNextPage()"
        :class="{ disabled: page == testLength }"
      >
        {{ $t("words.next") }}
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, watch } from "vue";
import { ACCOUNTING_ENUM } from "@/helpers/enums";
import { useI18n } from "vue-i18n";
export default {
  name: "BasePagination",
  props: {
    // Số dòng trên trang
    rowsPerPage: {
      type: Number,
      default: 10,
    },
    // Trang hiện tại
    page: {
      type: Number,
      default: 1,
    },
    // Tổng số trang
    total: {
      type: Number,
    },
  },
  emits: ["setPage", "changeRowsPerPage"],
  setup(props, { emit }) {
    const testLength = ref(Math.ceil(props.total / props.rowsPerPage) || 0);
    const showPage = ref(props.page || 1);
    const { t } = useI18n();
    const defaultList = computed(() => [
      { rowsPerPage: `20 ${t("words.recordPerPage")}`, value: 20 },
      { rowsPerPage: `50 ${t("words.recordPerPage")}`, value: 50 },
      { rowsPerPage: `100 ${t("words.recordPerPage")}`, value: 100 },
    ]);

    watch(
      () => props.total,
      (newVal) => {
        testLength.value = Math.ceil(newVal / props.rowsPerPage);
      }
    );

    watch(
      () => props.page,
      (newVal) => {
        showPage.value = newVal;
      }
    );

    watch(
      () => props.rowsPerPage,
      (newVal) => {
        testLength.value = Math.ceil(props.total / newVal);
      }
    );

    const setPage = (page) => {
      showPage.value = page;
      emit("setPage", page);
    };

    const clickPrevPage = () => {
      if (props.page > 1) {
        setPage(props.page - 1);
        showPage.value = props.page - 1;
      }
    };

    const clickNextPage = () => {
      if (props.page + 1 <= testLength.value) {
        setPage(props.page + 1);
        showPage.value = props.page + 1;
      }
    };

    const changeRowsPerPage = (e) => {
      emit("changeRowsPerPage", e["value"]);
    };

    return {
      showPage,
      defaultList,
      setPage,
      clickPrevPage,
      clickNextPage,
      changeRowsPerPage,
      ACCOUNTING_ENUM,
      testLength,
    };
  },
};
</script>
