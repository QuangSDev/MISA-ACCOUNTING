/*
feature: Custom select
date: 20/3/2023
author: Lê Minh Quang
*/

$(document).ready(function () {
  const select = $(".select");
  select.each(function () {
    $(this).on("click", function () {
      console.log("haha");
    });
    $(this).on("focus", function () {
      console.log("haha");
    });
    const optionGroup = $(this).find(".select__option-group")[0];
    const displayedItem = $(this).find(".select__displayed-item")[0];
    const options = $(optionGroup).find(".select__options");
    $(this).on("click", function () {
      $(optionGroup).toggle();
    });

    options.each(function () {
      $(this).on("click", function () {
        options.each(function () {
          $(this).removeAttr("selected");
        });
        $(displayedItem).attr("value", this.getAttribute("value"));
        $(displayedItem).text($(this).text());
        $(this).attr("selected", true);
      });
    });
  });
});
