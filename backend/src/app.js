import express from "express";
const app = express();
import cors from 'cors'
import passport from 'passport'
import { config } from './config/config.js'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import UserAuth from './models/user.auth.model.js'
import UserAuthrouter from './routes/user.auth.route.js'
import ProductRoutes from "./routes/product.routes.js";

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize())

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await UserAuth.findOne({ googleId: profile.id })

        if (user) {
            return done(null, user)
        }

        // Create new user if doesn't exist
        user = await UserAuth.create({
            googleId: profile.id,
            fullname: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0]?.value || null,
            password: null,
            contact: null,
            role: 'buyer'
        })

        return done(null, user)
    } catch (error) {
        return done(error, null)
    }
}))

app.use('/api/auth', UserAuthrouter)
app.use('/api/products' ,  ProductRoutes)

export default app
