import axios from "axios";
import { baseUrl } from "./constants";

export const getAllEmployees = async () => {
  const res = await axios.get(`${baseUrl}/Employees`);
  return res.data;
};

export const getFilterEmployees = async (
  keyword,
  pageSize = 20,
  pageNumber = 1,
  filterList
) => {
  const res = await axios.post(
    `${baseUrl}/Employees/Filter?keyword=${keyword}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
    { ...filterList }
  );

  return res.data;
};

export const getGeneratedCode = async () => {
  const res = await axios.get(`${baseUrl}/Employees/NewEmployeeCode`);
  return res.data;
};

export const getDepartments = async () => {
  const res = await axios.get(`${baseUrl}/Departments`);
  return res.data;
};

export const getPositions = async () => {
  const res = await axios.get(`${baseUrl}/Positions`);
  return res.data;
};

export const createNewEmployee = async (data) => {
  await axios.post(`${baseUrl}/Employees`, data);
};

export const updateEmployee = async (id, data) => {
  await axios.put(`${baseUrl}/Employees/${id}`, data);
};

export const deleteEmployee = async (id) => {
  await axios.delete(`${baseUrl}/Employees/${id}`);
};

export const createManyEmployee = async (data) => {
  await axios.post(`${baseUrl}/Employees/InsertMany`, data);
};

export const updateManyEmployee = async (data) => {
  await axios.put(`${baseUrl}/Employees/UpdateManyByCode`, data);
};

export const deleteManyEmployees = async (employeeList) => {
  await axios.delete(`${baseUrl}/Employees/DeleteMany`, {
    data: employeeList,
  });
};

export const exportToExcel = async (queryString, excelParams) => {
  const res = await axios.post(
    `${baseUrl}/Employees/Excel?keyword=${queryString}`,
    excelParams,
    { responseType: "blob" }
  );

  const url = window.URL.createObjectURL(
    new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
  );

  const link = window.document.createElement("a");
  link.href = url;
  link.download = "Danh_sach_nhan_vien.xlsx";
  document.body.appendChild(link);
  link.click();

  // Remove anchor from body
  document.body.removeChild(link);
};

export const validateExcelData = async (data, mode) => {
  try {
    const convertedData = data.map((item) => {
      if (item["genderName"]) {
        item["gender"] =
          item["genderName"].toLowerCase() == "nữ"
            ? 0
            : item["genderName"].toLowerCase() == "nam"
            ? 1
            : item["genderName"].toLowerCase() == "khác"
            ? 2
            : -1;
      }

      return { employee: item, row: item.row };
    });
    const res = await axios.post(
      `${baseUrl}/Employees/Excel/Validate?mode=${mode}`,
      convertedData
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
