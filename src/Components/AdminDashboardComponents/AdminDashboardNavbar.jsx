import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OpenOrCloseMenu } from '../../Redux/Dashboard/DashboardSlice';

import { Link } from 'react-router-dom';

import { Avatar, Box, Burger, Group, Image, MediaQuery, Menu, NavLink, Navbar, Stack, Text, UnstyledButton, createStyles, rem, useMantineTheme } from '@mantine/core';
import { HYMELogoWithText } from '../../Helpers/Constants';
import { SidebarItems } from '../../Helpers/AdminDashboardSidebar';
import { IconDotsVertical, IconLogout2, IconUser, IconWallet } from '@tabler/icons-react';

export const AdminDashboardNavbar = () => {
    const theme = useMantineTheme();
    const [ActiveSidebarItem, SetActiveSidebarItem] = useState(localStorage.getItem("AdminDashboardActiveSidebarItem") ?? "Dashboard");

    const TestAvatar = "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
    
    const useStyles = createStyles((theme) => ({
        SidebarItem: {
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
                background: "var(--SidebarActiveItem)"
            }
        },

        SidebarFooter: {
            marginLeft: `calc(${theme.spacing.md} * -1)`,
            marginRight: `calc(${theme.spacing.md} * -1)`,
            paddingTop: theme.spacing.md,
            borderTop: `${rem(1)} solid ${
                theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
        },

        User: {
            display: 'block',
            width: '100%',
            padding: theme.spacing.md,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        
            '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
            },
        },
    }))

    const { classes, cx } = useStyles();
    
    const IsMenuOpen = useSelector((state) => state.toggleMenu.isOpen)
    const dispatch = useDispatch()

    return (
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!IsMenuOpen} width={{ sm: 200, lg: 300 }} className={`AdminDashboardNavbar ${IsMenuOpen && "Active"}`}>
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
   
                    <Stack spacing="xs">
                        {SidebarItems.map((SidebarItem, Index) => 
                            <Box key={Index}>
                                {SidebarItem.HasChildrens === false
                                    ?
                                        <NavLink
                                            label={SidebarItem.Label}
                                            icon={SidebarItem.Icon}
                                            className={cx(classes.SidebarItem, { [classes.Active]: SidebarItem.Label === ActiveSidebarItem })}
                                            onClick={() => {
                                                SetActiveSidebarItem(SidebarItem.Label)
                                                localStorage.setItem("AdminDashboardActiveSidebarItem", SidebarItem.Label)
                                            }}
                                            component={Link}
                                            to={SidebarItem.Link}
                                        />
                                    :
                                        <NavLink
                                            label={SidebarItem.Label}
                                            icon={SidebarItem.Icon}
                                            className={cx(classes.SidebarItem, { [classes.Active]: SidebarItem.Label === ActiveSidebarItem })}
                                            childrenOffset={30}
                                        >
                                            {SidebarItem.Links.map((item, index) => 
                                                <NavLink 
                                                    key={index} 
                                                    label={item.Label} 
                                                    className={classes.SidebarItem} my="xs" 
                                                    onClick={() => {
                                                        SetActiveSidebarItem(SidebarItem.Label)
                                                        localStorage.setItem("AdminDashboardActiveSidebarItem", SidebarItem.Label)
                                                    }}
                                                    component={Link}
                                                    to={item.Link}
                                                />
                                            )}
                                        </NavLink>
                                }
                            </Box>
                        )}
                    </Stack>
                </Stack>
            </Stack>

            <Navbar.Section className={classes.SidebarFooter}>
                <Menu withArrow>
                    <Menu.Target>
                        <UnstyledButton className={classes.User}
                            sx={{
                            "&:hover": {
                                background: "var(--SidebarActiveItem)"
                            }
                            }}
                        >
                            <Group>
                                <Avatar src={TestAvatar} alt="Test Avatar" radius="xl" />

                                <Box sx={{ flex: 1 }}>
                                    <Text fz="xs" c="dimmed">
                                        Good day,
                                    </Text>
                                    <Text tt="uppercase">0x4ee8...3da0</Text>
                                </Box>

                                <IconDotsVertical className="Icon" />
                            </Group>
                        </UnstyledButton>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item icon={<IconWallet className="Icon" />}><Text tt="uppercase">0x4ee8...3da0</Text></Menu.Item>
                        <Menu.Item icon={<IconUser className="Icon" />}>My Account</Menu.Item>

                        <Menu.Divider />
                        <Menu.Item color="red" icon={<IconLogout2 className="Icon"/>}>Log Out</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Navbar.Section>
        </Navbar>
    )
}
