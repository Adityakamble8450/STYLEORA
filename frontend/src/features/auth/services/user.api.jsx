import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/auth'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

export const getGoogleAuthUrl = () => `${API_BASE_URL}/google`

export const registerUser = async (payload) => {
  try {
    const response = await api.post('/register', payload)
    return response.data
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      'User registration failed.'

    throw new Error(message)
  }
}

export const loginUser = async (payload) =>{
  try {
    const response = await api.post('/login' , payload)
    return response.data
  } catch (error) {
     const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      'User Login failed.'

    throw new Error(message)
    
  }
}
