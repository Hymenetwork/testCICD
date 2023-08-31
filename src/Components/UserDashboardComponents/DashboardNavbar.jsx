import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OpenOrCloseMenu } from '../../Redux/Dashboard/DashboardSlice';

import { Link } from 'react-router-dom';

import { Burger, Divider, Group, Image, MediaQuery, Navbar, Stack, Text, UnstyledButton, createStyles, useMantineTheme } from '@mantine/core';

import { IconLogout } from '@tabler/icons-react';
import { HYMELogoWithText } from '../../Helpers/Constants';
import { LowerSidebarItems, UpperSidebarItems } from '../../Helpers/DashboardSidebar';
import { useLogout } from '../../Hooks';

export const DashboardNavbar = () => {
    const theme = useMantineTheme();
    const [ActiveSidebarItem, SetActiveSidebarItem] = useState(localStorage.getItem("DashboardActiveSidebarItem") ?? "Dashboard");

    const useStyles = createStyles((theme) => ({
        DashboardSidebarItem: {
            display: "block",
            width: "100%",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,

            '&:hover': {
                background: "var(--SidebarActiveItem)"
            },
        },
        
        Active: {
            "&, &:hover": {
                borderImage: "var(--SidebarActiveItemBorder)",
                borderWidth: 3,
                borderStyle: "solid",
                borderRight: 0,
                // background: "unset",
                background: "var(--SidebarActiveItem)"
            }
        }
    }))

    const { classes, cx } = useStyles();
    
    const IsMenuOpen = useSelector((state) => state.toggleMenu.isOpen)
    const dispatch = useDispatch()

    const { Logout } = useLogout()
    return (
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!IsMenuOpen} width={{ sm: 200, lg: 300 }} className={`DashboardNavbar ${IsMenuOpen && "Active"}`}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                    opened={IsMenuOpen}
                    onClick={() => dispatch(OpenOrCloseMenu())}
                    size="sm"
                    color={theme.colors.gray[6]}
                />
            </MediaQuery>

            <Stack justify="space-between" sx={{ height: "100%" }}>
                <Stack spacing="xl">
                    <Stack align="center">
                        <Image src={HYMELogoWithText} alt="HYME Logo" maw={200} />
                    </Stack>

                    <Stack spacing="xs" align="center">
                        {UpperSidebarItems.map((SidebarItem, Index) => 
                            <UnstyledButton
                                key={Index}
                                className={cx(classes.DashboardSidebarItem, { [classes.Active]: SidebarItem.Label === ActiveSidebarItem })}
                                component={Link}
                                to={SidebarItem.Link}
                                onClick={() => {
                                    SetActiveSidebarItem(SidebarItem.Label)
                                    localStorage.setItem("DashboardActiveSidebarItem", SidebarItem.Label)
                                }}
                            >
                                <Group>
                                    {SidebarItem.Icon}

                                    <Text size="sm">
                                        {SidebarItem.Label}
                                    </Text>
                                </Group>
                            </UnstyledButton>
                        )}
                    </Stack>
                </Stack>

                <Stack spacing="xs">
                    <Divider my="xl" />
                    
                    {LowerSidebarItems.map((SidebarItem, Index) => 
                        <UnstyledButton
                            key={Index}
                            className={classes.DashboardSidebarItem}
                            component={Link}
                            to={"#"}
                        >
                            <Group>
                                {SidebarItem.Icon}

                                <Text size="sm">
                                    {SidebarItem.Label}
                                </Text>
                            </Group>
                        </UnstyledButton>
                    )}

                        <UnstyledButton className={classes.DashboardSidebarItem} onClick={() => Logout()}>
                            <Group>
                                <IconLogout className="Icon" />

                                <Text size="sm">
                                    Logout
                                </Text>
                            </Group>
                        </UnstyledButton>
                </Stack>
            </Stack>
        </Navbar>
    )
}
