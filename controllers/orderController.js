import Stripe from 'stripe';
import Order from '../models/order.js';
import httpError from '../utils/httpError.js';
import Product from "../models/product.js"

export const verifyPayment = async (req, res, next) => {

    try {

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const { session_id: sessionId } = req.body;
  
      if (!sessionId) {
        return res.status(400).json({ status: false, message: "Session ID is required" });
      }
  
      const session = await stripe.checkout.sessions.retrieve(sessionId);
  
      if (session.payment_status === 'paid') {
        const existingOrder = await Order.findOne({ 'payment.stripe_id': session.payment_intent });
  
        if (existingOrder) {
          return res.status(200).json({ status: true, message: "Order already created" });
        }
  
        if (!session.metadata.products) {
          return next(new httpError("Products information is missing.", 400));
        }
  
        const productsForMetadata = JSON.parse(session.metadata.products);
        const products = productsForMetadata.map(product => ({
          product: product._id,
          quantity: product.quantity,
        }));
  
        const order = new Order({
          products: products,
          grand_total: session.amount_total / 100,
          payment: {
            stripe_id: session.payment_intent,
            paid_at: session.created,
            status: 'completed',
          },
          status: 'completed',
        });
  
        await order.save();
  
        for (const item of products) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: -item.quantity } }, 
            { new: true }
          );
        }
  
        return res.status(200).json({ status: true, message: "Payment verified, order created, and stock updated" });
  
      } else {
        return res.status(400).json({ status: false, message: "Payment not completed" });
      }
  
    } catch (error) {

      console.error("Payment verification error:", error);

      return next(new httpError("Payment verification failed", 500));
    }

  };
  


/** list all orders */

export const listOrders = async (req, res, next) => {

    try {

        const orders = await Order.find()
        .populate({
            path: 'products',
            populate: {
                path: 'product',
            },
        });

        res.status(200).json({
            message: '',
            data: orders,
            status: true,
            access_token: null
        })
        
    } catch (error) {
        console.log(error);
        
        return next(new httpError("Failed to list Orders. Please try again", 500));
    }
}