import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  orderItems: [],
  shippingAddress: [],
  paymentMethod: '',
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: '',
  isPaid: false,
  paidAt: '',
  isDelivered: false,
  deliveredAt: ''
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  // reducers: {
  //   addOrderProduct: (state, action) => {
  //     const { orderItem } = action?.payload;
  //     const exitsProduct = state?.orderItems?.find((item) => item?.product === orderItem.product)
  //     if (exitsProduct) {
  //       exitsProduct.amount += orderItem?.amount
  //     }else {
  //       state?.orderItems.push(orderItem)
  //     }
  //   },
  //   removeOrderProduct: (state, action) => {
  //     const idProduct = action?.payload;
  //     state.orderItems = state?.orderItems.filter((item) => item?.product !== idProduct)
  //   },
  //   removeAllOrderProduct: (state, action) => {
  //     const idProducts = action?.payload;
  //     state.orderItems = state?.orderItems.filter((item) => !idProducts.includes(item.product))
  //   },
  //   updateOrderItem: (state, action) => {
  //     const updatedOrderItem = action.payload;
  //     return {
  //       ...state,
  //       orderItems: updatedOrderItem,
  //     };
  //   },
  //   addShippingAddress: (state, action) => {
  //     const { shippingAddress } = action?.payload;
  //     state.shippingAddress = [shippingAddress];
  //   },
  // },
})

// Action creators are generated for each case reducer function
export const { addOrderProduct, removeOrderProduct, updateOrderItem, removeAllOrderProduct, addShippingAddress } = orderSlice.actions

export default orderSlice.reducer