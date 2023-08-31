import { useState } from "react";
import useSWR from "swr";
import { MockVideo, SelectedProjectLogo } from "../../Helpers/Constants"
import { APILink, FethWithToken, Session_Token, api } from "../../Utils";
import { Box, Button, Card, Container, Grid, Group, Image, Stack, Text } from "@mantine/core"

import "./A1.css"

export const A1 = () => {
    const [Active, SetActive] = useState(0)

    const GetProjectsEP = `${APILink}/featuredposts`
    const { data: FeaturedPosts, error, isLoading } = useSWR(
        [GetProjectsEP, Session_Token], 
        ([url, token]) => FethWithToken(url, token)
    )

    if(error) console.log(error)
    
    return (
        <Container fluid className="FeaturedPage">
            {isLoading && "Loading..."}

            {FeaturedPosts && 
                <>
                    <Grid>
                        <Grid.Col span="auto">
                            <Stack align="start" spacing="xl" mx="xl" sx={{ position: "sticky", top: "calc(3.75rem + 1rem)" }}>
                                <Image src={SelectedProjectLogo} width={250} />

                                <Text fz="xl" ta="justify">
                                    The NETVRK token can be used to buy assets within the virtual reality world you are in. Assets can include buildings, vehicles, houses along with many other items that can be found in the NETVRK marketplace.
                                </Text>

                                <Stack>
                                    <Button variant="outline" className="OutlineButton">Learn More</Button>
                                    <Button variant="outline" className="OutlineButton">Explore</Button>
                                </Stack>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col sm={12} md={9}>
                            <Box className="VideoContainer">
                                <video src={MockVideo} autoPlay muted onEnded={() => console.log("tapos na pre")} />
                                {/* <video src={MockVideo} /> */}
                                <div className="VideoOverlay" />
                            </Box>
                        </Grid.Col>
                    </Grid>

                    <Container fluid>
                        <Grid grow mx="xl" mt={-50}>
                            {FeaturedPosts.map((project, index) => 
                                <Grid.Col span="auto" key={index}>
                                    <Card p={0} radius="lg" sx={{ border: `${index === Active ? "3px" : "1px"} solid white` }} className="FeaturedVideoCard"
                                    onClick={() => SetActive(index)}>
                                        <Image mx="auto" radius="md" src={project.image} alt={project.project.title} />
                                    </Card>
                                </Grid.Col>
                            
                            )}
                        </Grid>
                    </Container>
                </>
            }
        </Container>
    )
}
