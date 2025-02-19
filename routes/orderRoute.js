import express from 'express'
import { listOrders, verifyPayment } from '../controllers/orderController.js'

const orderRouter = express.Router()

orderRouter.post('/verify-payment', verifyPayment)
orderRouter.get('/', listOrders)

export default orderRouter