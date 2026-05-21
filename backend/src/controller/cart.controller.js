import Cart from "../models/cart.model.js";
import Product from "../models/products.model.js";

const buildCartResponse = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "title description images price variants",
  });

  return cart;
};

export const getCart = async (req, res) => {
  try {
    const cart = await buildCartResponse(req.user._id);

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart fetched successfully",
        cart: {
          user: req.user._id,
          items: [],
          totalItems: 0,
          totalAmount: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch cart",
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, variantId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product id is required",
      });
    }

    const qty = Number(quantity) || 1;

    if (qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let unitPrice = product.price;

    if (variantId) {
      const variant = product.variants.id(variantId);

      if (!variant) {
        return res.status(404).json({
          success: false,
          message: "Variant not found",
        });
      }

      unitPrice = {
        amount: variant.price?.amount ?? product.price.amount,
        currency: variant.price?.currency ?? product.price.currency ?? "INR",
      };
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find((item) => {
      const sameProduct = item.product.toString() === productId;
      const sameVariant =
        (item.variantId ? item.variantId.toString() : null) ===
        (variantId || null);

      return sameProduct && sameVariant;
    });

    if (existingItem) {
      existingItem.quantity += qty;
      existingItem.price = unitPrice;
    } else {
      cart.items.push({
        product: product._id,
        variantId: variantId || null,
        quantity: qty,
        price: unitPrice,
      });
    }

    await cart.save();

    const populatedCart = await buildCartResponse(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add item to cart",
    });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity);

    if (!Number.isFinite(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    item.quantity = qty;
    await cart.save();

    const populatedCart = await buildCartResponse(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update cart item",
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    item.deleteOne();
    await cart.save();

    const populatedCart = await buildCartResponse(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to remove cart item",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
        cart: {
          user: req.user._id,
          items: [],
          totalItems: 0,
          totalAmount: 0,
        },
      });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to clear cart",
    });
  }
};
