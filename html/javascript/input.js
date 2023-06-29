const normalInp = document.querySelector(".normal_inp2");
const textFieldWrapper = document.querySelectorAll(
  ".textfield__input-wrapper"
)[0];
const correctTerm = "Super";
const wrongTerm = "Down";
let timer;
normalInp.addEventListener("input", (e) => {
  normalInp.parentElement.classList.remove("textfield--error");
  normalInp.parentElement.classList.remove("textfield--validating");
  clearTimeout(timer);
  normalInp.parentElement.classList.add("textfield--verifying");
  timer = setTimeout(() => {
    normalInp.parentElement.classList.remove("textfield--verifying");
    if (
      normalInp.value &&
      normalInp.value !== wrongTerm &&
      normalInp.value === correctTerm
    ) {
      normalInp.parentElement.classList.add("textfield--validating");
    } else {
      normalInp.parentElement.classList.add("textfield--error");
    }
  }, 1000);
});
