import { useDispatch, useSelector } from 'react-redux'
import { setError, setLoading, setToken, setUser } from '../state/auth.slice'
import { registerUser , loginUser } from '../services/user.api'
import { saveAuthSession } from '../services/auth.session'

const useAuth = () => {
  const dispatch = useDispatch()
  const { loading, error, user } = useSelector((state) => state.auth)

  const handleRegister = async ({ email, contact, fullname, password, role }) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    try {
      const data = await registerUser({
        email,
        contact,
        fullname,
        password,
        role,
      })

      dispatch(setUser(data.user))
      dispatch(setToken(data.token))
      saveAuthSession({ token: data.token, user: data.user })
      return data
    } catch (requestError) {
      dispatch(setError(requestError.message))
      throw requestError
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleLogin  = async ({email , password})=>{
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      const data = await loginUser ({
      email ,
      password
    })
    dispatch(setUser(data.user))
    dispatch(setToken(data.token))
    saveAuthSession({ token: data.token, user: data.user })
    return data
    }catch (requestError) {
      dispatch(setError(requestError.message))
      throw requestError
    } finally {
      dispatch(setLoading(false))
    }

  }

  return { handleRegister, handleLogin ,  loading, error, user }
}

export default useAuth
