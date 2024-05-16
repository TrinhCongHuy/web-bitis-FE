import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    products: [],
  }
  
  export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.products.push(action.payload);
        },
        updateCartQuantity: (state, action) => {
        const { id, quantity } = action.payload;
        const product = state.products.find((item) => item.id === id);
        if (product) {
            product.quantity = quantity;
        }
        },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { addToCart, updateCartQuantity } = cartSlice.actions
  
  export default cartSlice.reducer