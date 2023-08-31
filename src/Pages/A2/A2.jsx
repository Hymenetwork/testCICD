import { Carousel } from "@mantine/carousel";
import { ActionIcon, Box, Button, Card, Container, Grid, Group, Image, Stack, Text } from "@mantine/core";
import { IconAdjustmentsHorizontal, IconCheck, IconSearch, IconStar, IconThumbDown, IconThumbDownFilled, IconThumbUp, IconThumbUpFilled } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { APILink, FethWithToken, Session_Token, ToasterMessage, api } from "../../Utils";

import "./A2.css";

export const A2 = () => {
    let id, title, message, icon, color, hasRedirect, redirectLocation = ""
    
    const [Active, SetActive] = useState(0)
    const [Embla, SetEmbla] = useState()
    const [ActionsHeight, SetActionsHeight] = useState(0)
    const [IsVideoDone, SetIsVideoDone] = useState(false)

    const [ActiveProject, SetActiveProject] = useState({
        "Id": "",
        "Title": "",
        "Logo": "",
        "Description": "",
        "Trailer": ""
    })

    const VideoOnPlayRef = useRef()

    const GetProjectsEP = `${APILink}/projects`
    const { data: Projects, error, isLoading } = useSWR(
        [GetProjectsEP, Session_Token], 
        ([url, token]) => FethWithToken(url, token)
    )

    if(error) console.log(error)

    const AddToFavorite = async (projectId) => {
        const AddToFavoriteEP = `/projects/${projectId}/favorites`
        await api.post(AddToFavoriteEP).then((result) => {
            const Status = result.status

            if(Status === 200){
                id = "ProjectFavorited"
                title= "Project added to favorites"
                message = ""
                icon = <IconCheck className="Icon" />
                color = "green"

                ToasterMessage(id, title, message, icon, color)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    const LikeOrDislike = async (projectId, type) => {
        const LikeOrDislikeEP = `projects/${projectId}/${type}`
        await api.post(LikeOrDislikeEP).then((result) => {
            const Status = result.status

            if(Status === 200){
                id = type === "like" ? "ProjectLiked" : "ProjectDisliked",
                title= type === "like" ? `You liked ${ActiveProject.Title}` : `You disliked ${ActiveProject.Title}`
                message = ""
                icon = type === "like" ? <IconThumbUpFilled className="Icon" /> : <IconThumbDownFilled className="Icon" />
                color = type === "like" ? "green" : "red"

                ToasterMessage(id, title, message, icon, color)

                Embla.scrollNext()
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    
    function GetCurrentWatchedTime(){
        const Multiplier = 100
        let VideoLength = VideoOnPlayRef.current.duration.toFixed(1)
        let TimeWatched = VideoOnPlayRef.current.currentTime.toFixed(1)

        let Height = (TimeWatched / VideoLength) * Multiplier

        SetActionsHeight(Height)
    }

    useEffect(() => {
        VideoOnPlayRef?.current?.addEventListener("timeupdate", GetCurrentWatchedTime)
    
        return () => {
            VideoOnPlayRef?.current?.removeEventListener("timeupdate", GetCurrentWatchedTime)
        }
    }, [ActiveProject])
    

    const GetUserData = `${APILink}/users/me`
    const { data: User, error: UserError, isLoading: UserIsLoading } = useSWR(
        [GetUserData, Session_Token], 
        ([url, token]) => FethWithToken(url, token)
    )

    return (
        <Container fluid className="A2Page">
            {isLoading && "Loading..."}

            {Projects && 
                <>
                    <Grid>
                        <Grid.Col span="auto">
                            <Stack align="start" spacing="xl" mx="xl" sx={{ position: "sticky", top: "calc(3.75rem + 1rem)" }}>
                                <Image src={ActiveProject.Logo} width={250} />

                                <Text fz="xl" ta="justify">
                                    {ActiveProject.Description}
                                </Text>

                                <Stack>
                                    <Group align="center">
                                        <ActionIcon 
                                            size="xl" 
                                            radius="xl" 
                                            variant="outline" 
                                            className="GlobalActionButtonClass"
                                            onClick={() => AddToFavorite(ActiveProject.Id)}
                                        >
                                            <IconStar className="Icon" />
                                        </ActionIcon>

                                        <ActionIcon 
                                            size="xl" 
                                            radius="xl" 
                                            variant="outline" 
                                            className="GlobalActionButtonClass ActionsButton" 
                                            sx={{"&::before": {height: `${ActionsHeight}%`}}}
                                            onClick={() => IsVideoDone && LikeOrDislike(ActiveProject.Id, "like")}
                                        >
                                            <IconThumbUp className="Icon" />
                                        </ActionIcon>

                                        <ActionIcon 
                                            size="xl" 
                                            radius="xl" 
                                            variant="outline" 
                                            className="GlobalActionButtonClass ActionsButton" 
                                            sx={{"&::before": {height: `${ActionsHeight}%`}}}
                                            onClick={() => IsVideoDone && LikeOrDislike(ActiveProject.Id, "dislike")}
                                        >
                                            <IconThumbDown className="Icon" />
                                        </ActionIcon>
                                    </Group>

                                    <Button variant="outline" className="OutlineButton" component={Link} to={`/${ActiveProject.Id}`}>Explore</Button>
                                </Stack>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col sm={12} md={9}>
                            <Box className="VideoContainer">
                                <video src={ActiveProject.Trailer} autoPlay onEnded={() => SetIsVideoDone(true)} ref={VideoOnPlayRef} />
                                <div className="VideoOverlay" />

                                {IsVideoDone &&
                                    <Stack className="LikeAndDislikeContainer">
                                        <Text fz="xl" inline>
                                            You have <Text span fw="bolder">{User?.totalAbilities}</Text> abilities left
                                        </Text>
                                        
                                        <Group>
                                            <ActionIcon 
                                                size="xl" 
                                                radius="xl" 
                                                variant="outline" 
                                                className="GlobalActionButtonClass"
                                                sx={{ background: "var(--Violet)", borderColor: "#b3a7ff !important" }}
                                                onClick={() => IsVideoDone && LikeOrDislike(ActiveProject.Id, "like")}
                                            >
                                                <IconThumbUp className="Icon" />
                                            </ActionIcon>

                                            <ActionIcon 
                                                size="xl" 
                                                radius="xl" 
                                                variant="outline" 
                                                className="GlobalActionButtonClass"
                                                sx={{ background: "var(--Red)", borderColor: "#ffa8b1 !important" }}
                                                onClick={() => IsVideoDone && LikeOrDislike(ActiveProject.Id, "dislike")}
                                            >
                                                <IconThumbDown className="Icon" />
                                            </ActionIcon>
                                        </Group>
                                    </Stack>
                                }
                            </Box>
                        </Grid.Col>
                    </Grid>

                    <Container fluid>
                        <Stack spacing={0}>
                            <Group position="apart" sx={{ flex: 1 }}>
                                <Text fw="bolder" fz="xl">Popular</Text>

                                <Group spacing="xs">
                                    <ActionIcon size="xl" radius="xl" variant="outline">
                                        <IconSearch className="Icon" />
                                    </ActionIcon>

                                    <ActionIcon size="xl" radius="xl" variant="outline">
                                        <IconAdjustmentsHorizontal className="Icon" />
                                    </ActionIcon>
                                </Group>
                            </Group>

                            <Carousel
                                withControls={false}
                                slideSize="30%"
                                slideGap="md"
                                align="start"
                                slidesToScroll={1}
                                height={250}
                                my="xs"
                                getEmblaApi={SetEmbla}
                                onSlideChange={(i) => {
                                    SetActiveProject((current) => ({...current, 
                                        "Id": Projects?.data[i].id,
                                        "Title": Projects?.data[i].title,
                                        "Logo": Projects?.data[i].logo,
                                        "Description": Projects?.data[i].projectDescription,
                                        "Trailer": Projects?.data[i].trailer
                                    }))
                                    SetIsVideoDone(false)
                                    SetActive(i)
                                }}
                                draggable={false}
                            >
                                {Projects.data.map((project, index) => 
                                    <Carousel.Slide 
                                        key={index} 
                                        onClick={() => {
                                                SetActiveProject((current) => ({...current, 
                                                    "Id": project.id,
                                                    "Title": project.title,
                                                    "Logo": project.logo,
                                                    "Description": project.projectDescription,
                                                    "Trailer": project.trailer
                                                }))
                                                SetIsVideoDone(false)
                                                Embla.scrollNext()
                                            }
                                        }
                                    >
                                        <Card 
                                            p={0} 
                                            radius="lg" 
                                            sx={{ border: `${index === Active ? "3px" : "1px"} solid white`, height: "100%", cursor: "pointer" }}
                                            className="FeaturedVideoCard"
                                        >
                                            <Image mx="auto" radius="md" src={project.banner} alt={project.title} height={"100%"} />
                                        </Card>
                                    </Carousel.Slide>
                                )}
                            </Carousel>
                        </Stack>

                        <Stack spacing={0}>
                            <Text fz="lg">New</Text>

                            <Carousel
                                withControls={false}
                                slideSize="30%"
                                slideGap="md"
                                align="start"
                                slidesToScroll={1}
                                height={250}
                                my="xs"
                            >
                                {Projects.data.map((project, index) => 
                                    <Carousel.Slide key={index}>
                                        <Card p={0} radius="lg" sx={{ border: `${index === Active ? "3px" : "1px"} solid white`, height: "100%" }} className="FeaturedVideoCard"
                                        onClick={() => SetActive(index)}>
                                            <Image mx="auto" radius="md" src={project.banner} alt={project.title} height={"100%"} />
                                        </Card>
                                    </Carousel.Slide>
                                )}
                            </Carousel>
                        </Stack>
                    </Container>
                </>
            }
        </Container>
    )
}
