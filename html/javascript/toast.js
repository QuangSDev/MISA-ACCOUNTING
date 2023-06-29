const toastSuccessBtn = document.querySelector("#btn-toast--sucess");
const toastInfoBtn = document.querySelector("#btn-toast--info");
const toastWarningBtn = document.querySelector("#btn-toast--warning");
const toastErrorBtn = document.querySelector("#btn-toast--error");
const toastSuccess = document.querySelectorAll(".toast--success")[0];
const toastInfo = document.querySelectorAll(".toast--info")[0];
const toastWarning = document.querySelectorAll(".toast--warn")[0];
const toastError = document.querySelectorAll(".toast--error")[0];

toastSuccessBtn.addEventListener("click", () => {
  toastSuccess.classList.add("comein");
});

toastInfoBtn.addEventListener("click", () => {
  toastInfo.classList.add("comein");
});

toastWarningBtn.addEventListener("click", () => {
  toastWarning.classList.add("comein");
});

toastErrorBtn.addEventListener("click", () => {
  toastError.classList.add("comein");
});
