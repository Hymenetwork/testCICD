import { useDispatch } from "react-redux"
import { ToggleLoadingOverlay } from "../Redux/Features/LoadingOverlaySlice"

export const useLoading = () => {
    const dispatch = useDispatch()

    const ToggleLoading = (payload) => {
        dispatch(ToggleLoadingOverlay(payload))
    }

    return { ToggleLoading }
}
