<template>
  <div class="datepicker">
    <div class="textfield__input-wrapper datepicker-input-wrapper">
      <div class="datepicker-input">
        <input
          placeholder="DD/MM/YYYY"
          :tabindex="tabindex"
          ref="test"
          @focus="handleFocus"
          @keypress="handleChange"
          @focusout="handleFocusOut"
        />
        <!-- <div v-if="!firstFocus">{{ `${day}/${month}/${year}` }}</div> -->
      </div>
      <div class="datepicker-button" @click="isPickerShown = !isPickerShown">
        <div class="datepicker-icon datepicker-button"></div>
      </div>
    </div>
    <div
      v-if="isPickerShown"
      class="calendar"
      v-click-outside:datepicker-button="() => (isPickerShown = false)"
    >
      <div class="calendar-header">
        <div
          class="calendar-prev-button"
          style="width: 20px"
          @click="changeMonth('prev')"
        >
          &larr;
        </div>
        <div>Tháng {{ currentMonth }} Năm {{ currentYear }}</div>
        <div
          class="calendar-next-button"
          style="width: 20px"
          @click="changeMonth('next')"
        >
          &rarr;
        </div>
      </div>

      <div class="line-break-header"></div>

      <div class="calendar-body-wrapper">
        <table class="calendar-body">
          <thead class="calendar-dotw">
            <tr>
              <th v-for="day in defaultDOW" :key="day">{{ day }}</th>
            </tr>
          </thead>
          <tbody class="calendar-days">
            <tr v-for="i in 7" :key="`i${i}`">
              <template v-for="e in 6">
                <td v-if="i == 1 && e < firstDayOfMonth" :key="`e${e}`"></td>
              </template>
              <template v-for="d in 7" :key="`d${d}`">
                <td
                  @click="selectDate(dayNumber(i, d))"
                  v-if="displayableDay(i, d)"
                  :class="isSelected(i, d) ? 'selected' : ''"
                >
                  {{ dayNumber(i, d) }}
                </td>
              </template>
            </tr>
          </tbody>
        </table>
        <div class="line-break"></div>
      </div>

      <div class="calendar-bottom"><div>Hôm nay</div></div>
    </div>
  </div>
</template>
<script>
import { ref, computed } from "vue";
export default {
  props: {
    // Số tabindex
    tabindex: {
      type: Number,
    },
  },
  setup(_, { emit }) {
    //#region State declaration
    const firstFocus = ref(false);
    const currentYear = ref(new Date().getFullYear());
    const currentMonth = ref(new Date().getMonth() + 1);
    const day = ref(new Date().getDate());
    const month = ref(new Date().getMonth() + 1);
    const year = ref(new Date().getFullYear());
    const isPickerShown = ref(false);
    const defaultDOW = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    const test = ref();
    //#endregion

    const totalDays = computed(() =>
      new Date(currentYear.value, currentMonth.value, 0).getDate()
    );
    const firstDayOfMonth = computed(() =>
      new Date(currentYear.value, currentMonth.value - 1).getDay() == 0
        ? 7
        : new Date(currentYear.value, currentMonth.value - 1).getDay()
    );

    const displayableDay = (row, cell) => {
      return (
        !(row == 1 && cell < firstDayOfMonth.value) &&
        (row - 1) * 7 + cell - (firstDayOfMonth.value - 1) <= totalDays.value
      );
    };

    const dayNumber = (row, cell) => {
      return (row - 1) * 7 + cell - (firstDayOfMonth.value - 1);
    };

    const isSelected = (row, cell) => {
      return (
        day.value == dayNumber(row, cell) &&
        currentMonth.value == month.value &&
        currentYear.value == year.value
      );
    };

    /**
     * Feature: Thay đổi tháng trên datepicker
     * Author: Lê Minh Quang (05/07/2023)
     * @param {string} dir
     */

    const changeMonth = (dir) => {
      if (dir == "next") {
        if (currentMonth.value > 11) {
          currentYear.value += 1;
          currentMonth.value = 1;
        } else {
          currentMonth.value += 1;
        }
      } else {
        if (currentMonth.value < 2) {
          currentYear.value -= 1;
          currentMonth.value = 12;
        } else {
          currentMonth.value -= 1;
        }
      }
    };

    const selectDate = (selectedDay) => {
      day.value = selectedDay;
      month.value = currentMonth.value;
      year.value = currentYear.value;
      isPickerShown.value = false;
      firstFocus.value = false;
      emit("selectDate", `${year.value}-${month.value}-${day.value}`);
    };

    const handleFocus = () => {
      test.value.setSelectionRange(0, 10);
    };

    // const replaceString = (inp, startRange, endRange) => {
    //   return (
    //     "__/__/____".substring(0, startRange) +
    //     inp +
    //     "__/__/____".substring(endRange)
    //   );
    // };

    const handleChange = (e) => {
      if (!firstFocus.value) {
        firstFocus.value = true;
      }

      if (!RegExp(/[0-9]/).test(e.key)) {
        e.preventDefault();
        test.value.setSelectionRange(0, 0);
      } else {
        if (test.value.selectionStart == 0) {
          if (!RegExp(/[0-3]/).test(e.key)) {
            e.preventDefault();
          } else {
            if (Number(e.key) > 3) {
              e.preventDefault();
            } else {
              test.value.setSelectionRange(0, 1);
            }
          }
        }
        if (test.value.selectionStart == 1) {
          test.value.setSelectionRange(1, 2);
        }
        if (test.value.selectionStart == 2) {
          test.value.setSelectionRange(3, 4);
        }
        if (test.value.selectionStart == 4) {
          test.value.setSelectionRange(4, 5);
        }
        if (test.value.selectionStart == 5) {
          test.value.setSelectionRange(6, 7);
        }
        if (test.value.selectionStart == 7) {
          test.value.setSelectionRange(7, 8);
        }
        if (test.value.selectionStart == 8) {
          test.value.setSelectionRange(8, 9);
        }
        if (test.value.selectionStart == 9) {
          test.value.setSelectionRange(9, 10);
        }
        if (test.value.selectionStart > 9) {
          e.preventDefault();
        }
      }
    };

    const handleFocusOut = () => {
      if (!firstFocus.value) {
        firstFocus.value = true;
        test.value.value = "__/__/____";
      }
    };

    return {
      firstFocus,
      firstDayOfMonth,
      totalDays,
      isPickerShown,
      currentMonth,
      currentYear,
      day,
      month,
      year,
      defaultDOW,
      test,
      handleFocus,
      handleFocusOut,
      handleChange,
      isSelected,
      changeMonth,
      displayableDay,
      dayNumber,
      selectDate,
    };
  },
};
</script>
