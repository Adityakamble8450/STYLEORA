import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
});

export const registerUser = async (email, contact, fullname, password, role) => {
  try {
    const response = await api.post("/reigster");
    return response.data;
  } catch (error) {
    throw new error("User register api error");
    console.log(error.message);
  }
};
