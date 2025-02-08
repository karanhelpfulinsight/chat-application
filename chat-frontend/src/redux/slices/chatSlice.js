import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
    name: "chat",
    initialState: {
        selectedChat: {}
    },
    reducers: {
        setSelectedChat(state, action) {
            console.log(action.payload)
            state.selectedChat = action.payload
        }
    }
})

export const {setSelectedChat} = chatSlice.actions;
export default chatSlice.reducer