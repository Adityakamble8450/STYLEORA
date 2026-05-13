import express from 'express'
import { identifySeller } from '../../middelware/auth.middelware.js'
const ProductRoutes = express.Router()




ProductRoutes.post('/create')



export default ProductRoutes


