/*
feature: Chức năng validate form
date: 20/3/2023
author: Lê Minh Quang
*/

$(".popup-overlay").ready(function () {
  const employeeCode = $(".user-dialog__body input[name=employeeCode]")[0];
  const employeeName = $(".user-dialog__body input[name=employeeName]")[0];
  const employeeUnit = $(".user-dialog__body .select__displayed-item")[0];

  $(employeeCode).blur(function () {
    if (!$(employeeCode).val().trim()) {
      $(employeeCode.parentNode).addClass("textfield--error");
      $(employeeCode.parentNode).append(
        `<div class="textfield__msg--error">Cần nhập trường này</div>`
      );
    } else {
      $(employeeCode.parentNode).removeClass("textfield--error");
      $(employeeCode.parentNode).find(".textfield__msg--error").remove();
    }
  });

  $(employeeName).blur(function () {
    if (!$(employeeName).val().trim()) {
      $(employeeName.parentNode).addClass("textfield--error");
      $(employeeName.parentNode).append(
        `<div class="textfield__msg--error">Cần nhập trường này</div>`
      );
    } else {
      $(employeeName.parentNode).removeClass("textfield--error");
      $(employeeName.parentNode).find(".textfield__msg--error").remove();
    }
  });

  $("#saveBtn").on("click", () => {
    //Validate code

    if (!$(employeeCode).val().trim()) {
      $(employeeCode.parentNode).addClass("textfield--error");
      if (!$(employeeCode.parentNode).find(".textfield__msg--error").length) {
        $(employeeCode.parentNode).append(
          `<div class="textfield__msg--error">Cần nhập trường này</div>`
        );
      }
    }

    // Validate name

    if (!$(employeeName).val().trim()) {
      $(employeeName.parentNode).addClass("textfield--error");
      if (!$(employeeName.parentNode).find(".textfield__msg--error").length) {
        $(employeeName.parentNode).append(
          `<div class="textfield__msg--error">Cần nhập trường này</div>`
        );
      }
    }

    //Validate unit
    if (!employeeUnit.getAttribute("value")) {
      $(employeeUnit.parentNode.parentNode).addClass("textfield--error");
      $(employeeUnit.parentNode.parentNode).append(
        `<div class="textfield__msg--error">Cần nhập trường này</div>`
      );
    }
  });

  $(".user-dialog__footer #closeBtn").on("click", () => {
    $(".popup-overlay").css("display", "none");
    $(".textfield__msg--error").each(function () {
      $(this).css("display", "none");
    });
    $(".textfield__input-wrapper").each(function () {
      $(this).removeClass("textfield--error");
    });
  });
});
