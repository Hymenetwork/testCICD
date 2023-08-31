import { configureStore } from '@reduxjs/toolkit'
import DashboardReducer from "./Dashboard/DashboardSlice"
import LoadingOverlayReducer from './Features/LoadingOverlaySlice'

export const Store = configureStore({
    reducer: {
        toggleMenu: DashboardReducer,
        LoadingOverlay: LoadingOverlayReducer
    }
})