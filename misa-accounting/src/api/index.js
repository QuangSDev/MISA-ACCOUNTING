export const getGeneratedEmployeeCode = async () => {
  try {
    return await fetch(
      "https://apidemo.laptrinhweb.edu.vn/api/v1/Employees/NewEmployeeCode"
    ).then(async (response) => {
      return await response.text().then((cc) => {
        return cc;
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const createNewEmployee = async (body) => {
  try {
    return await fetch("https://apidemo.laptrinhweb.edu.vn/api/v1/Employees", {
      method: "POST",
      mode: "cors",
      headers: {
        "content-type": "application/json",
        "Content-Length": JSON.stringify(body).length,
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    return error;
  }
};
