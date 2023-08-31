import { useSelector, useDispatch } from 'react-redux'
import { OpenOrCloseMenu } from '../../Redux/Dashboard/DashboardSlice';

import { Box, Burger, MediaQuery, useMantineTheme } from "@mantine/core";

export const AdminDashboardHeader = () => {
    const theme = useMantineTheme();

    const IsMenuOpen = useSelector((state) => state.toggleMenu.isOpen)
    const dispatch = useDispatch()

    return (
        <MediaQuery smallerThan="sm" styles={{
            padding: theme.spacing.md
        }}>
            <Box>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <Burger
                        opened={IsMenuOpen}
                        onClick={() => dispatch(OpenOrCloseMenu())}
                        size="sm"
                        color={theme.colors.gray[6]}
                    />
                </MediaQuery>
            </Box>
        </MediaQuery>
    )
}
