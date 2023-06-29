<template>
  <div class="dialog-container" :class="type" @click.prevent="closeDialog">
    <div class="dialog-overlay"></div>
    <div class="dialog">
      <div class="dialog-description">
        <div class="dialog-icon"></div>
        {{ text }}
      </div>
      <div
        class="dialog-footer"
        :style="
          !cancelText && !declineText
            ? 'justify-content: center'
            : 'justify-content: space-between'
        "
      >
        <div v-if="cancelText" @click="cancelAction">
          <BaseButton type="secondary" :text="cancelText"></BaseButton>
        </div>
        <div style="display: flex; gap: 10px">
          <div v-if="declineText" @click="declineAction">
            <BaseButton type="secondary" :text="declineText"></BaseButton>
          </div>
          <div v-if="continueText" @click="continueAction">
            <BaseButton type="primary" :text="continueText"></BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "BaseDialog",
  props: ["text", "declineText", "cancelText", "continueText", "type"],
  emits: ["continueAction", "declineAction", "cancelAction"],
  setup(_, { emit }) {
    //#region Khai báo phương thức
    /**
     * Feature: Thực thi hành động khi nhấn tiếp tục
     * Author: Le Minh Quang
     * Date: 29/03/2023
     */
    const continueAction = () => {
      emit("continueAction");
    };

    const declineAction = () => {
      emit("declineAction");
    };

    /**
     * feature: Thực thi hành động khi nhấn hủy
     * author: Le Minh Quang
     * date: 29/03/2023
     */
    const cancelAction = () => {
      emit("cancelAction", false);
    };
    //#endregion
    return { continueAction, declineAction, cancelAction };
  },
};
</script>
