const tempData = [
  {
    EmployeeCode: "NV-01",
    FullName: "Lê Minh Quang",
    GenderName: "Nam",
    DateOfBirth: "06/06/2002",
    IdentityNumber: "115",
    PositionName: "Employee",
    DepartmentName: "Marketing",
    PhoneNumber: "113",
  },
  {
    EmployeeCode: "NV-01",
    FullName: "Lê Minh Quang",
    GenderName: "Nam",
    DateOfBirth: "06/06/2002",
    IdentityNumber: "115",
    PositionName: "Employee",
    DepartmentName: "Marketing",
    PhoneNumber: "113",
  },
  {
    EmployeeCode: "NV-01",
    FullName: "Lê Minh Quang",
    GenderName: "Nam",
    DateOfBirth: "06/06/2002",
    IdentityNumber: "115",
    PositionName: "Employee",
    DepartmentName: "Marketing",
    PhoneNumber: "113",
  },
  {
    EmployeeCode: "NV-01",
    FullName: "Lê Minh Quang",
    GenderName: "Nam",
    DateOfBirth: "06/06/2002",
    IdentityNumber: "115",
    PositionName: "Employee",
    DepartmentName: "Marketing",
    PhoneNumber: "113",
  },
  {
    EmployeeCode: "NV-01",
    FullName: "Lê Minh Quang",
    GenderName: "Nam",
    DateOfBirth: "06/06/2002",
    IdentityNumber: "115",
    PositionName: "Employee",
    DepartmentName: "Marketing",
    PhoneNumber: "113",
  },
  {
    EmployeeCode: "NV-01",
    FullName: "Lê Minh Quang",
    GenderName: "Nam",
    DateOfBirth: "06/06/2002",
    IdentityNumber: "115",
    PositionName: "Employee",
    DepartmentName: "Marketing",
    PhoneNumber: "113",
  },
  {
    EmployeeCode: "NV-01",
    FullName: "Lê Minh Quang",
    GenderName: "Nam",
    DateOfBirth: "06/06/2002",
    IdentityNumber: "115",
    PositionName: "Employee",
    DepartmentName: "Marketing",
    PhoneNumber: "113",
  },
  {
    EmployeeCode: "NV-01",
    FullName: "Lê Minh Quang",
    GenderName: "Nam",
    DateOfBirth: "06/06/2002",
    IdentityNumber: "115",
    PositionName: "Employee",
    DepartmentName: "Marketing",
    PhoneNumber: "113",
  },
  {
    EmployeeCode: "NV-01",
    FullName: "Lê Minh Quang",
    GenderName: "Nam",
    DateOfBirth: "06/06/2002",
    IdentityNumber: "115",
    PositionName: "Employee",
    DepartmentName: "Marketing",
    PhoneNumber: "113",
  },
  {
    EmployeeCode: "NV-01",
    FullName: "Lê Minh Quang",
    GenderName: "Nam",
    DateOfBirth: "06/06/2002",
    IdentityNumber: "115",
    PositionName: "Employee",
    DepartmentName: "Marketing",
    PhoneNumber: "113",
  },
  {
    EmployeeCode: "NV-01",
    FullName: "Lê Minh Quang",
    GenderName: "Nam",
    DateOfBirth: "06/06/2002",
    IdentityNumber: "115",
    PositionName: "Employee",
    DepartmentName: "Marketing",
    PhoneNumber: "113",
  },
];

function createCell(text, format) {
  let className = "";
  switch (format) {
    case "date":
      className = "align--center";
      text = text
        ? `${new Date(text).getDay()}/${new Date(text).getMonth()}/${new Date(
            text
          ).getFullYear()}`
        : "Trống";
      break;
    case "money":
      className = "align--right";
      break;
    case "checkbox":
      className = "align--center";
      break;
    default:
      className = "align--left";
      break;
  }

  let cell = document.createElement("td");
  cell.classList.add(className);
  if (format != "checkbox") {
    if (text) {
      cell.innerHTML = text;
    }
  } else {
    cell.innerHTML = '<input type="checkbox" id="table__header-checkbox" />';
  }
  return cell;
}

$(document).ready(async function () {
  $(".loading__layout").css("display", "block");

  // await $.ajax({
  //   type: "GET",
  //   url: "https://apidemo.laptrinhweb.edu.vn/api/v1/Employees",
  //   success: function (response) {
  //     $(".loading__layout").css("display", "none");
  //     $("#record__number").html(`${response.length} records`);

  //     response.forEach((item) => {
  //       let row = document.createElement("tr");
  //       $(".table__header th").each(function () {
  //         const model = this.getAttribute("head-model");
  //         const value = item[model];
  //         if (model === "DateOfBirth") {
  //           row.append(createCell(value, "date"));
  //         } else {
  //           row.append(createCell(value));
  //         }
  //       });
  //       $(".table tbody").append(row);

  //       // $(".table tbody").append(
  //       //   `<tr>
  //       //     ${createCell(`<input type="checkbox" />`, "align--center")}
  //       //     ${createCell(item.EmployeeCode)}
  //       //     ${createCell(item.FullName)}
  //       //     ${createCell(item.GenderName)}
  //       //     ${createCell(
  //       //
  //       //         : "Trống",
  //       //       "align--center"
  //       //     )}
  //       //     ${createCell(item.IdentityNumber)}
  //       //     ${createCell(item.PositionName)}
  //       //     ${createCell(item.DepartmentName)}
  //       //     ${createCell(item.PhoneNumber)}
  //       //     ${createCell(item.IdentityPlace)}

  //       //   </tr>`
  //       // );
  //     });
  //   },
  //   timeout: function () {
  //     $(".loading__layout").css("display", "none");
  //   },
  //   error: function () {
  //     $(".loading__layout").css("display", "none");
  //   },
  // });

  tempData.forEach((item) => {
    let row = document.createElement("tr");
    row.append(createCell("", "checkbox"));
    $(".table__header th").each(function () {
      const model = this.getAttribute("head-model");
      if (model) {
        const value = item[model];
        if (model === "DateOfBirth") {
          row.append(createCell(value, "date"));
        } else {
          row.append(createCell(value));
        }
      }
    });

    $(".table tbody").append(row);
  });

  const headCheckBox = $(".table__header input[type=checkbox]")[0];

  const bodyRows = $(".table tbody tr");
  const tableSearch = $(
    "#table__feature-container .input--normal.input-search"
  )[0];

  const totalCheckedEl = $(".table__checkbox-feature")[0];

  const modifyBtns = $(".table__feature-btn");

  modifyBtns.each(function () {
    $(this).on("click", function () {
      $(this.parentNode).find(".table__menu-feature-cell").toggle();
    });
  });

  $(headCheckBox).on("click", () => {
    if ($(headCheckBox).is(":checked")) {
      bodyRows.each(function () {
        $(this).find("input[type=checkbox]").prop("checked", true);
        $(this).css("background-color", "#EDF8EB");
      });
      $(tableSearch).css("display", "none");
      $(totalCheckedEl).css("display", "flex");
      $(totalCheckedEl).html(
        `<div>Đã chọn ${bodyRows.length}</div><div style="color: #FF3939;">Bỏ chọn</div><div style="color:blue;">Chọn tất cả các trang<div>`
      );
    } else {
      $(tableSearch).css("display", "block");
      $(totalCheckedEl).css("display", "none");
      bodyRows.each(function () {
        $(this).find("input[type=checkbox]").prop("checked", false);
        $(this).css("background-color", "white");
      });
    }
  });

  bodyRows.each(function () {
    const currentEl = $(this);
    currentEl.on("click", () => {
      let checkboxesChecked = document.querySelectorAll(
        'tbody input[type="checkbox"]:checked'
      ).length;

      if (currentEl.find("input[type=checkbox]").is(":checked")) {
        currentEl.css("background-color", "#EDF8EB");
      } else {
        currentEl.css("backgroundColor", "white");
      }

      if (checkboxesChecked == bodyRows.length) {
        $(headCheckBox).prop("checked", true);
      } else {
        $(headCheckBox).prop("checked", false);
      }
      if (checkboxesChecked > 0) {
        $(tableSearch).css("display", "none");
        $(totalCheckedEl).css("display", "flex");
        $(totalCheckedEl).html(
          `<div>Đã chọn ${checkboxesChecked}</div><div style="color: red;">Bỏ chọn</div><div style="color:blue;">Chọn tất cả các trang<div>`
        );
      } else {
        $(tableSearch).css("display", "block");
        $(totalCheckedEl).css("display", "none");
      }
    });
  });
});
