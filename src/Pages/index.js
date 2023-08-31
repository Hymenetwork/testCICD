import { ConnectWallet } from "./ConnectWallet/ConnectWallet";
import { CompleteUserProfile } from "./CompleteUserProfile/CompleteUserProfile"; 

import { A1 } from "./A1/A1";
import { A2 } from "./A2/A2";
import { SelectedProject } from "./SelectedProject/SelectedProject";

import { Dashboard, DashboardLeaderboards, DashboardFavorites, DashboardProjects, DashboardNews } from "./UserDashboardPages";
import { AdminDashboard, AdminDashboardProjects, AdminDashboardUsers } from "./AdminDashboardPages"

import { NotFound } from "./NotFound/NotFound";

export { 
    ConnectWallet, CompleteUserProfile, 
    
    A1, A2, SelectedProject,

    Dashboard, DashboardLeaderboards, DashboardFavorites, DashboardProjects, DashboardNews,
    AdminDashboard, AdminDashboardProjects, AdminDashboardUsers,
    
    NotFound
}