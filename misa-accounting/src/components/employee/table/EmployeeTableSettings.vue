<template>
  <div class="popup-overlay">
    <div class="table__settings">
      <div class="table__settings--header">
        <p>{{ $t("words.modifyDisplaySettings") }}</p>
        <div class="user-dialog__header--right">
          <div
            class="info-icon tooltip-container"
            v-showTooltip:left="`${$t('words.help')} (F1)`"
          ></div>
          <div
            class="close-icon tooltip-container"
            v-showTooltip:left="`${$t('words.close')} (ESC)`"
            v-actionOnKeyPress="{ fn: closeSettings, isCtrl: false, key: 27 }"
            @click="closeSettings"
          ></div>
        </div>
      </div>
      <div class="table__settings--body">
        <div class="table__settings-feature--row">
          <div class="table__settings-input-wrapper">
            <input
              class="table__settings-input"
              :placeholder="$t('words.inputSearchTerm')"
            />
            <div class="table__settings-input-icon"></div>
          </div>
          <p @click="isDetailShown = true" class="table__settings-modify-btn">
            {{ $t("words.changeHeaderNameAndWidth") }}
          </p>
        </div>
        <div class="table__settings-table-container">
          <table class="table-content">
            <thead>
              <tr>
                <th style="width: 32px; padding: 0 10px"></th>
                <th class="table__settings-checbox-header">
                  <div
                    @click="clickAll"
                    class="table__custom-checkbox"
                    :class="
                      headerList.every((item) => item.isShown)
                        ? 'activated'
                        : ''
                    "
                  >
                    <div
                      v-if="headerList.every((item) => item.isShown)"
                      class="checkmark"
                    ></div>
                  </div>
                </th>
                <th class="align--left">{{ $t("words.headerName") }}</th>
                <th v-if="isDetailShown" class="align--left">
                  {{ $t("words.headerNameOnInterface") }}
                </th>
                <th v-if="isDetailShown" class="align--left">
                  {{ $t("words.width") }}
                </th>
                <th v-if="isDetailShown" class="align--center">
                  {{ $t("words.fixColumn") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(header, index) in headerList"
                :key="header.model"
                @dragover.prevent
                @dragenter.prevent
              >
                <td class="align--center" style="padding: 0 10px">
                  <div
                    style="cursor: pointer"
                    class="draggable-icon"
                    @dragstart="customDragImage"
                    @drag.prevent="dragItem($event, index)"
                    :draggable="true"
                  ></div>
                </td>
                <td class="align--center">
                  <div
                    class="table__custom-checkbox"
                    :class="
                      headerList.some(
                        (item) =>
                          item.model == header.model && item.isShown == true
                      )
                        ? 'activated'
                        : ''
                    "
                    @click="
                      () =>
                        changeDisplayHeader(
                          header.model,
                          'isShown',
                          !headerList[
                            headerList.findIndex(
                              (item) => header.model == item.model
                            )
                          ].isShown
                        )
                    "
                  >
                    <div
                      v-if="
                        headerList.some(
                          (item) =>
                            item.model == header.model && item.isShown == true
                        )
                      "
                      class="checkmark"
                    ></div>
                  </div>
                </td>
                <td class="align--left">
                  {{ $t(`headers.${header.model}`) }}
                </td>

                <!--Displaying name cells-->

                <td
                  v-if="isDetailShown"
                  class="align--left"
                  @click="makeEditable"
                >
                  <span>{{
                    headerList[
                      headerList.findIndex((item) => item.model == header.model)
                    ].headerName
                  }}</span>
                  <div class="textarea-container">
                    <textarea
                      v-model="
                        headerList[
                          headerList.findIndex(
                            (item) => item.model == header.model
                          )
                        ].headerName
                      "
                    ></textarea>
                  </div>
                </td>

                <!--Width cells-->

                <td
                  v-if="isDetailShown"
                  class="align--left"
                  @click="makeEditable($event)"
                >
                  <span>{{
                    headerList[
                      headerList.findIndex((item) => item.model == header.model)
                    ].width
                  }}</span>
                  <div class="textarea-container">
                    <textarea
                      v-model="
                        headerList[
                          headerList.findIndex(
                            (item) => item.model == header.model
                          )
                        ].width
                      "
                    ></textarea>
                  </div>
                </td>

                <!--Fix cells-->

                <td class="align--center" v-if="isDetailShown">
                  <input
                    type="checkbox"
                    :checked="
                      headerList.some(
                        (item) => item.model == header.model && item.sticky
                      )
                    "
                    @change="
                      changeDisplayHeader(
                        header.model,
                        'sticky',
                        !headerList[
                          headerList.findIndex(
                            (item) => header.model == item.model
                          )
                        ].sticky
                      )
                    "
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="table__settings-divider"></div>
      <div class="table__settings--footer">
        <div @click="closeSettings">
          <BaseButton type="secondary" :text="$t('words.cancel')" />
        </div>
        <div class="table__settings-btn-group--right">
          <div @click="setDefaultSettings" class="setting-default-btn">
            <BaseButton
              type="secondary"
              :text="$t('words.getDefaultTemplate')"
            />
          </div>
          <div @click="updateDisplaySetting">
            <BaseButton type="primary" :text="$t('words.store')" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { onBeforeMount, ref } from "vue";
import { TABLE_HEADERS } from "@/helpers/constants";

export default {
  name: "EmployeeTableSettings",
  emits: ["updateDisplaySetting", "closeSettings"],
  setup(_, { emit }) {
    //#region Khai báo state
    const headerList = ref();

    onBeforeMount(() => {
      headerList.value = localStorage.getItem("displaySettings")
        ? JSON.parse(localStorage.getItem("displaySettings"))
        : JSON.parse(JSON.stringify(TABLE_HEADERS));
    });

    const isDetailShown = ref(false);
    //#endregion

    //#region Khai báo phương thức
    /**
     * Feature: Thay đổi thuộc tính cột
     * @param {*} model : model
     * @param {*} prop : thuộc tính
     * @param {*} value : giá trị
     * Author: Lê Minh Quang
     * Date: 26/04/2023
     */
    const changeDisplayHeader = (model, prop, value) => {
      headerList.value[
        headerList.value.findIndex((item) => item.model == model)
      ][prop] = value;
    };

    /**
     * Feature: Cập nhật cài đặt hiển thị
     * Author: Lê Minh Quang
     * Date: 26/04/2023
     */
    const updateDisplaySetting = () => {
      // Thay danh sách cột lên localstorage, và update danh sách cột mới này
      localStorage.setItem("displaySettings", JSON.stringify(headerList.value));
      emit("updateDisplaySetting", headerList.value);
    };

    /**
     * Feature: Đóng modal điều chỉnh giao diện
     * Author: Lê Minh Quang
     * Date: 26/04/2023
     */
    const closeSettings = () => {
      emit("closeSettings");
    };

    /**
     * Feature: Lấy mẫu ngầm định
     * Author: Lê Minh Quang
     * Date: 26/04/2023
     */
    const setDefaultSettings = () => {
      headerList.value = TABLE_HEADERS;
      localStorage.setItem("displaySettings", JSON.stringify(headerList.value));
    };

    /**
     * Feature: Khiến các ô input có thể nhập được
     * @param {*} e
     * Author: Lê Minh Quang
     * Date: 26/04/2023
     */
    const makeEditable = (e) => {
      if (![...e.currentTarget.classList].includes("editable")) {
        if (
          e.target !== e.currentTarget &&
          e.currentTarget.contains(e.target)
        ) {
          e.currentTarget.classList.add("editable");
        } else if (e.target === e.currentTarget) {
          e.target.classList.add("editable");
        }
      }
    };

    /**
     * Feature: Chọn tất cả học bỏ chọn tất ô hiển thị
     * Author: Lê Minh Quang
     * Date: 28/04/2023
     */
    const clickAll = () => {
      if (headerList.value.every((item) => item.isShown)) {
        headerList.value = headerList.value.map((item) => ({
          ...item,
          isShown: false,
        }));
      } else {
        headerList.value = headerList.value.map((item) => ({
          ...item,
          isShown: true,
        }));
      }
    };

    /**
     * Feature: Customer drag image khi kéo
     * Author: Lê Minh Quang
     * Date: 08/05/2023
     * @param {event} event
     */

    const customDragImage = (event) => {
      event.dataTransfer.setDragImage(
        event.target.parentElement.parentElement,
        0,
        0
      );
    };

    /**
     * Feature: Kéo phần tử
     * Author: Lê Minh Quang
     * Date: 08/05/2023
     * @param {event} event
     * @param {number} index
     */
    const dragItem = (event, index) => {
      if (
        event.target.parentElement.parentElement?.nextElementSibling &&
        event.clientY >=
          event.target.parentElement.parentElement.nextElementSibling.getBoundingClientRect()
            .top -
            event.target.parentElement.parentElement.nextElementSibling
              .offsetHeight /
              4
      ) {
        [headerList.value[index], headerList.value[index + 1]] = [
          headerList.value[index + 1],
          headerList.value[index],
        ];
      }
      if (
        event.target.parentElement.parentElement?.previousElementSibling &&
        event.clientY != 0 &&
        event.clientY <=
          event.target.parentElement.parentElement.previousElementSibling.getBoundingClientRect()
            .top +
            +event.target.parentElement.parentElement.previousElementSibling
              .offsetHeight
      ) {
        [headerList.value[index], headerList.value[index - 1]] = [
          headerList.value[index - 1],
          headerList.value[index],
        ];
      }
    };
    //#endregion

    return {
      headerList,
      TABLE_HEADERS,
      isDetailShown,
      customDragImage,
      dragItem,
      clickAll,
      makeEditable,
      changeDisplayHeader,
      updateDisplaySetting,
      closeSettings,
      setDefaultSettings,
    };
  },
};
</script>
