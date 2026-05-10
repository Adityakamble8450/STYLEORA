import express from "express";
const app = express();
import cors from 'cors'
import UserAuthrouter from './routes/user.auth.route.js'

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth' ,UserAuthrouter )




export default app
