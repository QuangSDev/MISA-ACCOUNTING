const overlay = document.querySelectorAll(".popup-overlay")[0];
const closeBtn = document.querySelector(
  ".user-dialog__header--right .close-icon"
);
const openBtn = document.querySelectorAll(".main-content__feature .btn")[0];
const dialog = document.querySelector(".dialog-container");
const openDialogBtn = document.querySelectorAll(
  ".popup-footer__btn-group .btn"
)[1];

overlay.addEventListener("click", (e) => {
  if (e.target !== e.currentTarget) return;
  overlay.style.display = "none";
});

closeBtn.addEventListener("click", () => {
  overlay.style.display = "none";
});

openBtn.addEventListener("click", () => {
  overlay.style.display = "block";
});

// openDialogBtn.addEventListener("click", () => {
//   dialog.style.display = "block";
// });
