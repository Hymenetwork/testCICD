import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    IsVisible: false
}

export const LoadingOverlaySlice = createSlice({
    name: "LoadingOverlay",
    initialState,
    reducers: {
        ToggleLoadingOverlay: (state, action) => {
            state.IsVisible = action.payload
        }
    }
})

export const { ToggleLoadingOverlay } = LoadingOverlaySlice.actions
export default LoadingOverlaySlice.reducer