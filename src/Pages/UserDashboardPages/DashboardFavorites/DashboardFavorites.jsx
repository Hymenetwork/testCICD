import { ActionIcon, Box, Card, Chip, Container, Grid, Group, Image, Stack, Text, TextInput, Title } from "@mantine/core"
import { IconAdjustmentsHorizontal, IconCheck, IconSearch, IconTrash } from "@tabler/icons-react"
import { Mock1, Mock2, Mock3 } from "../../../Helpers/Constants"

import useSWR from "swr";
import { APILink, FethWithToken, Session_Token, ToasterMessage, api } from "../../../Utils";

import "./DashboardFavorites.css"
export const DashboardFavorites = () => {
    let id, title, message, icon, color, hasRedirect, redirectLocation = ""

    const GetMyFavoritesEP = `${APILink}/projects/favorites`

    const { data: MyFavoriteProjects, error, isLoading, mutate } = useSWR(
        [GetMyFavoritesEP, Session_Token], 
        ([url, token]) => FethWithToken(url, token)
    )

    if(error) console.log(error)

    const RemoveProjectFromFavorite = async (projectId) => {
        const RemoveProjectFromFavoriteEP = `/projects/${projectId}/favorites`
        await api.post(RemoveProjectFromFavoriteEP).then((result) => {
            const Status = result.status

            if(Status === 200){
                mutate()

                id = "FavoriteProjectRemoved"
                title= "Favorite project successfully removed"
                message = ""
                icon = <IconCheck className="Icon" />
                color = "green"

                ToasterMessage(id, title, message, icon, color)
            }

        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <Box className="DashboardFavoriteProjects">
            {isLoading && "Loading..."}

            {MyFavoriteProjects && MyFavoriteProjects.length !== 0
                ?
                    <>
                        <Group position="apart" align="center">
                            <Chip.Group multiple>
                                <Group spacing="xs">
                                    <Chip size="md" radius="sm" color="violet" variant="light" value="Popular">Popular</Chip>
                                    <Chip size="md" radius="sm" color="violet" variant="light" value="New">New</Chip>
                                    <Chip size="md" radius="sm" color="violet" variant="light" value="Trending">Trending</Chip>
                                    <Chip size="md" radius="sm" color="violet" variant="light" value="Metaverse">Metaverse</Chip>
                                    <Chip size="md" radius="sm" color="violet" variant="light" value="Play to Earn">Play to Earn</Chip>
                                    <Chip size="md" radius="sm" color="violet" variant="light" value="Crypto">Crypto</Chip>
                                    <Chip size="md" radius="sm" color="violet" variant="light" value="NFT">NFT</Chip>
                                </Group>
                            </Chip.Group>

                            <Group>
                                <TextInput size="md" placeholder="Search" rightSection={<IconSearch className="Icon" />} />

                                <ActionIcon size="xl" radius="xl" variant="outline">
                                    <IconAdjustmentsHorizontal className="Icon" />
                                </ActionIcon>
                            </Group>
                        </Group>

                        <Container fluid my="xl">
                            <Grid align="center">
                                {MyFavoriteProjects.map((MyFavoriteProject, index) => 
                                    <Grid.Col sm={4} md={2} key={index}>
                                        <Card p={0} radius="md" className="ProjectCard">
                                            <Box className="ActionContainer">
                                                <ActionIcon variant="filled" color="red" radius="xl" size="lg" onClick={() => RemoveProjectFromFavorite(MyFavoriteProject.id)}>
                                                    <IconTrash className="Icon" />
                                                </ActionIcon>
                                            </Box>
                                            
                                            <Image src={MyFavoriteProject.banner} alt={MyFavoriteProject.title} mx="auto" radius="md" className="ProjectBanner" />
                                        </Card>
                                    </Grid.Col>
                                )}
                            </Grid>
                        </Container>
                    </>
                :
                    <Title order={1}>You have no favorited projects yet</Title>
            }
        </Box>
    )
}
