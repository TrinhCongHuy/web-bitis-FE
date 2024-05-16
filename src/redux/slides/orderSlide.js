import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  orderItems: [
    
  ]
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addProductCart: (state, action) => {
      const {orderItem} = action.payload
      const productInOrder = state?.orderItems.find((item) => item?.product === orderItem?.product)
      if (productInOrder) {
        productInOrder.amount += orderItem.amount
      }else {
        state?.orderItems.push(orderItem)
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const { addOrderProduct } = orderSlice.actions

export default orderSlice.reducer