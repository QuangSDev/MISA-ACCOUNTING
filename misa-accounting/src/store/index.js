import { createStore } from "vuex";

export default createStore({
  state: {
    loading: false,
    isDialogShown: false,
    toasts: [],
  },
  getters: {
    loading: (state) => state.loading,
  },
  mutations: {
    showLoading(state) {
      state.loading = true;
    },
    hideLoading(state) {
      state.loading = false;
    },
    showDialog(state) {
      state.isDialogShown = true;
    },
    hideDialog(state) {
      state.isDialogShown = false;
    },
    pushToast(state, item) {
      state.toasts.unshift(item);
    },
    shiftToast(state) {
      state.toasts.pop();
    },
  },
  actions: {},
  modules: {},
});
