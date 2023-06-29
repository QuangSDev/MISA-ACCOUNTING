import store from "@/store";
import { ACCOUNTING_TEXT } from "./resources";
import * as XLSX from "xlsx";

export const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "https://localhost:7069/api/v1"
    : "idontknow";

export const showToast = (type, text) => {
  store.commit("pushToast", {
    type,
    text,
  });
};

// Danh sách cột mặc định
export const TABLE_HEADERS = [
  {
    headerName: "Mã nhân viên",
    className: ["align--left", "filter-container"],
    width: 180,
    isShown: true,
    sticky: false,
    model: "employeeCode",
    required: true,
  },
  {
    headerName: "Tên nhân viên",
    className: ["align--left", "filter-container"],
    width: 430,
    isShown: true,
    sticky: false,
    required: true,
    model: "fullName",
  },
  {
    headerName: "Giới tính",
    className: ["align--left", "filter-container"],
    width: 120,
    isShown: true,
    sticky: false,
    model: "genderName",
  },
  {
    headerName: "Ngày sinh",
    className: ["align--center", "filter-container"],
    width: 140,
    isShown: true,
    sticky: false,
    model: "dateOfBirth",
  },
  {
    headerName: "Số CMND",
    className: ["align--left", "tooltip-container", "filter-container"],
    width: 200,
    isShown: true,
    tooltipText: "headers.identityNumber",
    sticky: false,
    model: "identityNumber",
  },
  {
    headerName: "Ngày cấp",
    className: ["align--center", "filter-container"],
    width: 150,
    isShown: true,
    sticky: false,
    model: "identityDate",
  },
  {
    headerName: "Nơi cấp",
    className: ["align--left", "filter-container"],
    width: 150,
    isShown: true,
    sticky: false,
    model: "identityPlace",
  },
  {
    headerName: "Chức danh",
    className: ["align--left"],
    width: 240,
    isShown: true,
    sticky: false,
    model: "positionName",
  },
  {
    headerName: "Mã đơn vị",
    className: ["align--left"],
    width: 150,
    isShown: true,
    sticky: false,
    required: true,
    model: "departmentCode",
  },
  {
    headerName: "Tên đơn vị",
    className: ["align--left"],
    width: 200,
    isShown: true,
    sticky: false,
    model: "departmentName",
  },
  {
    headerName: "Địa chỉ",
    className: ["align--left"],
    width: 200,
    isShown: true,
    sticky: false,
    model: "address",
  },
  {
    headerName: "ĐT di động",
    className: ["align--left"],
    width: 150,
    isShown: true,
    sticky: false,
    model: "phoneNumber",
  },
  {
    headerName: "ĐT cố định",
    className: ["align--left"],
    width: 150,
    isShown: true,
    sticky: false,
    model: "landline",
  },
  {
    headerName: "Email",
    className: ["align--left"],
    width: 200,
    isShown: true,
    sticky: false,
    model: "email",
  },
];

export const filterConditions = [
  { text: "isNull", operator: "##" },
  { text: "notNull", operator: "!#" },
  { text: "equal", operator: "==" },
  { text: "notEqual", operator: "!=" },
  { text: "contain", operator: "**" },
  { text: "notContain", operator: "!*" },
  { text: "startWith", operator: "$%" },
  { text: "endWith", operator: "%$" },
];

export const dateFilterConditions = [
  { text: "equal", operator: "==" },
  { text: "notEqual", operator: "!=" },
  { text: "less", operator: "<<" },
  { text: "lessEqual", operator: "<=" },
  { text: "greater", operator: ">>" },
  { text: "greaterEqual", operator: ">=" },
  { text: "isNull", operator: "##" },
  { text: "notNull", operator: "!#" },
];

/**
 * Feature: Chuyển đổi từ kí tự sang chữ
 * @param {*} operator  điều kiện lọc
 * @param {*} value  giá trị lọc
 * @returns Tên của điều kiện lọc
 * Author: Lê Minh Quang
 * Date: 28/03/2023
 */
export const convertOperator = (operator, value, model) => {
  const trueValue =
    model === "gender"
      ? value == 1
        ? "Nam"
        : value == 0
        ? "Nữ"
        : value == 2 && "Khác"
      : value;

  if (operator == "##") {
    return ACCOUNTING_TEXT.vi.operator.isNull;
  } else if (operator == "!#") {
    return ACCOUNTING_TEXT.vi.operator.notNull;
  } else if (operator == "==") {
    return `${ACCOUNTING_TEXT.vi.operator.equal} "${trueValue}"`;
  } else if (operator == "!=") {
    return `${ACCOUNTING_TEXT.vi.operator.notEqual} "${trueValue}"`;
  } else if (operator == "**") {
    return `${ACCOUNTING_TEXT.vi.operator.contain} "${trueValue}"`;
  } else if (operator == "!*") {
    return `${ACCOUNTING_TEXT.vi.operator.notContain} "${trueValue}"`;
  } else if (operator == "$%") {
    return `${ACCOUNTING_TEXT.vi.operator.startWith} "${trueValue}"`;
  } else if (operator == "%$") {
    return `${ACCOUNTING_TEXT.vi.operator.endWith} "${value}"`;
  } else if (operator == "<<") {
    return `${ACCOUNTING_TEXT.vi.operator.less} "${value}"`;
  } else if (operator == "<=") {
    return `${ACCOUNTING_TEXT.vi.operator.lessEqual} "${value}"`;
  } else if (operator == ">>") {
    return `${ACCOUNTING_TEXT.vi.operator.greater} "${value}"`;
  } else if (operator == ">=") {
    return `${ACCOUNTING_TEXT.vi.operator.greaterEqual} "${value}"`;
  }
};

/**
 * Feature: Tính độ rộng từ đầu bảng đến cột hiện tại để sticky
 * @param {*} list danh sách cột
 * @param {*} index vị trí cột hiện tại
 * @returns độ rộng từ đầu bảng tới vị trí cột hiện tại
 */
export const calculateWidth = (list, index) => {
  return (
    list
      // Lọc ra các cột được hiển thị và là sticky
      .filter((item) => item.isShown && item.sticky)
      // Lấy ra mảng từ đầu cho đến vị trí cột cần tính
      .slice(0, index)
      // Tính tổng độ rộng các cột phía trước
      .reduce((total, cur) => total + cur.width, 38.8)
  );
};

export const testDownload = (uri, name) => {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.click();
};

export const readExcel = (file) => {
  const promise = new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      const bufferArray = e.target?.result;
      const wb = XLSX.read(bufferArray, { type: "buffer" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      var test = XLSX.utils.decode_range(ws["!ref"]);
      var rowNum;
      var colNum;
      var startPos = 0;
      var colLength = 0;
      var headers = [];
      // Bắt đầu lặp từ dòng đầu đến dòng cuối
      for (rowNum = test.s.r; rowNum <= test.e.r; rowNum++) {
        // Nếu số lượng cột lớn hơn một thì gán giá trị dòng bắt đầu dữ liệu là dòng hiện tại trừ 1 và break vòng lặp
        if (colLength > 1) {
          startPos = rowNum - 1;
          break;
        }
        colLength = 0;
        // Lặp cột
        for (colNum = test.s.c; colNum <= test.e.c; colNum++) {
          // Nếu cột có giá trị thì push giá trị cột vào mảng headers và tăng số lượng cột lên
          if (ws[XLSX.utils.encode_cell({ r: rowNum, c: colNum })]?.v) {
            headers.push(
              ws[XLSX.utils.encode_cell({ r: rowNum, c: colNum })]?.v
            );
            colLength++;
            // Nếu cột không có giá trị, mà số lượng cột nhỏ hơn 2 thì xóa hết các phần tử trong cột và thoát khỏi lặp cột
          } else {
            if (headers.length < 2) {
              headers = [];
            }
            break;
          }
        }
      }
      // Xóa hết kí tự đặc biệt khỏi cột
      const convertedHeaders = headers.map((item) =>
        item.replace(/[&#,+()$~%.'":*?<>{}]/g, "").trim()
      );
      // Gán lại giá trị bắt đầu
      test.s.r = startPos;
      ws["!ref"] = XLSX.utils.encode_range(test);
      const data = XLSX.utils.sheet_to_json(ws);
      // Chuyển đổi dữ liệu trả về, lặp qua từ dòng được trả về
      const convertedData = data.map((item) => {
        let obj = {};
        // Lặp các cột lấy được
        convertedHeaders.forEach((trueKey) => {
          // Nếu property(cột) của dữ liệu trả về trùng với cột sau khi thay đổi thì gắn property vào obj
          let index = Object.keys(item).findIndex(
            (key) => trueKey == key.replace(/[&#,+()$~%.'":*?<>{}]/g, "").trim()
          );
          if (index != -1) {
            obj[trueKey] = item[Object.keys(item)[index]];
          } else {
            obj[trueKey] = null;
          }
        });
        // Trả về một object có các property của obj sau khi gán các property của dữ liệu trả về, và dòng
        return { ...obj, row: item.__rowNum__ };
      });
      // Trả về data, tên sheet, vị trí bắt đầu và danh sách cột
      resolve({
        data: convertedData,
        sheetName: wb.SheetNames[0],
        startPos,
        headers: convertedHeaders,
      });
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
  return promise;
};
