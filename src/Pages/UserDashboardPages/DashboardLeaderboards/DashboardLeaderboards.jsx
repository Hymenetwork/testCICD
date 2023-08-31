import { Avatar, Box, Card, Divider, Group, Indicator, ScrollArea, Skeleton, Stack, Text, Title } from "@mantine/core"

import { HYMELogo } from "../../../Helpers/Constants"

import { IconArrowBigUpLine, IconTrendingUp, IconTriangleFilled } from "@tabler/icons-react"

import useSWR from "swr";
import { APILink, ETHAddressTruncator, FethWithToken, RankCountSetter, Session_Token, ToasterMessage, api } from "../../../Utils";

import "./DashboardLeaderboards.css"

export const DashboardLeaderboards = () => {
    const TestAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"

    const GetLeaderboardData = `${APILink}/users/leaderboards`
    const GetMyRank = `${APILink}/users/myrank`

    const { data: LeaderboardData, error, isLoading, mutate } = useSWR(
        [GetLeaderboardData, Session_Token], 
        ([url, token]) => FethWithToken(url, token)
    )

    const { data: MyRank, error: MyRankError, isLoading: MyRankIsLoading } = useSWR(
        [GetMyRank, Session_Token], 
        ([url, token]) => FethWithToken(url, token)
    )

    if(error) console.log(error)
    if(MyRankError) console.log(MyRankError)

    return (
        <Box className="DashboardLeaderboards">
            <Stack>
                <Group grow>
                    {LeaderboardData?.slice(0, 3).map((data, index) => 
                        <Card className="LeaderboardCard LeaderboardTopCard" radius="md" key={index}>
                            <Group>
                                <Indicator inline label={RankCountSetter(index+1)} size={30} position="top-start" offset={4} color="orange">
                                    <Avatar radius="xl" size="lg" src={TestAvatar} />
                                </Indicator>
                                
                                <Stack spacing={0}>
                                    <Text fw="bolder">{data.name}</Text>
                                    <Text fz="xs">{ETHAddressTruncator(data.walletAddress)}</Text>
                                    
                                    <Group spacing="xs">
                                        <Group spacing="xs">
                                            <Avatar size="xs" src={HYMELogo} />
                                            <Text fz="xs" fw="bold">{data.totalPoints.toLocaleString()}</Text>
                                        </Group>
                                        
                                        <Group spacing={3}>
                                            <IconTrendingUp className="Icon" style={{ color: "lightgreen" }} />

                                            <Text fz="xs" fw="bold" c="lightgreen">+ 11.10 %</Text>
                                        </Group>
                                    </Group>
                                </Stack>
                            </Group>
                        </Card>
                    )}
                </Group>
                
                <Card className="LeaderboardContainer HYMECard" radius="md">
                    <Stack>
                        <Group grow position="apart" align="center">
                            <Title order={2}>Top 50 Contributors</Title>
                            {/* <Text ta="right">17:12:04:14</Text> */}
                        </Group>

                        <Stack spacing="xs">
                            <Card bg="none">
                                <Group grow position="apart">
                                    <Group spacing="xl">
                                        <Text>Rank</Text>
                                        <Text ta="left">Username</Text>
                                    </Group>

                                    <Text ta="right">Points</Text>
                                </Group>
                            </Card>

                            {/* <ScrollArea h={500}>
                                <Stack spacing="xs"> */}
                                    {LeaderboardData?.slice(3, LeaderboardData.length).map((data, index) => 
                                        <Card className="LeaderboardCard LeaderboardNormalCard" radius="md" key={index}>
                                            <Group grow position="apart">
                                                <Group spacing="xl">
                                                    <Box>
                                                        <Text fz="xs">{RankCountSetter(index+4)}</Text>
                                                    </Box>

                                                    <Group position="apart">
                                                        <Avatar radius="xl" size="md" src={TestAvatar} />
                                                        
                                                        <Stack spacing={0}>
                                                            <Text fz="sm">{data.name}</Text>
                                                            <Text fz="xs">{ETHAddressTruncator(data.walletAddress)}</Text>
                                                        </Stack>
                                                    </Group>
                                                </Group>

                                                <Group spacing="xs" position="right">
                                                    <Avatar size="xs" src={HYMELogo} />
                                                    <Text fz="xs" fw="bold">{data.totalPoints.toLocaleString()}</Text>
                                                </Group>
                                            </Group>
                                        </Card>
                                    )}
                                {/* </Stack>
                            </ScrollArea> */}
                                    
                            <Divider my="sm" variant="dashed" />
                            <Text fw="bolder" tt="uppercase">My current rank:</Text>
                            <Skeleton visible={MyRankIsLoading} radius="md">
                                <Card className="LeaderboardCard LeaderboardNormalCard Me" radius="md">
                                    <Group grow position="apart">
                                        <Group spacing="xl">
                                            <Text fz="xs">{RankCountSetter(MyRank?.rank)}</Text>

                                            <Group position="apart">
                                                <Avatar radius="xl" size="md" src={TestAvatar} />
                                                
                                                <Stack spacing={0}>
                                                    <Text fz="sm">{MyRank?.name}</Text>
                                                    <Text fz="xs">{MyRank?.walletAddress && ETHAddressTruncator(MyRank?.walletAddress)}</Text>
                                                </Stack>
                                            </Group>
                                        </Group>

                                        <Group spacing="xs" position="right">
                                            <Avatar size="xs" src={HYMELogo} />
                                            <Text fz="xs" fw="bold">{MyRank?.totalPoints.toLocaleString()}</Text>
                                        </Group>
                                    </Group>
                                </Card>
                            </Skeleton>
                        </Stack>
                    </Stack>
                </Card>
            </Stack>
        </Box>
    )
}
