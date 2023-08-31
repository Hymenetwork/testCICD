import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { createStyles, Header, Container, Group, Burger, Paper, Transition, rem, Text, Avatar, Menu, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { HYMELogo, HYMELogoWithText } from "../../Helpers/Constants"

import { IconBolt, IconBusinessplan, IconChevronDown, IconSettings, IconStar, IconUser } from '@tabler/icons-react';

const HEADER_HEIGHT = rem(60);

import useSWR from "swr";
import { APILink, ETHAddressTruncator, FethWithToken, RankCountSetter, Session_Token, ToasterMessage, api } from "../../Utils";

const useStyles = createStyles((theme) => ({
    root: {
        position: 'fixed',
        zIndex: 1,
    },

    dropdown: {
        position: 'absolute',
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: 'hidden',

        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%'
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: `${rem(8)} ${rem(12)} !important`,
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },

        [theme.fn.smallerThan('sm')]: {
            borderRadius: 0,
            padding: theme.spacing.md,
        },
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
    },
}));

export const Navbar = () => {
    const [opened, { toggle, close }] = useDisclosure(false);
    const [active, setActive] = useState("");
    const { classes, cx } = useStyles();
    const [WalletAddress, setWalletAddress] = useState("")

    const TestAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"

    useEffect(() => {
        setWalletAddress(localStorage.getItem("WALLET_ADD") ?? "")
    }, [])

    const GetUserData = `${APILink}/users/me`
    const { data: User, error, isLoading } = useSWR(
        [GetUserData, Session_Token], 
        ([url, token]) => FethWithToken(url, token)
    )

    return (
        <>
            <Header height={HEADER_HEIGHT} mb={120} className={classes.root}>
                <Container fluid className={classes.header}>
                    <Link to="/">
                        <img src={HYMELogoWithText} alt="HYME Logo" width={120} height={120} />
                    </Link>

                    <Group className={classes.links} align="center">
                        <Group spacing={4} align="center">
                            <IconBolt className="Icon" />
                            <Text fz="sm">{User?.totalAbilities}</Text>
                        </Group>

                        <Group spacing="xs" align="center">
                            <Avatar size="sm" src={HYMELogo} />
                            <Text fz="sm">{User?.totalPoints}</Text>
                        </Group>

                        <Menu withArrow shadow="md" width={200}>
                            <Menu.Target>
                                <Group sx={{ cursor: "pointer" }}>
                                    <Avatar radius="xl" src={TestAvatar} />

                                    <div style={{ flex: 1 }}>
                                        <Text size="sm" weight={500}>
                                            {WalletAddress.toLocaleUpperCase()}
                                        </Text>
                                    </div>

                                    <IconChevronDown className="Icon" />
                                </Group>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Link to="/dashboard">
                                    <Menu.Item icon={<IconUser className="Icon" />}>Profile</Menu.Item>
                                </Link>
                                <Menu.Item icon={<IconBusinessplan className="Icon" />}>Transactions</Menu.Item>
                                <Menu.Item icon={<IconStar className="Icon" />}>Favorites</Menu.Item>
                                <Menu.Item icon={<IconSettings className="Icon" />}>Settings</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>

                    <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />

                    <Transition transition="pop-top-right" duration={200} mounted={opened}>
                        {(styles) => (
                            <Paper className={classes.dropdown} withBorder style={styles}>
                                <Link to="/dashboard">
                                    <Box className={classes.link}>
                                        <Group spacing={0}>
                                            <i className="bx bx-user" />
                                            <Text className={classes.link}>Profile</Text>
                                        </Group>
                                    </Box>
                                </Link>

                                <Box className={classes.link}>
                                    <Group spacing={0}>
                                        <i className="bx bx-receipt" />
                                        <Text className={classes.link}>Transactions</Text>
                                    </Group>
                                </Box>

                                <Box className={classes.link}>
                                    <Group spacing={0}>
                                        <i className="bx bx-like" />
                                        <Text className={classes.link}>Favorites</Text>
                                    </Group>
                                </Box>

                                <Box className={classes.link}>
                                    <Group spacing={0}>
                                        <i className="bx bx-cog" />
                                        <Text className={classes.link}>Settings</Text>
                                    </Group>
                                </Box>
                            </Paper>
                        )}
                    </Transition>
                </Container>
            </Header>
        </>
    )
}
