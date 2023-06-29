const select = document.querySelector(".table__footer .select");
const optionGroup = document.querySelector(
  ".table__footer .select .select__option-group"
);

const optionGroupItems = document.querySelectorAll(
  ".table__footer .select .select__option-group .select__options"
);

const displayedItem = document.querySelector(
  ".table__footer .select .select__displayed-item"
);

let isShown = false;
select.addEventListener("click", () => {
  if (isShown) {
    isShown = false;
    optionGroup.style.display = "none";
  } else {
    optionGroup.style.display = "flex";
    isShown = true;
  }
});

optionGroupItems.forEach((item) => {
  item.addEventListener("click", () => {
    isShown = false;
    optionGroup.style.display = "none";
    displayedItem.innerText = item.innerHTML;
  });
});

document.addEventListener("click", (e) => {
  if (e.target !== optionGroup && !e.target.contains(optionGroup)) {
    isShown = false;
    optionGroup.style.display = "none";
  }
});
