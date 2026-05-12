import {createBrowserRouter} from 'react-router'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import AuthSuccess from '../features/auth/pages/AuthSuccess'

const router = createBrowserRouter([
    {
        path : '/',
        element : <h1>Hello world</h1>
    } , 

    {
        path : '/register' ,
        element : <Register/>   
    } ,
    {
        path : '/login' , 
        element : <Login/>
    },
    {
        path : '/auth-success',
        element : <AuthSuccess />
    }
])

export default router
