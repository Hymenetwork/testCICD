import { Navbar, StarParticles } from "../../Components"
import { Outlet } from "react-router-dom"

export const HomeLayout = () => {
    return (
        <>
            <Navbar />
            <StarParticles />
            <Outlet />
        </>
    )
}
