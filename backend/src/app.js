import express from "express";
const app = express();
import UserAuthrouter from './routes/user.auth.route.js'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth' ,UserAuthrouter )




export default app