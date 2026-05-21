import axios from "axios";
import { getApiBaseUrl } from "../../../services/api.config";
import { loadAuthSession } from "../../auth/services/auth.session";

const api = axios.create({
  baseURL: getApiBaseUrl("cart"),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const { token } = loadAuthSession();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const getErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message ||
  error.response?.data?.errors?.[0]?.msg ||
  fallbackMessage;

export const getCart = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to fetch cart."));
  }
};

export const addToCart = async (payload) => {
  try {
    const response = await api.post("/add", payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to add item to cart."));
  }
};

export const updateCartItemQuantity = async (itemId, payload) => {
  try {
    const response = await api.patch(`/item/${itemId}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to update cart item."));
  }
};

export const removeCartItem = async (itemId) => {
  try {
    const response = await api.delete(`/item/${itemId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to remove cart item."));
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete("/clear");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to clear cart."));
  }
};

const cartApi = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
};

export default cartApi;
