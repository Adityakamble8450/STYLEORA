import express from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../controller/cart.controller.js";
import { indentifyUser } from "../middelware/auth.middelware.js";

const CartRoutes = express.Router();

CartRoutes.get("/", indentifyUser, getCart);
CartRoutes.post("/add", indentifyUser, addToCart);
CartRoutes.patch("/item/:itemId", indentifyUser, updateCartItemQuantity);
CartRoutes.delete("/item/:itemId", indentifyUser, removeCartItem);
CartRoutes.delete("/clear", indentifyUser, clearCart);

export default CartRoutes;
