import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/products'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

export const createProduct = async (formData) => {
  try {
    const response = await api.post('/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      'Product creation failed.'

    throw new Error(message)
  }
}

export const getProducts = async () => {
  try {
    const response = await api.get('/seller')
    return response.data
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      'Unable to fetch products.'

    throw new Error(message)
  }
}

const productApi = {
  createProduct,
  getProducts,
}

export default productApi
