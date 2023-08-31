import { Navigate, Route, Routes } from "react-router-dom"

//! Layouts
import { ConnectWalletLayout, CompleteUserProfileLayout, HomeLayout, DashboardLayout, AdminDashboardLayout } from "../Layouts"

//! Pages
import { 
    ConnectWallet, 
    CompleteUserProfile, 

    A1, A2, SelectedProject,
    
    Dashboard, DashboardLeaderboards, DashboardFavorites, DashboardProjects, DashboardNews,
    AdminDashboard, AdminDashboardUsers, AdminDashboardProjects,

    NotFound
} from "../Pages"

import { Session_Token } from "../Utils"

export const AuthChecker = ({children}) => {
    if(!Session_Token){
        window.location.href = "/connect-wallet"
    }else{
        return children
    }
}

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/connect-wallet" element={Session_Token ? <Navigate to="/" /> : <ConnectWalletLayout />}>
                <Route index element={<ConnectWallet />} />   
            </Route>
            
            <Route path="/complete-profile" element={<AuthChecker><CompleteUserProfileLayout /></AuthChecker>}>
                <Route index element={<CompleteUserProfile />} /> 
            </Route>

            <Route path="/" element={<AuthChecker><HomeLayout /></AuthChecker>}>
                <Route index element={<A1 />} />
                <Route path="a2" element={<A2 />} />
                <Route path=":projectId" element={<SelectedProject />} />
            </Route>

            <Route path="/dashboard" element={<AuthChecker><DashboardLayout /></AuthChecker>}>
                <Route index element={<Dashboard />} />
                <Route path="leaderboards" element={<DashboardLeaderboards />} />
                <Route path="favorites" element={<DashboardFavorites />} />
                <Route path="projects" element={<DashboardProjects />} />
                <Route path="news" element={<DashboardNews />} />
            </Route>

            <Route path="/admin-dashboard" element={<AdminDashboardLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminDashboardUsers />} />
                <Route path="projects" element={<AdminDashboardProjects />} />
            </Route>

            <Route path="/page-not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/page-not-found" replace />} />
        </Routes>
    )
}
