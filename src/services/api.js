// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

// REGISTER COMPANY + ADMIN
export const registerCompanyAdmin = async (payload) => {
  const { data } = await api.post("/opticalfiber/register/", payload);
  return data;
};

// LOGIN
export const loginUser = async (credentials) => {
  const { data } = await api.post("/opticalfiber/login/", credentials);
  return data; 
};



// FETCH NETWORK DEVICES
export const fetchDevices = async () => {
  const token = localStorage.getItem("authToken"); // if authentication is required
  const { data } = await api.get("/network-device/networkdevice/", {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// DELETE DEVICE
export const deleteDevice = async (id) => {
  const token = localStorage.getItem("authToken");
  await api.delete(`/network-device/networkdevice/${id}/delete/`, {
    headers: { Authorization: `${token}` },
  });
};

// UPDATE DEVICE
export const updateDevice = async (id, payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.put(`/network-device/networkdevice/${id}/update/`, payload, {
    headers: { Authorization: `${token}` },
  });
  return data;
};



// Fetch offices
export const fetchOffices = async () => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.get("/office/add/", {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// UPDATE offices
export const updateOffice = async (id, payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.put(`/office/management/${id}/`, payload, {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// DELETE CUSTOMER
export const deleteOffice = async (id) => {
  const token = localStorage.getItem("authToken");
  await api.delete(`/office/management/${id}/`, {
    headers: { Authorization: `${token}` },
  });
};

// Fetch customers by office
export const fetchCustomers = async (officeId) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.get(`/customer/list/${officeId}/`, {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// Fetch customers for ALL offices
export const fetchAllCustomers = async () => {
  const token = localStorage.getItem("authToken");
  const offices = await fetchOffices(); // Get all offices
  const customerPromises = offices.map((office) =>
    api
      .get(`/customer/list/${office.id}/`, {
        headers: { Authorization: `${token}` },
      })
      .then((res) =>
        res.data.map((cust) => ({
          ...cust,
          officeName: office.name, // attach office name
        }))
      )
  );
  const allCustomers = await Promise.all(customerPromises);
  return allCustomers.flat();
};

// DELETE CUSTOMER
export const deleteCustomer = async (id) => {
  const token = localStorage.getItem("authToken");
  await api.delete(`/customer/management/${id}/`, {
    headers: { Authorization: `${token}` },
  });
};

// UPDATE CUSTOMER
export const updateCustomer = async (id, payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.put(`/customer/management/${id}/`, payload, {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// FETCH  JUNCTIONS
export const fetchJunctions = async () => {
  const token = localStorage.getItem("authToken"); // if authentication is required
  const { data } = await api.get("/junction/add/", {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// DELETE JUNCTION
export const deleteJunction = async (id) => {
  const token = localStorage.getItem("authToken");
  await api.delete(`/junction/get/${id}/delete/`, {
    headers: { Authorization: `${token}` },
  });
};

// UPDATE JUNCTION
export const updateJunction = async (id, payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.put(`/junction/get/${id}/update/`, payload, {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// FETCH ROUTES BY OFFICE
export const fetchRoutesByOffice = async (officeId) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.get(`/route/list/${officeId}/`, {
    headers: { Authorization: `${token}` },
  });
  return data;
};


export default api;
