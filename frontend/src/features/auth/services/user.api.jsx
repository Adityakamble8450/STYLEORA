import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
  withCredentials: true,
})

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
