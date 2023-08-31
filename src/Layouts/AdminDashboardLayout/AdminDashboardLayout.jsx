import { Outlet } from "react-router-dom"
import { AdminDashboardHeader, AdminDashboardNavbar, StarParticles } from "../../Components"

import { AppShell, Box, MediaQuery } from "@mantine/core"

import "./AdminDashboardLayout.css"

export const AdminDashboardLayout = () => {
    return (
        <Box className="AdminDashboardLayout">
            <StarParticles />
            <AppShell
                layout="alt"
                className="HYMEAppShell"
                navbarOffsetBreakpoint="sm"
                asideOffsetBreakpoint="sm"
                aside={false}
                footer={false}
                header={<AdminDashboardHeader />}
                navbar={<AdminDashboardNavbar />}
            >
                <MediaQuery smallerThan="sm" styles={{ padding: 0 }}>
                    <Box px="xl">
                        <Outlet />
                    </Box>
                </MediaQuery>
            </AppShell>
        </Box>
    )
}
