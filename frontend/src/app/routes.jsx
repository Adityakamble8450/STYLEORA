import { Navigate, createBrowserRouter } from 'react-router'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import AuthSuccess from '../features/auth/pages/AuthSuccess'
import CreateProduct from '../features/products/pages/CreateProduct'
import Dashboard from '../features/products/pages/Dashboard'
import Protected from '../componants/Protected'
import AppRedirect from '../componants/AppRedirect'
import Home from '../features/products/pages/Home'
import ProductDetails from '../features/products/pages/ProductDetails'
import SellerProductdetails from '../features/products/pages/SellerProductdetails'
import Cart from '../features/products/pages/Cart'
import Checkout from '../features/products/pages/Checkout'
import Wishlist from '../features/products/pages/Wishlist'
import Orders from '../features/products/pages/Orders'
import UserProfile from '../features/products/pages/UserProfile'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/auth-success',
    element: <AuthSuccess />
  },
  {
    path: '/products/create',
    element: (
      <Protected roles={['seller']}>
        <CreateProduct />
      </Protected>
    )
  },
  {
    path: '/seller/dashboard',
    element: (
      <Protected roles={['seller']}>
        <Dashboard />
      </Protected>
    )
  },
  {
    path: '/seller/productdetails/:productId',
    element: (
      <Protected roles={['seller']}>
        <SellerProductdetails />
      </Protected>
    )
  },
  {
    path: '/details/:productId',
    element: <ProductDetails />
  },
  {
    path: '/cart',
    element: (
      <Protected>
        <Cart />
      </Protected>
    )
  },
  {
    path: '/checkout',
    element: (
      <Protected>
        <Checkout />
      </Protected>
    )
  },
  {
    path: '/wishlist',
    element: (
      <Protected>
        <Wishlist />
      </Protected>
    )
  },
  {
    path: '/orders',
    element: (
      <Protected>
        <Orders />
      </Protected>
    )
  },
  {
    path: '/profile',
    element: (
      <Protected>
        <UserProfile />
      </Protected>
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
])

export default router
