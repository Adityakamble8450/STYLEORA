import express from 'express'
import UserAuth from '../models/user.auth.model.js'
import { registerUserValidator, loginUserValidator } from '../validetors/user.auth.validator.js'
import { userRegister, userLogin, googleOAuthCallback , getme } from '../controller/user.auth.controller.js'
import passport from 'passport'
import { indentifyUser } from '../middelware/auth.middelware.js'


const route = express.Router()

route.post('/register', registerUserValidator, userRegister)
route.post('/login', loginUserValidator, userLogin)
route.get('/me' ,  indentifyUser , getme)

// Google OAuth routes
route.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))
route.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login', session: false }), googleOAuthCallback)

export default route
