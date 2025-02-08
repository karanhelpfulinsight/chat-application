import { configureStore } from "@reduxjs/toolkit";
import chatreducer from "./slices/chatSlice"

export const store = configureStore({
    reducer: {
        chat: chatreducer 
    }
})