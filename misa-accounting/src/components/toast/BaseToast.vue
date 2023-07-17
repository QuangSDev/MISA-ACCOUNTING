<template>
  <div ref="toastRef" class="toast" :class="`toast--${type}`">
    <div id="toast__icon"></div>
    <div class="toast__content">
      <p class="toast__msg">
        <span class="toast__title"
          >{{
            type == "error"
              ? "Lỗi"
              : type == "success"
              ? "Thành công"
              : type == "info"
              ? "Thông tin"
              : "Cảnh báo"
          }}!</span
        >
        {{ text }}
      </p>
    </div>
  </div>
</template>
<script>
import store from "@/store";

export default {
  name: "BaseToast",
  props: {
    // Text hiển thị cho toast
    text: {
      text: String,
      default: "",
    },
    // Kiểu toast (success, info, error, warn)
    type: {
      type: String,
    },
  },
  mounted() {
    this.$refs.toastRef.classList.add("comein");
    setTimeout(() => {
      store.commit("shiftToast");
    }, 2000);
  },
};
</script>
