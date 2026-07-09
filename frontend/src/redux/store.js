import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/es/storage'
import authReducer from './authSlice.js'
import cartReducer from './cartSlice.js'




const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer
})


const persistConfig = {
    key: "root",
    storage,
    version: 1,
    whitelist: ["auth"]
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false
        })
})

export const persistor = persistStore(store);