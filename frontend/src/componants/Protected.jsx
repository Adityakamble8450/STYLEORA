import { Navigate, Outlet, useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import { getDefaultRouteForUser } from '../features/auth/services/auth.redirect'

const Protected = ({ roles = [], children }) => {
  const location = useLocation()
  const { user, token } = useSelector((state) => state.auth)

  if (!user && !token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to={getDefaultRouteForUser(user)} replace />
  }

  return children || <Outlet />
}

export default Protected
