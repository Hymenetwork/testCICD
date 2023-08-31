import { ActionIcon, Avatar, Badge, Box, Button, Group, Menu, Popover, ScrollArea, Stack, Table, Text, Textarea, Title } from "@mantine/core";
import { IconBan, IconCheck, IconDots, IconEye } from "@tabler/icons-react";

import useSWR from "swr";
import { APILink, ETHAddressTruncator, FethWithToken, Session_Token, api } from "../../Utils";
import { BadgeColorSetter, BadgeLabelSetter } from "../../Components";
import { useState } from "react";

export const AdminDashboardProjects = () => {
    const [RejectionReason, SetRejectionReason] = useState("")

    const GetProjectsEP = `${APILink}/projects`

    const { data: projects, error, isLoading, mutate } = useSWR(
        [GetProjectsEP, Session_Token], 
        ([url, token]) => FethWithToken(url, token)
    )

    if(error) console.log(error)

    const ApproveProject = async (projectID) => {
        const ApproveProjectEP = `/projects/${projectID}/approve`
        await api.put(ApproveProjectEP).then((result) => {
            console.log(result)
            const Status = result.status

            if(Status === 204){
                mutate()
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    const RejectProject = async (projectID, rejectionReason) => {
        const RejectProjectEP = `/projects/${projectID}/reject`
        await api.put(RejectProjectEP, {
            "message": rejectionReason
        }).then((result) => {
            console.log(result)
            const Status = result.status

            if(Status === 204){
                mutate()
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <Box className="AdminDashboardProjects">
            <Stack>
                <Title order={1}>Projects List</Title>
                {isLoading && "Loading..."}

                {projects && 
                    <ScrollArea>
                        <Table miw={800} withBorder striped withColumnBorders fontSize="xs">
                            <tbody>
                                <tr>
                                    <th>Project Owner</th>
                                    <th>Project Information</th>
                                    <th>Status</th>
                                    <th />
                                </tr>
                                
                                
                                {projects.data.map((project, index) => 
                                    <tr key={index}>
                                        <td>
                                            <Group>
                                                <Avatar size={40} src={`https://api.dicebear.com/6.x/adventurer/svg?seed=${project.owner.name}`} radius={40} />

                                                <Stack spacing={0}>
                                                    <Text>{project.owner.name}</Text>
                                                    <Text sx={{ letterSpacing: ".2rem" }}>{ETHAddressTruncator(project.owner.walletAddress)}</Text>
                                                </Stack>
                                            </Group>
                                        </td>

                                        <td>
                                            <Stack spacing={0}>
                                                <Text fz="md" fw="bolder">{project.title}</Text>
                                                <Text fz="xs">{project.projectDescription}</Text>
                                            </Stack>
                                        </td>

                                        <td>
                                            <Badge variant="outline" color={BadgeColorSetter(project.status)}>
                                                <BadgeLabelSetter Status={project.status} />
                                            </Badge>
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
                                                        <Menu.Item icon={<IconEye className="Icon" />}>Preview Project</Menu.Item>
                                                        
                                                        <Menu.Item icon={<IconCheck className="Icon" />} onClick={() => ApproveProject(project.id)}>
                                                            Approve Project
                                                        </Menu.Item>

                                                        <Popover  trapFocus position="bottom-end" shadow="md">
                                                            <Popover.Target>
                                                                <Menu.Item icon={<IconBan className="Icon" />} color="red" closeMenuOnClick={false}>
                                                                    Reject Project
                                                                </Menu.Item>
                                                            </Popover.Target>

                                                            <Popover.Dropdown>
                                                                <Stack spacing="xs">
                                                                    <Textarea 
                                                                        placeholder="Type here..."
                                                                        label="Reason of rejecting this project"
                                                                        value={RejectionReason}
                                                                        onChange={(e) => SetRejectionReason(e.target.value)}
                                                                    />

                                                                    <Button onClick={() => RejectProject(project.id, RejectionReason)}>Submit</Button>
                                                                </Stack>
                                                            </Popover.Dropdown>
                                                        </Popover>
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
