import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    count: 0,  // Track the number of items in the cart
  },
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
  },
});

export const { setCartCount, incrementCartCount, decrementCartCount } = cartSlice.actions;

export default cartSlice.reducer;
