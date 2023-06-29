let isDialogShown = false;
const dialogBtn = document.querySelectorAll(".btn-dialog")[0];
const dialog = document.querySelectorAll(".dialog-container")[0];
const closeBtn = document.querySelectorAll(".dialog-header__icon--close")[0];
dialogBtn.addEventListener("click", showDialog);
closeBtn.addEventListener("click", (e) => {
  dialog.style.display = "none";
  isDialogShown = false;
});
dialog.addEventListener("click", (e) => {
  if (e.target !== dialog) return;
  dialog.style.display = "none";
  isDialogShown = false;
});
function showDialog() {
  if (isDialogShown) {
    dialog.style.display = "none";
    isDialogShown = false;
  } else {
    dialog.style.display = "block";
    isDialogShown = true;
  }
}
