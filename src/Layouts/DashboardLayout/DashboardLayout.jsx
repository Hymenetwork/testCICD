import { Outlet } from 'react-router-dom'

import { AppShell, Box, MediaQuery } from '@mantine/core';

import { DashboardHeader, DashboardNavbar, DashboardToolBar, StarParticles } from '../../Components'

import "./DashboardLayout.css"

export const DashboardLayout = () => {

    return (
        <Box className="DashboardLayout">
            <AppShell
                layout="alt"
                className="HYMEAppShell"
                navbarOffsetBreakpoint="sm"
                asideOffsetBreakpoint="sm"
                aside={false}
                footer={false}
                header={<DashboardHeader />}
                navbar={<DashboardNavbar />}
            >
                <MediaQuery smallerThan="sm" styles={{ padding: 0 }}>
                    <Box px="xl">
                        <DashboardToolBar />
                        <Outlet />
                    </Box>
                </MediaQuery>
            </AppShell>
            
            <StarParticles />
        </Box>
    )
}
