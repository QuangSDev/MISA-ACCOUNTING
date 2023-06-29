<template>
  <div class="import-modal__body--left">
    <div class="file-input-intro">
      <div class="file-input-icon"></div>
      <p class="file-input-title">
        <b>Chọn tệp Excel</b> <span>Dung lượng tối đa 20MB</span>
      </p>
    </div>
    <div class="input-file-box" @dragover.prevent @drop.prevent="drop">
      <div v-if="file" style="color: #0075c0; white-space: nowrap">
        {{ file.name }}
        <span style="color: #757575">({{ file.size / 1024 }}kb)</span>
      </div>
      <p class="input-file-box--hint">Kéo/ thả tệp vào đây hoặc bấm vào đây</p>
      <label for="upload" class="input-file-box__placeholder"></label>
      <input
        id="upload"
        type="file"
        style="display: none"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        @change="uploadFile"
      />
    </div>

    <div class="import-modal__body__input-info">
      <div>
        <label>Sheet chứa dữ liệu</label>
        <input v-model="innerSheetName" />
      </div>
      <div>
        <label>Dòng tiêu đề là dòng số</label>
        <input v-model="innerStartPos" />
      </div>
    </div>
    <div>
      <p class="import-modal__method-intro">Phương thức nhập</p>
      <div class="import-method-container">
        <input
          type="radio"
          name="import-method"
          v-model="innerMode"
          :value="1"
        />
        <label>Thêm mới</label>
      </div>
      <div class="import-method-container">
        <input
          type="radio"
          name="import-method"
          v-model="innerMode"
          :value="2"
        />
        <label>Cập nhật</label>
      </div>
    </div>
  </div>
  <div class="import-modal__body--right">
    <div class="import-modal__hint-intro">
      <div class="hint-icon"></div>
      <p>Gợi ý</p>
    </div>
    <ul>
      <li>Tải tệp mẫu cơ bản để nhập những thông tin cơ bản.</li>
      <li>Tải tệp mẫu đầy đủ để nhập tất cả các thông tin.</li>
      <li>
        Các thiết lập trong quá trình nhập sẽ được lưu để sử dụng trong các lần
        tiếp sau.
      </li>
      <li>
        Thêm mới: Dữ liệu trên tệp mà chưa có trong hệ thống sẽ được thêm mới
        vào. Dữ liệu mà đã có trên hệ thống sẽ không được cập nhật vào.
      </li>
      <li>
        Cập nhật: Dữ liệu trên tệp mà chưa có trong hệ thống sẽ được thêm mới
        vào. Dữ liệu mà đã có trên hệ thống sẽ được cập nhật vào.
      </li>
    </ul>
  </div>
</template>
<script>
import { ref, watch } from "vue";

export default {
  name: "EmployeeImportSelectFileStep",
  props: ["file", "sheetName", "startPos", "mode"],
  emits: ["dropFile", "changeMode", "uploadFile"],
  setup(props, { emit }) {
    //#region Khai báo state
    const innerSheetName = ref(props.sheetName || "");
    const innerStartPos = ref(props.startPos || 1);
    const innerMode = ref(props.mode);
    const drop = (e) => {
      emit("dropFile", e.dataTransfer.files[0]);
    };
    //#endregion

    //#region Khai báo phương thức
    /**
     * Feature: Upload file
     * @param {*} e
     * Author: Lê Minh Quang
     * Date: 29/04/2023
     */
    const uploadFile = (e) => {
      emit("uploadFile", e.target.files[0]);
    };
    //#endregion
    watch(
      () => innerMode.value,
      (newVal) => {
        emit("changeMode", newVal);
      }
    );

    watch(
      () => props.sheetName,
      (newVal) => {
        innerSheetName.value = newVal;
      }
    );
    watch(
      () => props.startPos,
      (newVal) => {
        innerStartPos.value = newVal;
      }
    );
    return { innerSheetName, innerStartPos, innerMode, drop, uploadFile };
  },
};
</script>
