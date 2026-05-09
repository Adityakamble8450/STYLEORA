import express from 'express'
import UserAuth from '../models/user.auth.model.js'
import { registerUserValidator } from '../validetors/user.auth.validator.js'
import {userRegister} from '../controller/user.auth.controller.js'


const route = express.Router()

route.post('/register', registerUserValidator , userRegister)




export default route