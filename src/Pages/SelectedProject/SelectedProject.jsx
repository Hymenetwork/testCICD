import { Box, Container, Grid, Group, Image, Stack, Text, Title } from "@mantine/core"

import { SelectedProjectLogo, SelectedProjectStory, SelectedProjectToken, SelectedProjectNFT, SelectedProjectNews  } from "../../Helpers/Constants"

import { IconBrandDiscord, IconBrandFacebook, IconBrandLinkedin, IconBrandTelegram, IconStar, IconThumbDown, IconThumbUp, IconWorld } from "@tabler/icons-react"

import { Link } from 'react-scroll'

import "./SelectedProject.css"
import { useNavigate, useParams } from "react-router-dom"
import { APILink, FethWithToken, Session_Token } from "../../Utils"
import useSWR from "swr";

export const SelectedProject = () => {
    const { projectId } = useParams()
    const Navigate = useNavigate()

    const GetSelectedProjectEP = `${APILink}/projects/${projectId}`

    const { data: Project, error, isLoading, mutate } = useSWR(
        [GetSelectedProjectEP, Session_Token], 
        ([url, token]) => FethWithToken(url, token)
    )

    if(error){
        console.log(error)
        const Status = error.response.status
        if(Status === 400 || Status === 404){
            Navigate("/page-not-found")
        }
    }

    if(Project) console.log(Project)
    return (
        <Container fluid className="SelectedProjectPage">
            {isLoading && "Loading..."}

            {Project && 
                <Grid>
                    <Grid.Col span="auto">
                        <Stack mt={100} align="start" spacing="xl" sx={{ position: "sticky", top: "calc(3.75rem + 1rem)" }}>
                            <Image src={Project.logo} width={250} />

                            <Text fz="xl" ta="justify">
                               {Project.projectDescription}
                            </Text>

                            <Group>
                                <IconWorld className="Icon" />
                                <IconBrandFacebook className="Icon" />
                                <IconBrandDiscord className="Icon" />
                                <IconBrandLinkedin className="Icon" />
                                <IconBrandTelegram className="Icon" />
                            </Group>

                            <Group align="center">
                                <IconStar className="Icon" />
                                <IconThumbUp className="Icon" />
                                <IconThumbDown className="Icon" />
                            </Group>

                            <Stack my="xl">
                                <Link activeClass="active" to="story" spy={true} smooth={true} offset={-200}>
                                    <Text tt="uppercase" fw="bolder" fz={"24px"} sx={{ letterSpacing: 2 }}>
                                        The Story
                                    </Text>
                                </Link>

                                <Link activeClass="active" to="token" spy={true} smooth={true} offset={-200}>
                                    <Text tt="uppercase" fw="bolder" fz={"24px"} sx={{ letterSpacing: 2 }}>
                                        Token
                                    </Text>
                                </Link>

                                <Link activeClass="active" to="nft" spy={true} smooth={true} offset={-200}>
                                    <Text tt="uppercase" fw="bolder" fz={"24px"} sx={{ letterSpacing: 2 }}>
                                        NFT
                                    </Text>
                                </Link>

                                <Link activeClass="active" to="news" spy={true} smooth={true} offset={-200}>
                                    <Text tt="uppercase" fw="bolder" fz={"24px"} sx={{ letterSpacing: 2 }}>
                                        News
                                    </Text>
                                </Link>
                            </Stack>
                        </Stack>
                    </Grid.Col>
                    
                    <Grid.Col sm={12} md={8}>
                        <Box id="story" sx={{ minHeight: "100vh" }}>
                            <Image src={Project.banner} />

                            <Title order={1}>
                                {Project.title}
                            </Title>

                            <Text>
                                {Project.storyDescription}
                            </Text>
                        </Box>

                        <Box id="token" sx={{ minHeight: "100vh" }}>
                            <Image src={SelectedProjectToken} />

                            <Title order={1}>
                                The Metaverse Generated & Token Game
                            </Title>

                            <Text>
                                The NETVRK token can be used to buy assets within the virtual reality world you are in. Assets can include buildings, vehicles, houses along with many other items that can be found in the NETVRK marketplace. The NETVRK token can be used to buy assets within the virtual reality world you are in. Assets can include buildings, vehicles, houses along with many other items that can be found in the NETVRK marketplace.
                            </Text>
                        </Box>

                        <Box id="nft" sx={{ minHeight: "100vh" }}>
                            <Image src={SelectedProjectNFT} />

                            <Title order={1}>
                                The Metaverse Generated & Token Game
                            </Title>

                            <Text>
                                The NETVRK token can be used to buy assets within the virtual reality world you are in. Assets can include buildings, vehicles, houses along with many other items that can be found in the NETVRK marketplace. The NETVRK token can be used to buy assets within the virtual reality world you are in. Assets can include buildings, vehicles, houses along with many other items that can be found in the NETVRK marketplace.
                            </Text>
                        </Box>

                        <Box id="news" sx={{ minHeight: "100vh" }}>
                            <Image src={SelectedProjectNews} />

                            <Title order={1}>
                                The Metaverse Generated & Token Game
                            </Title>

                            <Text>
                                The NETVRK token can be used to buy assets within the virtual reality world you are in. Assets can include buildings, vehicles, houses along with many other items that can be found in the NETVRK marketplace. The NETVRK token can be used to buy assets within the virtual reality world you are in. Assets can include buildings, vehicles, houses along with many other items that can be found in the NETVRK marketplace.
                            </Text>
                        </Box>
                    </Grid.Col>
                </Grid>
            }
        </Container>
    )
}
