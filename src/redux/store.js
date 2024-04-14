import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slides/userSlide'
import productReducer from './slides/productSlide'


const store = configureStore({
    reducer: {
        user: userReducer,
        product: productReducer
    },
})

export default store