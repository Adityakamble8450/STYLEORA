import { createSlice } from "@reduxjs/toolkit";

const initialCart = {
  user: null,
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: initialCart,
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    setCart(state, action) {
      state.cart = {
        ...initialCart,
        ...(action.payload || {}),
      };
      state.initialized = true;
    },
    setCartLoading(state, action) {
      state.loading = action.payload;
    },
    setCartError(state, action) {
      state.error = action.payload;
    },
    clearCartState(state) {
      state.cart = initialCart;
      state.loading = false;
      state.error = null;
      state.initialized = false;
    },
  },
});

export const { setCart, setCartLoading, setCartError, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
