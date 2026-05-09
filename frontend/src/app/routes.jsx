import {createBrowserRouter} from 'react-router'
import Register from '../features/auth/pages/Register'

const router = createBrowserRouter([
    {
        path : '/',
        element : <h1>Hello world</h1>
    } , 

    {
        path : '/register' ,
        element : <Register/>   
    }
])

export default router