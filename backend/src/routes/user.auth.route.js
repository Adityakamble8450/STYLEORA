import express from 'express'
import UserAuth from '../models/user.auth.model.js'
import { registerUserValidator, loginUserValidator } from '../validetors/user.auth.validator.js'
import {userRegister , userLogin} from '../controller/user.auth.controller.js'


const route = express.Router()

route.post('/register', registerUserValidator , userRegister)
route.post('/login' , loginUserValidator , userLogin)




export default route