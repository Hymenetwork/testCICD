import { Outlet } from "react-router-dom"
import { StarParticles } from "../../Components"

export const CompleteUserProfileLayout = () => {
    return (
        <>
            <StarParticles />
            <Outlet />
        </>
    )
}
