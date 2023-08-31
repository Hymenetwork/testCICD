import { ActionIcon, Box, Button, Card, Grid, Group, Input, Menu, ScrollArea, Stack, Text, Textarea, Title, createStyles, rem, useMantineTheme } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconArchive, IconCheck, IconDotsVertical, IconEdit, IconExclamationCircle, IconPencil, IconPhoto, IconPhotoCancel, IconPhotoDown, IconTrash } from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
import useSWR from "swr"
import { ConfirmationModal, DropZoneState, ImagePreview } from "../../../Components"
import { useLoading } from "../../../Hooks"
import { APILink, FethWithToken, Session_Token, ToasterMessage, api } from "../../../Utils"
import "./DashboardNews.css"

export const DashboardNews = () => {
    let id, title, message, icon, color = ""
    const { ToggleLoading } = useLoading()

    const useStyles = createStyles(() => ({
        GlobalStyle: {
            minHeight: rem(220),
            pointerEvents: "none"
        }
    }))

    const theme = useMantineTheme()
    const { classes } = useStyles()

    const [News, SetNews] = useState({
        Id: "",
        Title: "",
        Description: "",
        Image: []
    })

    const [ProjectID, SetProjectID] = useState()
    const [IsDeleteNewsOpened, SetIsDeleteNewsOpened] = useState(false)
    const [IsArchiveNewsOpened, SetIsArchiveNewsOpened] = useState(false)
    const [IsEditing, SetIsEditing] = useState(false)
    const ChangeNewsImageRef = useRef()

    useEffect(() => {
        GetMyProject()
    }, [])
    
    const GetMyProject = async () => {
        const GetMyProjectEP = `/projects/myProject`
        await api.get(GetMyProjectEP).then((result) => {
            const Data = result.data
            const Status = result.status

            if(Status === 200){
                SetProjectID(Data.id)
            }
        }).catch((error) => {
            const Status = error.response.status

            if(Status === 401){
                localStorage.removeItem("HYME_SESS_TK")
                window.location.reload()
            }
            
            if(Status === 404){
                SetIsProjectExist(false)
            }
            console.log(error)
        })
    }

    const GetNewsEP = `${APILink}/projects/${ProjectID}/posts`
    const { data: NewsData, error, mutate } = useSWR(
        ProjectID ? [GetNewsEP, Session_Token] : null, 
        ([url, token]) => FethWithToken(url, token)
    )

    if(error) console.log(error)

    const PublishNews = async (projectId) => {
        const PublishNewsEP = `/projects/${projectId}/posts`

        const Title = News.Title
        const Description = News.Description
        const Image = News.Image[0]

        if(Title !== "" && Description !== "" && News.Image.length > 0){
            ToggleLoading(true)
            const FD = new FormData()
            FD.append("title", Title)
            FD.append("description", Description)
            FD.append("image", Image, Image.name)
    
            await api.post(PublishNewsEP, FD).then((result) => {
                const Status = result.status
                
                if(Status === 201){
                    id = "NewsPublished"
                    title= "News Published"
                    message = "You successfully published a news"
                    icon = <IconCheck className="Icon" />
                    color = "green"

                    ToasterMessage(id, title, message, icon, color)
                    ClearNewsData()
                    mutate()
                }

                ToggleLoading(false)
            }).catch((error) => {
                ToggleLoading(false)
                const Status = error.response.status

                if(Status === 401){
                    localStorage.removeItem("HYME_SESS_TK")
                    window.location.reload()
                }
                
                console.log(error)
            })
        }else{
            id = "EmptyFields"
            title= ""
            message = `Please fill out all fields to publish news`
            icon = <IconExclamationCircle className="Icon" />
            color = "red"

            ToasterMessage(id, title, message, icon, color)
        }
    }

    const SaveChanges = async (newsId) => {
        const SaveChangesEP = `/posts/${newsId}`
        
        const Title = News.Title
        const Description = News.Description

        if(Title !== "" && Description !== ""){
            ToggleLoading(true)
            
            await api.put(SaveChangesEP, {
                "title": Title,
                "description": Description
            }).then((result) => {
                const Status = result.status

                if(Status === 204){
                    id = "NewsEdited"
                    title= "News Updated"
                    message = "You successfully updated a news"
                    icon = <IconCheck className="Icon" />
                    color = "green"

                    ToasterMessage(id, title, message, icon, color)
                    ClearNewsData()
                    mutate()
                }
                ToggleLoading(false)
            }).catch((error) => {
                ToggleLoading(false)
                const Status = error.response.status

                if(Status === 401){
                    localStorage.removeItem("HYME_SESS_TK")
                    window.location.reload()
                }

                console.log(error)
            })
        }else{
            id = "EmptyFields"
            title= ""
            message = `Please fill out all fields to update news`
            icon = <IconExclamationCircle className="Icon" />
            color = "red"

            ToasterMessage(id, title, message, icon, color)
        }
    }

    const ArchiveNews = async (newsId) => {
        ToggleLoading(true)

        const ArchiveNewsEP = `/posts/${newsId}/archive`
        await api.put(ArchiveNewsEP).then((result) => {
            const Status = result.status

            if(Status === 204){
                id = "NewsArchived"
                title= "News Archived"
                message = "You successfully archived a news"
                icon = <IconCheck className="Icon" />
                color = "green"

                ToasterMessage(id, title, message, icon, color)
                ClearNewsData()
                mutate()
            }
            ToggleLoading(false)
        }).catch((error) => {
            ToggleLoading(false)

            const Status = error.response.status

            if(Status === 401){
                localStorage.removeItem("HYME_SESS_TK")
                window.location.reload()
            }

            console.log(error)
        })
    }

    const DeleteNews = async (newsId) => {
        ToggleLoading(true)

        const DeleteNewsEP = `/posts/${newsId}`
        await api.delete(DeleteNewsEP).then((result) => {
            const Status = result.status

            if(Status === 204){
                id = "NewsDeleted"
                title= "News Deleted"
                message = "You successfully deleted a news"
                icon = <IconCheck className="Icon" />
                color = "green"

                ToasterMessage(id, title, message, icon, color)
                ClearNewsData()
                mutate()
            }
            ToggleLoading(false)
        }).catch((error) => {
            ToggleLoading(false)

            const Status = error.response.status

            if(Status === 401){
                localStorage.removeItem("HYME_SESS_TK")
                window.location.reload()
            }

            console.log(error)
        })
    }

    const CancelEditing = () => {
        ClearNewsData()
    }

    const ClearNewsData = () => {
        SetIsEditing(false)
        SetNews({
            Id: "",
            Title: "",
            Description: "",
            Image: []
        })
    }

    return (
        <Box className="DashboardNewsPage">
            <Stack>
                <Title order={3}>Publish News</Title>

                <Grid align={NewsData?.data.length === 0 && "center"}>
                    <Grid.Col sm={12} md="auto">
                        <Stack spacing="xs">
                            <Stack spacing="xs">
                                <Text>Title</Text>
                                <Input className="Hyme-Form-Element" value={News.Title} onChange={(e) => SetNews(current => ({...current, Title: e.target.value}))} />
                            </Stack>

                            <Stack spacing="xs">
                                <Text>Description</Text>
                                <Textarea autosize minRows={3} maxLength={500} placeholder="Maximum of 500 characters..." className="Hyme-Form-Element" value={News.Description} onChange={(e) => SetNews(current => ({...current, Description: e.target.value}))} />
                            </Stack>

                            <Stack spacing="xs">
                                <Text>News Image</Text>

                                {News.Image.length > 0 
                                    ?
                                        <Stack className="Filled">
                                            <ImagePreview File={News.Image} HasData={IsEditing} Size={"100%"} />

                                            <Group spacing="xs" position="right">
                                                <ActionIcon variant="filled" color="blue" radius="xl" size="lg" 
                                                    onClick={() => ChangeNewsImageRef.current()}
                                                >
                                                    <IconPencil className="Icon" />
                                                </ActionIcon>

                                                <ActionIcon variant="filled" color="red" radius="xl" size="lg" 
                                                    onClick={() => SetNews(current => ({...current, Image: []}))}
                                                >
                                                    <IconTrash className="Icon" />
                                                </ActionIcon>
                                            </Group>
                                        </Stack>
                                    :
                                        <Dropzone
                                            openRef={ChangeNewsImageRef}
                                            onDrop={(files) => SetNews(current => ({...current, Image: files}))}
                                            maxSize={3 * 1024 ** 2}
                                            maxFiles={1}
                                            multiple={false}
                                            accept={IMAGE_MIME_TYPE}
                                            className="CustomStylingForDropZone"
                                        >
                                            <Group position="center" className={classes.GlobalStyle}>
                                                <Dropzone.Idle>
                                                    <DropZoneState 
                                                        Icon={<IconPhoto size="3.2rem" stroke={1.5} />}
                                                        Caption="Drag your news image here or click to select file"
                                                        SubCaption="Only *.jpeg and *.png will be accepted!"
                                                    />
                                                </Dropzone.Idle>

                                                <Dropzone.Accept>
                                                    <DropZoneState 
                                                        Icon={<IconPhotoDown size="3.2rem" stroke={1.5} color={theme.colors[theme.primaryColor][4]} />}
                                                        SubCaption="That seems good, let's drop it!"
                                                        Color={theme.colors[theme.primaryColor][4]}
                                                    />
                                                </Dropzone.Accept>

                                                <Dropzone.Reject>
                                                    <DropZoneState 
                                                        Icon={<IconPhotoCancel size="3.2rem" stroke={1.5} color={theme.colors.red[6]} />}
                                                        SubCaption="The file you trying to upload is not accepted!"
                                                        Color={theme.colors.red[6]}
                                                    />
                                                </Dropzone.Reject>
                                            </Group>
                                        </Dropzone>
                                }
                            </Stack>

                            <Group position="right">
                                {IsEditing 
                                    ?
                                        <Group spacing="xs">
                                            <Button className="PrimaryButton" onClick={() => SaveChanges(News.Id)}>Save Changes</Button>
                                            <Button color="red" onClick={() => CancelEditing()}>Cancel</Button>
                                        </Group>
                                    :
                                        <Button className="PrimaryButton" onClick={() => PublishNews(ProjectID)}>Publish</Button>
                                }
                            </Group>
                        </Stack>
                    </Grid.Col>
                    
                    <Grid.Col sm={12} md="auto">
                        {NewsData?.data.length > 0
                            ?
                                <Card className="HYMECard" radius="md">
                                    <ScrollArea.Autosize mah={600} offsetScrollbars>
                                        <Stack spacing="xs" mr="md">
                                            {NewsData?.data.map((news, index) => 
                                                <Card radius="md" key={index}>
                                                    <Group noWrap align="start" position="apart">
                                                        <Stack spacing={0}>
                                                            <Text fz="md" fw="bolder">{news.title}</Text>
                                                            <Text fz="xs">{news.description}</Text>
                                                        </Stack>

                                                        <Menu
                                                            transitionProps={{ transition: 'pop' }}
                                                            withArrow
                                                            position="bottom-end"
                                                            withinPortal
                                                        >
                                                            <Menu.Target>
                                                                <ActionIcon radius="xl">
                                                                    <IconDotsVertical className="Icon" />
                                                                </ActionIcon>
                                                            </Menu.Target>

                                                            <Menu.Dropdown>
                                                                <Menu.Item icon={<IconEdit className="Icon" />}
                                                                    onClick={() => {
                                                                        SetIsEditing(true)
                                                                        SetNews({
                                                                            Id: news.id,
                                                                            Title: news.title,
                                                                            Description: news.description,
                                                                            Image: news.image
                                                                        })
                                                                    }}
                                                                >
                                                                    Edit
                                                                </Menu.Item>

                                                                <Menu.Item icon={<IconArchive className="Icon" />}
                                                                    onClick={() => {
                                                                        SetIsArchiveNewsOpened(true)
                                                                        SetNews(current => ({...current, Id: news.id}))
                                                                    }}
                                                                >
                                                                    Archive
                                                                </Menu.Item>

                                                                <Menu.Item icon={<IconTrash className="Icon" />} color="red" 
                                                                    onClick={() => {
                                                                        SetIsDeleteNewsOpened(true)
                                                                        SetNews(current => ({...current, Id: news.id}))
                                                                    }}
                                                                >
                                                                    Delete
                                                                </Menu.Item>
                                                            </Menu.Dropdown>
                                                        </Menu>
                                                    </Group>
                                                </Card>
                                            )}
                                        </Stack>
                                    </ScrollArea.Autosize>
                                </Card>
                            :
                                <Title order={1} ta="center">You have no published news yet</Title>
                        }
                    </Grid.Col>
                </Grid>
            </Stack>

            <ConfirmationModal 
                isOpen={IsDeleteNewsOpened}
                closeModal={() => SetIsDeleteNewsOpened(false)}
                modalTitle="Confirmation to delete this news"
                modalDescription="Are you sure you want to delete this news?"
                callBackAction={() => {SetIsDeleteNewsOpened(false); DeleteNews(News.Id)}}
                label="Yes, delete it"
            />

            <ConfirmationModal 
                isOpen={IsArchiveNewsOpened}
                closeModal={() => SetIsArchiveNewsOpened(false)}
                modalTitle="Confirmation to archive this news"
                modalDescription="Are you sure you want to archive this news?"
                callBackAction={() => {SetIsArchiveNewsOpened(false); ArchiveNews(News.Id)}}
                label="Yes, archive it"
            />
        </Box>
    )
}
