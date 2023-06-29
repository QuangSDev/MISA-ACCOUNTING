let isShown = false;
const popupBtn = document.querySelectorAll(".popup-btn")[0];
const popup = document.querySelectorAll(".popup-container")[0];
const popupCloseBtn = document.querySelectorAll(".popup-header__icon")[0];
popupBtn.addEventListener("click", showPopup);
popup.addEventListener("click", (e) => {
  if (e.target !== popup) return;
  popup.style.display = "none";
  isShown = false;
});
popupCloseBtn.addEventListener("click", () => {
  popup.style.display = "none";
  isShown = false;
});
function showPopup() {
  if (isShown) {
    popup.style.display = "none";
    isShown = false;
  } else {
    popup.style.display = "block";
    isShown = true;
  }
}
