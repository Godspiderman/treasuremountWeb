import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  count: 0,
  cartItems: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartCount: (state, action) => {
      state.count = action.payload;
    },
    incrementCartCount: (state, action) => {
      state.count += action.payload;
    },
    decrementCartCount: (state, action) => {
      state.count -= action.payload;
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      state.count = 0;  
    },
  },
});

export const { setCartCount, incrementCartCount, decrementCartCount, clearCartItems } = cartSlice.actions;

export default cartSlice.reducer;
