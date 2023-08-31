import { ActionIcon, Avatar, Box, Button, CopyButton, Group, Menu, ScrollArea, Stack, Table, Text, Title } from "@mantine/core";
import { IconBan, IconCheck, IconCopy, IconDots, IconSend } from "@tabler/icons-react";

import useSWR from "swr";
import { APILink, ETHAddressTruncator, FethWithToken, Session_Token } from "../../Utils";

export const AdminDashboardUsers = () => {
    const GetUsersEP = `${APILink}/users`

    const { data: users, error, isLoading } = useSWR(
        [GetUsersEP, Session_Token], 
        ([url, token]) => FethWithToken(url, token)
    )

    if(error) console.log(error)

    return (
        <Box className="AdminDashboardUserPage">
            <Stack>
                <Title order={1}>Users List</Title>
                {isLoading && "Loading..."}

                {users && 
                    <ScrollArea>
                        <Table withBorder striped withColumnBorders fontSize="xs">
                            <tbody>
                                <tr>
                                    <th />
                                    <th>Username</th>
                                    <th>Wallet Address</th>
                                    <th />
                                </tr>

                                {users.data.map((user, index) => 
                                    <tr key={index}>
                                        <td>                                           
                                            <Group position="center">
                                                <Avatar size={40} src={`https://api.dicebear.com/6.x/adventurer/svg?seed=${user.name}`} radius={40} />
                                            </Group>
                                        </td>

                                        <td>
                                            <Text>{user.name}</Text>
                                        </td>

                                        <td>
                                            <Group position="apart">
                                                <Text sx={{ letterSpacing: ".2rem" }}>{ETHAddressTruncator(user.walletAddress)}</Text>
                                                
                                                <CopyButton value={user.walletAddress} timeout={2000}>
                                                    {({ copied, copy }) => (
                                                        <Button size="xs" variant="subtle" color={copied ? 'green' : 'gray'} onClick={copy} radius="xl">
                                                            {copied 
                                                                ? <>Copied &nbsp;<IconCheck className="Icon" /></>
                                                                : <>Copy &nbsp;<IconCopy className="Icon" /></>
                                                            }
                                                        </Button>
                                                    )}
                                                </CopyButton>
                                            </Group>
                                        </td>

                                        <td>
                                            <Group spacing={0} position="center">
                                                <Menu
                                                    transitionProps={{ transition: 'pop' }}
                                                    withArrow
                                                    position="bottom-end"
                                                    withinPortal
                                                >
                                                    <Menu.Target>
                                                        <ActionIcon radius="xl">
                                                            <IconDots className="Icon" />
                                                        </ActionIcon>
                                                    </Menu.Target>

                                                    <Menu.Dropdown>
                                                        <Menu.Item icon={<IconSend className="Icon" />}>Send message</Menu.Item>

                                                        <Menu.Item icon={<IconBan className="Icon" />} color="red">
                                                            Restrict User
                                                        </Menu.Item>
                                                    </Menu.Dropdown>
                                                </Menu>
                                            </Group>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </ScrollArea>
                }
            </Stack>
        </Box>
    )
}
