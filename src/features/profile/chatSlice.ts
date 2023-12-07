import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ChatSliceState = {
    isSearching: boolean
}
const initialState: ChatSliceState = {
    isSearching: false

}

export const ChatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setChat: (state, action: PayloadAction<boolean>) => {
            state.isSearching = action.payload
        }
    }
})

export const { setChat } = ChatSlice.actions


export const chatReducer = ChatSlice.reducer