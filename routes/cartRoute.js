import express from "express";
import { getCart, addToCart, removeFromCart, updateCart, makePayment } from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.get("/", getCart);
cartRouter.post("/", addToCart);
cartRouter.delete("/:product", removeFromCart);
cartRouter.put("/:id", updateCart);
cartRouter.post('/create-checkout-session', makePayment);


export default cartRouter;
