import { Outlet } from "react-router-dom"
import { StarParticles } from "../../Components"

export const ConnectWalletLayout = () => {
    return (
        <>
            <StarParticles />
            <Outlet />
        </>
    )
}
