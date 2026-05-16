export const getDefaultRouteForUser = (user) => {
  if (user?.role === 'seller') {
    return '/seller/dashboard'
  }

  return '/'
}
