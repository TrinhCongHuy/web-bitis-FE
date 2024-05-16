import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './slides/userSlide'
import productReducer from './slides/productSlide'
import accountReducer from './slides/accountSlide'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import orderSlide from './slides/orderSlide'
import cartSlide from './slides/cartSlide'


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: ['product', 'user', 'account']
}

const rootReducer = combineReducers({
    user: userReducer,
    product: productReducer,
    account: accountReducer,
    order: orderSlide,
    cart: cartSlide,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),
})

export let persistor = persistStore(store)