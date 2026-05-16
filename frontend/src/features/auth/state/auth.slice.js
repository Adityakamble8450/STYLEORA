import { createSlice } from "@reduxjs/toolkit";
import { loadAuthSession } from "../services/auth.session";

const { token, user } = loadAuthSession()

const authSlice = createSlice({
    name : 'auth' ,
    initialState : {
        user : user ,
        token : token ,
        loading : false ,
        error :null
    } , 
    reducers : {
        setUser  : (state , action) =>{
            state.user = action.payload
        } ,

        setToken : (state, action) => {
            state.token = action.payload
        } ,

        setLoading : (state , action) =>{
            state.loading = action.payload
        } ,
        setError : (state ,action) =>{
            state.error = action.payload
        },
        clearAuthState: (state) => {
            state.user = null
            state.token = null
            state.loading = false
            state.error = null
        }
    }
})

export const {setUser , setToken, setLoading , setError, clearAuthState} = authSlice.actions
export default authSlice.reducer
