import { createSlice } from '@reduxjs/toolkit';

const loadStateFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const savedState = localStorage.getItem('cartState');
    return savedState ? JSON.parse(savedState) : { count: 0, cartItems: [] };
  }
  return { count: 0, cartItems: [] }; 
};

const initialState = loadStateFromLocalStorage();

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartCount: (state, action) => {
      state.count = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartState', JSON.stringify(state));
      }
    },
    incrementCartCount: (state, action) => {
      state.count += action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartState', JSON.stringify(state));
      }
    },
    decrementCartCount: (state, action) => {
      state.count -= action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartState', JSON.stringify(state));
      }
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      state.count = 0;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartState', JSON.stringify(state));
      }
    },
  },
});

export const { setCartCount, incrementCartCount, decrementCartCount, clearCartItems } = cartSlice.actions;

export default cartSlice.reducer;
