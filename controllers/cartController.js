import Stripe from 'stripe';
import Cart from "../models/cart.js"
import httpError from "../utils/httpError.js";


// list the cart details

export const getCart = async (req, res, next) => {

    try {

        const cart = await Cart.find()
        .populate({
          path: "product", 
          select: "name image stock price",
        })
        .sort({ _id: -1 });
      

      if (!cart) {

        return next(new httpError("Cart Not Fount", 404))
      }

      res.status(200).json({message:"", data: cart});

    } catch (error) {

        return next(new httpError("Failed to List Cart items. Please Try Again", 500))
    }

  };


// Add a product to the cart

export const addToCart = async (req, res, next) => {

    try {

      const { product } = req.body;
  
      if (! product ) {

        return next(new httpError("Product is Required", 400))
      }

      const existingItem = await Cart.findOne({ product });

      if (existingItem) {

        return next(new httpError("This Product is Already Exists", 400))
      }

      const addCart = new Cart ({ product, quantity: 1 })

      await addCart.save()

      res.status(200).json({ message: "Product added to cart" });

    } catch (error) {

        return next(new httpError("Failed to Add Item to the Cart . Please Try Again", 500))
    }

};



// Update cart

export const updateCart = async (req, res, next) => {
    try {
        const { id } = req.params; // Cart item's ID
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return next(new httpError("Quantity must be at least one", 400));
        }

        // Find the cart item by its ID
        let cartItem = await Cart.findById(id);

        if (!cartItem) {
            return next(new httpError("Cart item not found", 404));
        }

        // Update the quantity
        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({ message: "Cart updated successfully" });
    } catch (error) {
        console.error("Error updating cart:", error);
        return next(new httpError("Failed to update cart item. Please try again.", 500));
    }
};

  



// Detele cart item

export const removeFromCart = async (req, res, next) => {

    try {
      const { product } = req.params;
  
      if (!product) {

        return next(new httpError("Product ID is required", 400));
      }
  
      const cartItem = await Cart.findOne({ product });
  
      if (!cartItem) {

        return next(new httpError("Product not found in cart", 404));
      }
  
      await Cart.findByIdAndDelete(cartItem._id);
  
      res.status(200).json({ message: "Product removed from cart successfully" });
  
    } catch (error) {

      return next(new httpError("Failed to delete item from the cart. Please try again.", 500));
    }

  };
  


  /*Payment Integration */
  
  export const makePayment = async (req, res, next) => {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const { carts } = req.body;
        
        if (!carts || !Array.isArray(carts) || carts.length === 0) {
            return next(new httpError("Cart is empty. Please add items before making a payment.", 400));
        }

        const lineItems = carts.map(item => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.product.name,
                },
                unit_amount: item.product.price * 100, 
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-failure`,
            metadata: {
                products: JSON.stringify(carts.map(item => ({
                    _id: item.product._id,
                    quantity: item.quantity,
                }))),
            },
        });

        res.status(200).json({
            sessionId: session.id,
            message: "Payment session created successfully",
        });

    } catch (error) {
        console.error("Stripe Payment Error:", error); 
        return next(new httpError("Payment Failed. Please try again.", 500));
    }
};

  
  
  
   