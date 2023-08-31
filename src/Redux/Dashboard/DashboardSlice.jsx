import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false
}

export const DashboardSlice = createSlice({
    name: "toggleMenu",
    initialState,
    reducers: {
        OpenOrCloseMenu: (state) => {
            state.isOpen = !state.isOpen
        }
    }
})

export const { OpenOrCloseMenu } = DashboardSlice.actions
export default DashboardSlice.reducer