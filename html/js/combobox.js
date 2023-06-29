let tempResults = ["Hải Phòng", "Hà Nội", "Hải Dương"];

const comboboxInp = document.querySelectorAll(".combobox__input")[0];
const comboboxContainer = document.querySelectorAll(".combobox-container")[0];
const optionList = document.querySelectorAll(".option-list-container")[0];
let results;
function searching() {
  return tempResults.filter((item) =>
    item.toLowerCase().includes(comboboxInp.value.toLowerCase())
  );
}

let loadingTimer;
comboboxInp.addEventListener("input", () => {
  optionList.innerHTML = "";
  clearTimeout(loadingTimer);
  results = searching();
  if (comboboxInp.value == "show error") {
    comboboxContainer.classList.add("combobox--error");
  } else {
    comboboxContainer.classList.remove("combobox--error");
  }
  if (!comboboxInp.value) {
    optionList.style.display = "none";
  } else {
    optionList.style.display = "flex";
    optionList.classList.add("option-list--loading");
    const loadingEl = document.createElement("img");
    loadingEl.src = "./assets/icon/refresh.png";
    console.log(results);
    optionList.appendChild(loadingEl);
    loadingTimer = setTimeout(() => {
      optionList.innerHTML = "";
      optionList.classList.remove("option-list--loading");
      optionList.style.display = "block";
      results.forEach((item) => {
        const el = document.createElement("div");
        el.classList.add("option-list__items");
        el.innerHTML = item;
        optionList.appendChild(el);
      });
    }, 1000);
  }
});
