import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import cartApi from "../services/cart.api.jsx";
import { setCart, setCartError, setCartLoading } from "../state/cart.slice.js";

export const UseCart = () => {
  const dispatch = useDispatch();
  const { cart, loading, error, initialized } = useSelector((state) => state.cart);

  const withCartRequest = useCallback(
    async (request, loadingMessage = true) => {
      if (loadingMessage) {
        dispatch(setCartLoading(true));
      }
      dispatch(setCartError(null));

      try {
        const response = await request();
        dispatch(setCart(response.cart || null));
        return response.cart;
      } catch (requestError) {
        dispatch(setCartError(requestError.message));
        throw requestError;
      } finally {
        if (loadingMessage) {
          dispatch(setCartLoading(false));
        }
      }
    },
    [dispatch],
  );

  const handleGetCart = useCallback(() => withCartRequest(() => cartApi.getCart()), [withCartRequest]);

  const handleAddToCart = useCallback(
    (payload) => withCartRequest(() => cartApi.addToCart(payload), false),
    [withCartRequest],
  );

  const handleUpdateCartItemQuantity = useCallback(
    (itemId, payload) => withCartRequest(() => cartApi.updateCartItemQuantity(itemId, payload), false),
    [withCartRequest],
  );

  const handleRemoveCartItem = useCallback(
    (itemId) => withCartRequest(() => cartApi.removeCartItem(itemId), false),
    [withCartRequest],
  );

  const handleClearCart = useCallback(
    () => withCartRequest(() => cartApi.clearCart(), false),
    [withCartRequest],
  );

  return {
    cart,
    loading,
    error,
    initialized,
    handleGetCart,
    handleAddToCart,
    handleUpdateCartItemQuantity,
    handleRemoveCartItem,
    handleClearCart,
  };
};

export default UseCart;
