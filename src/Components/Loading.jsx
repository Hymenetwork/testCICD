import { useSelector } from 'react-redux'
import { LoadingOverlay } from "@mantine/core"

export const Loading = () => {
    const IsLoadingOverlayVisible = useSelector((state) => state.LoadingOverlay.IsVisible)
    
    return (
        <LoadingOverlay visible={IsLoadingOverlayVisible} overlayBlur={2} />
    )
}
