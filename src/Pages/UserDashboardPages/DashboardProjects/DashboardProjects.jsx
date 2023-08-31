import { useEffect, useRef, useState } from "react";

import { ActionIcon, Badge, Box, Button, Card, Divider, Grid, Group, Image, Input, Loader, MediaQuery, Menu, Modal, MultiSelect, Overlay, RangeSlider, Stack, Tabs, Text, Textarea, Title, createStyles, rem, useMantineTheme } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, MIME_TYPES } from '@mantine/dropzone';

import { IconArchive, IconBellRinging, IconCheck, IconCirclePlus, IconDotsVertical, IconEdit, IconLink, IconPencil, IconPencilPlus, IconPhoto, IconPhotoCancel, IconPhotoDown, IconTrash, IconVideo } from '@tabler/icons-react';

import { createFFmpeg } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: import.meta.env.VITE_APP_APP_MODE === "development" && true });

import { BadgeColorSetter, BadgeLabelSetter, ConfirmationModal, DropZoneState, ImagePreview, VideoConversionButton, VideoPlayer, VideoPreview, VideoUpload } from "../../../Components";
import { APILink, ConvertToBase64, FethWithToken, Session_Token, SliderValueToVideoTime, ToasterMessage, api } from "../../../Utils";

import { BigPlayButton, ControlBar, LoadingSpinner, PlayToggle, Player } from "video-react";
import "video-react/dist/video-react.css";

import useSWR from "swr";

import "./DashboardProjects.css";

const useStyles = createStyles(() => ({
    GlobalStyle: {
        minHeight: rem(220),
        pointerEvents: "none"
    }
}))

export const DashboardProjects = () => {
    let id, title, message, icon, color, hasRedirect, redirectLocation = ""

    const { classes, cx } = useStyles();
    const theme = useMantineTheme();

    const [ActiveTab, SetActiveTab] = useState("General")
    const [IsProjectExist, SetIsProjectExist] = useState(false)
    
    const [IsUploadNewLogoModalOpened, SetIsUploadNewLogoModalOpened] = useState(false)
    const [IsUploadNewBannerModalOpened, SetIsUploadNewBannerModalOpened] = useState(false)
    const [IsUploadHighlightVideoModalOpened, SetIsUploadHighlightVideoModalOpened] = useState(false)
    const [IsAddTokenModalOpened,SetIsAddTokenModalOpened] = useState(false)
    const [IsAddNFTModalOpened, SetIsAddNFTModalOpened] = useState(false)
    const [IsDeleteNFTModalOpened, SetIsDeleteNFTModalOpened] = useState(false)
    const [IsArchiveNFTModalOpened, SetIsArchiveNFTModalOpened] = useState(false)
    
    const [IsRejectMessagesModalOpened, SetIsRejectMessagesModalOpened] = useState(false)

    let NFTObject = {}
    let NFTObject2 = {}
    const [NFTArray, SetNFTArray] = useState([])
    const [NFTArray2, SetNFTArray2] = useState([])
    const [NFTData, SetNFTData] = useState({
        "title": "",
        "description": "",
        "imageFileName": "",
        "image": "",
        "url": ""
    })
    const [NFTCategories, SetNFTCategories] = useState([])
    const [IsChangingNFTData, SetIsChangingNFTData] = useState(false)
    const [IndexOfNFT, SetIndexOfNFT] = useState()

    const [NFTId, SetNFTId] = useState()
    const [NFTs, SetNFTs] = useState()

    console.log("NFT Array 1 ", NFTArray)
    console.log("NFT Array 2 ", NFTArray2)
    // console.log(NFTData)

    const ChangeLogoRef = useRef()
    const ChangeBannerRef = useRef()
    const ChangeStoryMediaRef = useRef()
    const ChangeNFTImageRef = useRef()

    const ChangeTab = (tab) => {
        SetActiveTab(tab)
        localStorage.setItem("ActiveTab", tab)
        
        if(ActiveTab !== tab){
            if(tab === "NFT") IsProjectExist && GetNFTs()
        }
    }
    
    const [IsUploadingNewLogo, setIsUploadingNewLogo] = useState(true)
    const [IsUploadingNewBanner, setIsUploadingNewBanner] = useState(true)
    const [IsUploadingNewHighlightVideo, setIsUploadingNewHighlightVideo] = useState(true)

    const [ffmpegLoaded, setFFmpegLoaded] = useState(false)
    const [videoFile, setVideoFile] = useState()
    const [videoPlayerState, setVideoPlayerState] = useState()
    const [videoPlayer, setVideoPlayer] = useState()
    const [sliderValues, setSliderValues] = useState([0, 100])
    const [processing, setProcessing] = useState(false)
    const [trimmedVideo, setTrimmedVideo] = useState()
    const [resultFile, setResultFile] = useState()

    useEffect(() => {
        GetMyProject()
    }, [])

    //! Get My Project
    const GetMyProject = async () => {
        const GetMyProjectEP = `/projects/myProject`
        await api.get(GetMyProjectEP).then((result) => {
            const Data = result.data
            const Status = result.status

            console.log(Data)

            if(Status === 200){
                SetIsProjectExist(true)
                Data.logo && setIsUploadingNewLogo(false)
                Data.banner && setIsUploadingNewBanner(false)
                Data.trailer && setIsUploadingNewHighlightVideo(false)

                setData([{
                    ProjectID: Data.id,
                    ProjectTitle: Data.title,
                    ShortDescription: Data.shortDescription,
                    Logo: Data.logo,
                    Banner: Data.banner,
                    HighlightVideo: Data.trailer,
                    StoryDescription: Data.storyDescription,
                    StoryMedia: Data.medias[0].name,
                    ProjectStatus: Data.status
                }])
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

    const [Data, setData] = useState([{
        ProjectID: "",
        ProjectTitle: "",
        ShortDescription: "",
        Logo: [],
        Banner: [],
        HighlightVideo: [],
        StoryDescription: "",
        StoryMedia: [],
        ProjectStatus: ""
    }])
    const Datas = Object.assign({}, ...Data)
    
    // console.log(Datas)
    // console.log(Object.values(Datas).some(x => x === null || x === ''))

    const ID = Datas.ProjectID
    const [Base64Logo, SetBase64Logo] = useState()
    const [Base64Banner, SetBase64Banner] = useState()
    const [Base64Trailer, SetBase64Trailer] = useState()
    const [Base64StoryMedia, SetBase64StoryMedia] = useState()
    const [Base64NFTImage, SetBase64NFTImage] = useState()

    const SubmitProject = async () => {
        const ProjectTitle = Datas.ProjectTitle
        const ShortDescription = Datas.ShortDescription
        const Logo = Datas.Logo[0]
        const Banner = Datas.Banner[0]
        const HighlightVideo = Datas.HighlightVideo[0]
        const StoryDescription = Datas.StoryDescription
        const StoryMedia = Datas.StoryMedia[0]

        const SubmitProjectEP = `/projects`
        await api.post(SubmitProjectEP, {
            "title": ProjectTitle,
            "logo": Base64Logo,
            "logoFileName": Logo.name,
            "banner": Base64Banner,
            "bannerFileName": Banner.name,
            "trailer": Base64Trailer,
            "trailerFileName": HighlightVideo.name,
            "shortDescription": ShortDescription,
            "projectDescription": ShortDescription,
            "storyDescription": StoryDescription,
            "medias": [
                {
                    "mediaFilename": StoryMedia.name,
                    "media": Base64StoryMedia,
                    "type": 1
                }
            ],
            "nfTs": NFTArray2,
            "chains": [
                {
                    "walletAddress": "",
                    "graphAPIKey": ""
                }
            ]
        }).then((result) => {
            const Status = result.status
            console.log(result)

            if(Status === 201){
                id = "ProjectSubmitted"
                title= "Your project has been successfully submitted"
                message = ""
                icon = <IconCheck className="Icon" />
                color = "green"

                ToasterMessage(id, title, message, icon, color)
                GetMyProject()
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    //! Update
    const UpdateLogo = async () => {
        const UpdateLogoEP = `/projects/${ID}/logo`
        const Logo = Datas.Logo[0]
        
        const FDLogo = new FormData()
        FDLogo.append("image", Logo, Logo.name)

        await api.put(UpdateLogoEP, FDLogo).then((result) => {
            const Status = result.status

            if(Status === 204){
                GetMyProject()
                SetIsUploadNewLogoModalOpened(current => !current)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    const UpdateBanner = async () => {
        const UpdateBannerEP = `/projects/${ID}/banner`
        const Banner = Datas.Banner[0]
        
        const FDBanner = new FormData()
        FDBanner.append("image", Banner, Banner.name)

        await api.put(UpdateBannerEP, FDBanner).then((result) => {
            const Status = result.status

            if(Status === 204){
                GetMyProject()
                SetIsUploadNewBannerModalOpened(current => !current)
                
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    const UpdateTrailer = async (trailer) => {
        const UpdateTrailerEP = `/projects/${ID}/trailer`

        const FDVideo = new FormData()
        FDVideo.append("video", trailer[0], trailer[0].name)

        await api.put(UpdateTrailerEP, FDVideo).then((result) => {
            const Status = result.status

            if(Status === 204){
                GetMyProject()
                SetIsUploadHighlightVideoModalOpened(current =>!current)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    //! Video Trimming Start Here
    const UploadTrailer = () => {
        if(ffmpeg.isLoaded()){
            SetIsUploadHighlightVideoModalOpened(current =>!current)
        }else{
            ffmpeg.load().then(() => {
                setFFmpegLoaded(true)
                SetIsUploadHighlightVideoModalOpened(current =>!current)
            })
        }
    }

    //! When user changing the slider
    useEffect(() => {
        const min = sliderValues[0]
        if (min !== undefined && videoPlayerState && videoPlayer) {
            videoPlayer.seek(SliderValueToVideoTime(videoPlayerState.duration, min))
        }
    }, [sliderValues])

    //! Allowing the users to watch only the portion of the video selected by the slider
    useEffect(() => {
        if (videoPlayer && videoPlayerState) {
            const [min, max] = sliderValues

            const minTime = SliderValueToVideoTime(videoPlayerState.duration, min)
            const maxTime = SliderValueToVideoTime(videoPlayerState.duration, max)

            if (videoPlayerState.currentTime < minTime) {
                videoPlayer.seek(minTime)
            }

            if (videoPlayerState.currentTime > maxTime) {
                videoPlayer.seek(minTime)
            }
        }
    }, [videoPlayerState])

    //! When the current videoFile is removed, restore the default states
    useEffect(() => {
        if (!videoFile) {
            setVideoPlayerState(undefined)
            setSliderValues([0, 100])
            setTrimmedVideo(undefined)
        }
    }, [videoFile])

    //! Reject Messages
    const GetProjectRejectMessagesEP = `${APILink}/projects/${ID}/messages`
    const { data: RejectMessages } = useSWR(
        ID ? [GetProjectRejectMessagesEP, Session_Token] : null, 
        ([url, token]) => FethWithToken(url, token)
    )

    //! Get NFTs
    const GetNFTs = async () => {
        const GetNFTsEP = `/projects/${ID}/nfts`

        await api.get(GetNFTsEP).then((result) => {
            const Data = result.data.data
            SetNFTs(Data)
        }).catch((error) => {
            console.log(error)
        })
    }

    const ArchiveNFT = async (nftId) => {
        const ArchiveNFTEP = `/nfts/${nftId}/archive`
        await api.put(ArchiveNFTEP).then((result) => {
            const Status = result.status

            if(Status === 204){
                id = "NFTArchived"
                title= "NFT Archived"
                message = "You successfully archived your NFT"
                icon = <IconCheck className="Icon" />
                color = "green"

                ToasterMessage(id, title, message, icon, color)
                GetNFTs()
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    const DeleteNFT = async (nftId) => {
        const DeleteNFTEP = `/nfts/${nftId}`
        await api.delete(DeleteNFTEP).then((result) => {
            const Status = result.status

            if(Status === 204){
                id = "NFTDeleted"
                title= "NFT Deleted"
                message = "You successfully deleted your NFT"
                icon = <IconCheck className="Icon" />
                color = "green"

                ToasterMessage(id, title, message, icon, color)
                GetNFTs()
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <Box className="DashboardProjectsPage">
            <Tabs value={ActiveTab} variant="pills" onTabChange={ChangeTab}>
                <Group position="apart" align="start">
                    <Tabs.List>
                        <Tabs.Tab value="General">General</Tabs.Tab>
                        <Tabs.Tab value="The Story">The Story</Tabs.Tab>
                        <Tabs.Tab value="Token">Token</Tabs.Tab>
                        <Tabs.Tab value="NFT">NFT</Tabs.Tab>
                    </Tabs.List>
                    
                    {IsProjectExist && 
                        <Group spacing="xs">
                            <Text fw="bolder">Status:</Text>
                            <Badge variant="light" size="xl" color={BadgeColorSetter(Datas.ProjectStatus)}>
                                <BadgeLabelSetter Status={Datas.ProjectStatus} />
                            </Badge>
                            
                            {(RejectMessages && RejectMessages.length !== 0) &&
                                <ActionIcon variant="filled" color="red" radius="xl" onClick={() => SetIsRejectMessagesModalOpened(current =>!current)} >
                                    <IconBellRinging className="Icon" />
                                </ActionIcon>
                            }
                        </Group>
                    }

                    {!IsProjectExist &&
                        <Button className="GradientButton" size="md" onClick={() => SubmitProject()}>
                            Submit
                        </Button>
                    }
                </Group>

                <Stack my="xl" className="HymeCMSForm">
                    <MediaQuery smallerThan="sm" styles={{ width: "100%" }}>
                        <Divider my="xs" label={<Title order={3} className="TabTitle">{ActiveTab}</Title>} size="xl" w="50%" />
                    </MediaQuery>

                    <Tabs.Panel value="General">
                        <Stack>
                            <Grid>
                                <Grid.Col sm={12} md="auto">
                                    <Stack spacing="xs">
                                        <Text>Project Title</Text>

                                        <Input 
                                            className="Hyme-Form-Element" 
                                            value={Datas.ProjectTitle} 
                                            onChange={(e) =>  setData(([current]) => [{...current, ProjectTitle: e.target.value}])} 
                                            onBlur={(e) => console.log(e.target.value)} 
                                        />
                                    </Stack>
                                </Grid.Col>

                                <Grid.Col sm={12} md="auto">
                                    <Stack spacing="xs">
                                        <Text>Short Description</Text>

                                        <Textarea autosize minRows={3} maxLength={500} placeholder="Maximum of 500 characters..." className="Hyme-Form-Element" value={Datas.ShortDescription} onChange={(e) =>  setData(([current]) => [{...current, ShortDescription: e.target.value}])} />
                                    </Stack>
                                </Grid.Col>
                            </Grid>

                            <Grid>
                                <Grid.Col sm={12} md="auto">
                                    <Stack spacing="xs">
                                        <Text>Logo</Text>
                                        {IsProjectExist 
                                            ?
                                                <Stack align="center" justify="center" className="Filled" sx={{ position: "relative" }}>
                                                    <ImagePreview File={Datas.Logo} HasData={true} />

                                                    <Group sx={{ position: "absolute", top: 10, right: 10 }}>
                                                        <ActionIcon variant="filled" color="blue" radius="xl" size="lg" 
                                                            onClick={() => {
                                                                SetIsUploadNewLogoModalOpened(current => !current)
                                                                setData(([current]) => [{...current, Logo: ""}])
                                                            }}
                                                        >
                                                            <IconPencil className="Icon" />
                                                        </ActionIcon>
                                                    </Group>
                                                </Stack>
                                                
                                            :
                                                Datas.Logo.length > 0 
                                                    ? 
                                                        <Stack align="center" justify="center" className="Filled" sx={{ position: "relative" }}>
                                                            <ImagePreview File={Datas.Logo} HasData={false} />

                                                            <Group spacing="xs" sx={{ position: "absolute", top: 10, right: 10 }}>
                                                                <ActionIcon variant="filled" color="blue" radius="xl" size="lg" 
                                                                    onClick={() => ChangeLogoRef.current()}
                                                                >
                                                                    <IconPencil className="Icon" />
                                                                </ActionIcon>

                                                                <ActionIcon variant="filled" color="red" radius="xl" size="lg" 
                                                                    onClick={() => setData(([current]) => [{...current, Logo: []}])}
                                                                >
                                                                    <IconTrash className="Icon" />
                                                                </ActionIcon>
                                                            </Group>
                                                        </Stack>
                                                    :
                                                        <Dropzone
                                                            openRef={ChangeLogoRef}
                                                            onDrop={(files) => {
                                                                setData(([current]) => [{...current, Logo: files}]);
                                                                ConvertToBase64(files[0], SetBase64Logo)
                                                            }}
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
                                                                        Caption="Drag your logo here or click to select file"
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
                                </Grid.Col>

                                <Grid.Col sm={12} md="auto">
                                    <Stack spacing="xs">
                                        <Text>Banner Image</Text>
                                        {IsProjectExist
                                            ?
                                                <Stack align="center" justify="center" className="Filled" sx={{ position: "relative" }}>
                                                    <ImagePreview File={Datas.Banner} HasData={true} />

                                                    <Group sx={{ position: "absolute", top: 10, right: 10 }}>
                                                        <ActionIcon variant="filled" color="blue" radius="xl" size="lg" 
                                                            onClick={() => {
                                                                SetIsUploadNewBannerModalOpened(current => !current)
                                                                setData(([current]) => [{...current, Banner: ""}])
                                                            }}
                                                        >
                                                            <IconPencil className="Icon" />
                                                        </ActionIcon>
                                                    </Group>
                                                </Stack>
                                            :
                                                Datas.Banner.length > 0 
                                                    ? 
                                                        <Stack align="center" justify="center" className="Filled" sx={{ position: "relative" }}>
                                                            <ImagePreview File={Datas.Banner} HasData={false} />

                                                            <Group spacing="xs" sx={{ position: "absolute", top: 10, right: 10 }}>
                                                                <ActionIcon variant="filled" color="blue" radius="xl" size="lg" 
                                                                    onClick={() => ChangeBannerRef.current()}
                                                                >
                                                                    <IconPencil className="Icon" />
                                                                </ActionIcon>

                                                                <ActionIcon variant="filled" color="red" radius="xl" size="lg" 
                                                                    onClick={() => setData(([current]) => [{...current, Banner: []}])}
                                                                >
                                                                    <IconTrash className="Icon" />
                                                                </ActionIcon>
                                                            </Group>
                                                        </Stack>
                                                    :
                                                        <Dropzone
                                                            openRef={ChangeBannerRef}
                                                            onDrop={(files) => {
                                                                setData(([current]) => [{...current, Banner: files}]);
                                                                ConvertToBase64(files[0], SetBase64Banner)
                                                            }}
                                                            maxSize={3 * 1024 ** 2}
                                                            accept={IMAGE_MIME_TYPE}
                                                            className="CustomStylingForDropZone"
                                                        >
                                                            <Group position="center" className={classes.GlobalStyle}>
                                                                <Dropzone.Idle>
                                                                    <DropZoneState 
                                                                        Icon={<IconPhoto size="3.2rem" stroke={1.5} />}
                                                                        Caption="Drag your banner image here or click to select file"
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
                                </Grid.Col>

                                <Grid.Col sm={12} md="auto">
                                    <Stack spacing="xs">
                                        <Text>Highlight Video</Text>
                                        {IsProjectExist
                                            ?
                                                <Stack align="center" justify="center" className="Filled" sx={{ position: "relative" }}>
                                                    <VideoPreview File={Datas.HighlightVideo} HasData={true} />

                                                    <Group sx={{ position: "absolute", top: 10, right: 10 }}>
                                                        <ActionIcon variant="filled" color="blue" radius="xl" size="lg" 
                                                            onClick={() => {
                                                                setData(([current]) => [{...current, HighlightVideo: []}])
                                                                UploadTrailer()
                                                            }}
                                                        >
                                                            <IconPencil className="Icon" />
                                                        </ActionIcon>
                                                    </Group>
                                                </Stack>
                                            :

                                                Datas.HighlightVideo.length > 0 
                                                ? 
                                                    <Stack align="center" justify="center" className="Filled">
                                                        <VideoPreview File={Datas.HighlightVideo} HasData={false} />

                                                        <Button 
                                                            color="red" 
                                                            onClick={() => {
                                                                setData(([current]) => [{...current, HighlightVideo: []}])
                                                                UploadTrailer()
                                                            }}
                                                        >
                                                            Remove & Change
                                                        </Button>
                                                    </Stack>
                                                :
                                                    <Stack align="center" justify="center" className="AddItem" p={16} onClick={() => UploadTrailer()}>
                                                        <Group position="center" className={classes.GlobalStyle}>
                                                            <DropZoneState 
                                                                Icon={<IconVideo size="3.2rem" stroke={1.5} />}
                                                                Caption="Upload and Trim your 20 seconds trailer"
                                                                SubCaption="Only *.mp4 will be accepted!"
                                                            />
                                                        </Group>
                                                    </Stack>

                                        }
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="The Story">
                        <Stack>
                            <Grid>
                                <Grid.Col sm={12} md={6}>
                                    <Stack spacing="xs">
                                        <Text>Description</Text>

                                        <Textarea 
                                            autosize 
                                            minRows={3} 
                                            maxLength={500} 
                                            placeholder="Maximum of 500 characters..." 
                                            className="Hyme-Form-Element"
                                            value={Datas.StoryDescription} 
                                            onChange={(e) =>  setData(([current]) => [{...current, StoryDescription: e.target.value}])} 
                                        />
                                    </Stack>
                                </Grid.Col>
                            </Grid>

                            <Grid>
                                <Grid.Col sm={12} md="auto">
                                    <Stack spacing="xs">
                                        <Text>Media Gallery</Text>
                                        {IsProjectExist 
                                            ?
                                                <Stack align="center" justify="center" className="Filled" sx={{ position: "relative" }}>
                                                    <VideoPreview File={Datas.StoryMedia} HasData={true} />

                                                    <Group sx={{ position: "absolute", top: 10, right: 10 }}>
                                                        <ActionIcon variant="filled" color="blue" radius="xl" size="lg" 
                                                            onClick={() => {
                                                                console.log("editing...")
                                                                // setData(([current]) => [{...current, HighlightVideo: []}])
                                                                // UploadTrailer()
                                                            }}
                                                        >
                                                            <IconPencil className="Icon" />
                                                        </ActionIcon>
                                                    </Group>
                                                </Stack>
                                            :
                                                Datas.StoryMedia.length > 0 
                                                ? 
                                                    <Stack align="center" justify="center" className="Filled" sx={{ position: "relative" }}>
                                                        <VideoPreview File={Datas.StoryMedia} HasData={false} />

                                                        <Group spacing="xs" sx={{ position: "absolute", top: 10, right: 10 }}>
                                                            <ActionIcon variant="filled" color="blue" radius="xl" size="lg" 
                                                                onClick={() => ChangeStoryMediaRef.current()}
                                                            >
                                                                <IconPencil className="Icon" />
                                                            </ActionIcon>

                                                            <ActionIcon variant="filled" color="red" radius="xl" size="lg" 
                                                                onClick={() => setData(([current]) => [{...current, StoryMedia: []}])}
                                                            >
                                                                <IconTrash className="Icon" />
                                                            </ActionIcon>
                                                        </Group>
                                                    </Stack>
                                                :
                                                    <Dropzone
                                                        openRef={ChangeStoryMediaRef}
                                                        onDrop={(files) => {
                                                            const File = files[0]
                                                            const Reader = new FileReader()
                                                            Reader.onload = () => {
                                                                const aud = new Audio(Reader.result)
                                                                aud.onloadedmetadata = () => {
                                                                    // const Duration = Math.round(aud.duration)
                                                                    const Duration = Math.round(aud.duration)-1
                                                                    console.log(Duration)
                                                                    if(Duration !== 80){
                                                                        alert("Video is not 1min. & 20 sec.")
                                                                    }else{
                                                                        setData(([current]) => [{...current, StoryMedia: files}])
                                                                        ConvertToBase64(files[0], SetBase64StoryMedia)
                                                                    }
                                                                }
                                                            }
                                                            Reader.readAsDataURL(File)
                                                        }}
                                                        maxFiles={1}
                                                        multiple={false}
                                                        accept={[MIME_TYPES.mp4]}
                                                        className="CustomStylingForDropZone"
                                                    >
                                                        <Group position="center" className={classes.GlobalStyle}>
                                                            <Dropzone.Idle>
                                                                <DropZoneState 
                                                                    Icon={<IconVideo size="3.2rem" stroke={1.5} />}
                                                                    Caption="Drag your media video here or click to select file"
                                                                    SubCaption="Only *.mp4 will be accepted!"
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
                                </Grid.Col>
                            </Grid>
                        </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="Token">
                        <Stack>
                            <Grid>
                                <Grid.Col sm={12} md={4} onClick={() => SetIsAddTokenModalOpened(current => !current)}>
                                    <Stack align="center" justify="center" className="AddItem">
                                        <IconCirclePlus size="3.2rem" stroke={1.5} />
                                        <Text ta="center" inline c="dimmed"> Add Token</Text>
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="NFT">
                        <Stack>
                            <Grid>
                                {NFTs?.map((nft, index) => 
                                    <Grid.Col sm={12} md={4} key={index}>
                                        <Stack className="Filled">
                                            <ImagePreview File={nft.image} HasData={true} Size={"100%"} />

                                            <Group position="apart">
                                                <Text fz="sm">{nft.title}</Text>

                                                <Menu
                                                    transitionProps={{ transition: 'pop' }}
                                                    withArrow
                                                    position="left-start"
                                                    withinPortal
                                                >
                                                    <Menu.Target>
                                                        <ActionIcon radius="xl">
                                                            <IconDotsVertical className="Icon" />
                                                        </ActionIcon>
                                                    </Menu.Target>

                                                    <Menu.Dropdown>
                                                        <Menu.Item icon={<IconEdit className="Icon" />}>Edit</Menu.Item>

                                                        <Menu.Item icon={<IconArchive className="Icon" />}
                                                            onClick={() => {
                                                                SetIsArchiveNFTModalOpened(true)
                                                                SetNFTId(nft.id)
                                                            }}
                                                        >
                                                            Archive
                                                        </Menu.Item>

                                                        <Menu.Item icon={<IconTrash className="Icon" />} color="red" 
                                                            onClick={() => {
                                                                SetIsDeleteNFTModalOpened(true)
                                                                SetNFTId(nft.id)
                                                            }}
                                                        >
                                                            Delete
                                                        </Menu.Item>
                                                    </Menu.Dropdown>
                                                </Menu>
                                            </Group>
                                        </Stack>
                                    </Grid.Col>
                                )}

                                {NFTArray?.map((nft, index) => 
                                    <Grid.Col sm={12} md={4} key={index}>
                                        <Stack className="Filled">
                                            <ImagePreview File={nft.image} HasData={false} Size={"100%"} />

                                            <Group position="apart">
                                                <Text fz="sm">{nft.title}</Text>
                                                    <Group spacing="xs">
                                                        <ActionIcon variant="filled" color="blue" radius="xl"
                                                            onClick={() => {
                                                                SetIndexOfNFT(index)
                                                                SetNFTData((current) => ({...current, 
                                                                    title: NFTArray[index].title,
                                                                    description: NFTArray[index].description,
                                                                    image: NFTArray[index].image,
                                                                    url: NFTArray[index].url
                                                                }))
                                                                SetIsChangingNFTData(true)
                                                                SetIsAddNFTModalOpened(current => !current)
                                                            }}
                                                        >
                                                            <IconPencil className="Icon" />
                                                        </ActionIcon>

                                                        <ActionIcon variant="filled" color="red" radius="xl"
                                                            onClick={() => {
                                                                NFTArray.splice(index, 1)
                                                                NFTArray2.splice(index, 1)
                                                            }}
                                                        >
                                                            <IconTrash className="Icon" />
                                                        </ActionIcon>
                                                    </Group>
                                            </Group>
                                        </Stack>
                                    </Grid.Col>
                                )}

                                <Grid.Col sm={12} md={4} onClick={() => SetIsAddNFTModalOpened(current => !current)}>
                                    <Stack align="center" justify="center" className="AddItem">
                                        <IconCirclePlus size="3.2rem" stroke={1.5} />
                                        <Text ta="center" inline c="dimmed"> Add NFT</Text>
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </Stack>
                    </Tabs.Panel>
                </Stack>
            </Tabs>

            <Modal 
                opened={IsUploadNewLogoModalOpened} 
                onClose={() => SetIsUploadNewLogoModalOpened(current => !current)} 
                title={<Text fw="bold" fz="lg" c="white">Upload New Logo</Text>} 
                centered 
                withCloseButton={false} 
                closeOnClickOutside={false} 
                className="CMSModal" 
                size="xl"
            >
                <Stack>
                    <Box>
                        {Datas.Logo.length > 0 
                            ? 
                                <Stack align="center" justify="center" className="Filled">
                                    <ImagePreview File={Datas.Logo} HasData={IsUploadingNewLogo ? false : true} />

                                    <Group>
                                        <Button onClick={() => {
                                                ChangeLogoRef.current()
                                                setIsUploadingNewLogo(true)
                                            }}
                                        >
                                            Change
                                        </Button>
                                    </Group>
                                </Stack>
                            :
                                <Dropzone
                                    openRef={ChangeLogoRef}
                                    onDrop={(files) => {
                                        setData(([current]) => [{...current, Logo: files}])
                                        setIsUploadingNewLogo(true)
                                    }}
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
                                                Caption="Drag your logo here or click to select file"
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
                    </Box>
                    
                    <Stack align="end">
                        <Group>
                            {Datas.Logo.length > 0 &&
                                <Button className="GradientButton" size="md" onClick={() => UpdateLogo()}>
                                    Update Logo
                                </Button>
                            }

                            <Button color="red" size="md" onClick={() => {SetIsUploadNewLogoModalOpened(current => !current); GetMyProject()}}>
                                Cancel
                            </Button>
                        </Group>
                    </Stack>
                </Stack>
            </Modal>

            <Modal 
                opened={IsUploadNewBannerModalOpened} 
                onClose={() => SetIsUploadNewBannerModalOpened(current => !current)} 
                title={<Text fw="bold" fz="lg" c="white">Upload New Banner</Text>} 
                centered 
                withCloseButton={false} 
                closeOnClickOutside={false} 
                className="CMSModal" 
                size="xl"
            >
                <Stack>
                    <Box>
                        {Datas.Banner.length > 0 
                            ? 
                                <Stack align="center" justify="center" className="Filled">
                                    <ImagePreview File={Datas.Banner} HasData={IsUploadingNewBanner ? false : true} />

                                    <Group>
                                        <Button onClick={() => {
                                                ChangeBannerRef.current()
                                                setIsUploadingNewBanner(true)
                                            }}
                                        >
                                            Change
                                        </Button>
                                    </Group>
                                </Stack>
                            :                                
                                <Dropzone
                                    openRef={ChangeBannerRef}
                                    onDrop={(files) => {
                                        setData(([current]) => [{...current, Banner: files}])
                                        setIsUploadingNewBanner(true)
                                    }}
                                    maxSize={3 * 1024 ** 2}
                                    accept={IMAGE_MIME_TYPE}
                                    className="CustomStylingForDropZone"
                                >
                                    <Group position="center" className={classes.GlobalStyle}>
                                        <Dropzone.Idle>
                                            <DropZoneState 
                                                Icon={<IconPhoto size="3.2rem" stroke={1.5} />}
                                                Caption="Drag your banner image here or click to select file"
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
                    </Box>
                    
                    <Stack align="end">
                        <Group>
                            {Datas.Banner.length > 0 &&
                                <Button className="GradientButton" size="md" onClick={() => UpdateBanner()}>
                                    Update Banner
                                </Button>
                            }

                            <Button color="red" size="md" onClick={() => {SetIsUploadNewBannerModalOpened(current => !current); GetMyProject()}}>
                                Cancel
                            </Button>
                        </Group>
                    </Stack>
                </Stack>
            </Modal>

            <Modal opened={IsUploadHighlightVideoModalOpened} onClose={() => SetIsUploadHighlightVideoModalOpened(current =>!current)} title={<Text fw="bold" fz="lg" c="white">Trim and {IsUploadingNewHighlightVideo ? "Upload" : "Update"} your Highlight Video</Text>} centered withCloseButton={false} closeOnClickOutside={false} className="CMSModal" size="xl">
                {(processing || !ffmpegLoaded) &&
                    <Overlay color="wheat" opacity={0.5} blur={2} center>
                        <Stack align="center" justify="center">
                            <Loader />
                            <Text fw="bolder">{!ffmpegLoaded ? "Waiting for FFmpeg to load..." : "Processing..."}</Text>
                        </Stack>
                    </Overlay>
                }
               
                <Text fz="sm"><Badge variant="outline" color="orange">20 seconds of project trailer</Badge></Text>
                
                <Stack my="xs">
                    <Box>
                        {videoFile &&
                            <VideoPlayer
                                src={URL.createObjectURL(videoFile)}
                                onPlayerChange={(videoPlayer) => {
                                    setVideoPlayer(videoPlayer)
                                }}
                                onChange={(videoPlayerState) => {
                                    setVideoPlayerState(videoPlayerState)
                                }}
                            />
                        }
                    </Box>

                    <Box>
                        <VideoUpload
                            disabled={!!videoFile}
                            onChange={(videoFile) => {
                                setVideoFile(videoFile)
                            }}
                        />
                    </Box>
                    
                    {videoFile && 
                        <>
                            <Box>
                                <Text>Trim video</Text>

                                <RangeSlider
                                    disabled={!videoPlayerState}
                                    color="violet" 
                                    // label={null}
                                    showLabelOnHover={false}
                                    styles={{ 
                                        thumb: { 
                                            borderWidth: rem(0), padding: rem(0), borderRadius: rem(3), 
                                            background: "white", height: "calc(.7rem * 2)"
                                        } 
                                    }}
                                    minRange={20} 
                                    maxRange={20} 
                                    value={sliderValues} 
                                    onChange={(values) => {
                                        setSliderValues(values)
                                    }}
                                />
                            </Box>

                            <Group>
                                <VideoConversionButton
                                    ProcessVideoTrim={(status) => {
                                        setProcessing(status)
                                    }}
                                    ffmpeg={ffmpeg}
                                    videoPlayerState={videoPlayerState}
                                    sliderValues={sliderValues}
                                    videoFile={videoFile}
                                    TrimmedVideoCreated={(output) => {
                                        setTrimmedVideo(output)
                                    }}
                                    ResultFile={(res) => {
                                        setResultFile([res])
                                    }}
                                    getBase64Trailer={(base64File) => {
                                        ConvertToBase64(base64File, SetBase64Trailer)
                                    }}
                                />

                                <Button
                                    color="red"
                                    disabled={!videoFile}
                                    onClick={() => setVideoFile(undefined)}
                                >
                                    Remove
                                </Button>
                            </Group>
                        </>
                    }

                    {trimmedVideo && 
                        <>
                            <h3>Result of Trimmed Video</h3>
                            <Box className="Filled">
                                <Player >
                                    <source src={trimmedVideo} />
                                    <BigPlayButton position="center" />
                                    <LoadingSpinner />
                                    <ControlBar>
                                        <PlayToggle />
                                    </ControlBar>
                                </Player>
                            </Box>
                        </>
                    }
                </Stack>

                <Stack align="flex-end">
                    <Group>
                        <Button 
                            className="GradientButton" 
                            size="md" 
                            onClick={() => {
                                setData(([current]) => [{...current, HighlightVideo: resultFile}]);
                                IsUploadingNewHighlightVideo ? SetIsUploadHighlightVideoModalOpened(current => !current) : UpdateTrailer(resultFile)
                            }}
                        >
                            {IsUploadingNewHighlightVideo ? "Save & Continue" : "Update Highlight Video"}
                        </Button>

                        <Button color="dark" variant="white" size="md" onClick={() => {SetIsUploadHighlightVideoModalOpened(current => !current); GetMyProject()}}>
                            Close
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            <Modal opened={IsAddTokenModalOpened} onClose={() => SetIsAddTokenModalOpened(current => !current)} title={<Text fw="bold" fz="lg" c="white">Add Token</Text>} centered withCloseButton={false} closeOnClickOutside={false} className="CMSModal">
                <Stack>
                    <Stack spacing="xs">
                        <Text>Token Key</Text>

                        <Input className="Hyme-Form-Element" />
                    </Stack>

                    <Stack spacing="xs">
                        <Text>Graph API</Text>

                        <Textarea autosize minRows={3} maxLength={500} placeholder="Maximum of 500 characters..." className="Hyme-Form-Element" />
                    </Stack>

                    <Stack>
                        <Group grow>
                            <Button color="dark" variant="white" size="md" onClick={() => SetIsAddTokenModalOpened(current => !current)}>
                                Close
                            </Button>

                            <Button className="GradientButton" size="md">
                                Activate
                            </Button>
                        </Group>
                    </Stack>
                </Stack>
            </Modal>

            <Modal opened={IsAddNFTModalOpened} onClose={() => SetIsAddNFTModalOpened(current =>!current)} title={<Text fw="bold" fz="lg" c="white">{IsChangingNFTData ? "Edit" : "Add"} NFT</Text>} centered withCloseButton={false} closeOnClickOutside={false} className="CMSModal" size="lg">
                <Stack spacing="xs">
                    <Stack spacing="xs">
                        <Text>NFT Title</Text>
                        <Input className="Hyme-Form-Element" value={NFTData.title} onChange={(e) => SetNFTData((current) => ({...current, title: e.target.value}))} />
                    </Stack>

                    <Stack spacing="xs">
                        <Text>Description</Text>

                        <MultiSelect
                            className="Hyme-Form-Element"
                            data={NFTCategories}
                            searchable
                            creatable
                            clearable
                            rightSection={<IconPencilPlus className="Icon" stroke={1.5} />}
                            getCreateLabel={(query) => `+ Add ${query}`}
                            onCreate={(query) => {
                                const item = { value: query, label: query};
                                SetNFTCategories((current) => [...current, item]);
                                return item;
                            }}

                            onChange={(query) => {
                                SetNFTData((current) => ({...current, description: query}))
                            }}
                            defaultValue={NFTData.description}
                        />
                    </Stack>

                    <Stack spacing="xs">
                        <Text>NFT Link</Text>
                        <Input className="Hyme-Form-Element" placeholder="https://" rightSection={<IconLink className="Icon" stroke={1.5} />} 
                            value={NFTData.url} 
                            onChange={(e) => SetNFTData((current) => ({...current, url: e.target.value}))} 
                        />
                    </Stack>

                    <Stack spacing="xs">
                        <Text>NFT Image</Text>
                        
                        {NFTData.image.length > 0
                            ?
                                <Stack align="center" justify="center" className="Filled" sx={{ position: "relative" }}>
                                    <ImagePreview File={NFTData.image} HasData={false} />

                                    <Group spacing="xs" sx={{ position: "absolute", top: 10, right: 10 }}>
                                        <ActionIcon variant="filled" color="blue" radius="xl" size="lg" 
                                            onClick={() => ChangeNFTImageRef.current()}
                                        >
                                            <IconPencil className="Icon" />
                                        </ActionIcon>

                                        <ActionIcon variant="filled" color="red" radius="xl" size="lg" 
                                            onClick={() => SetNFTData((current) => ({...current, image: ""}))}
                                        >
                                            <IconTrash className="Icon" />
                                        </ActionIcon>
                                    </Group>
                                </Stack>
                            :
                                <Dropzone
                                    openRef={ChangeNFTImageRef}
                                    onDrop={(files) => {
                                        console.log(files)
                                        SetNFTData((current) => ({...current, image: files}))
                                        ConvertToBase64(files[0], SetBase64NFTImage)
                                    }}
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
                                                Caption="Drag your NFT Image here or click to select file"
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

                    <Stack>
                        <Group grow>
                            <Button className="PrimaryButton" size="md" 
                                onClick={() => {
                                    if(IsChangingNFTData){
                                        NFTArray[IndexOfNFT].title = NFTData.title
                                        NFTArray[IndexOfNFT].description = NFTData.description
                                        NFTArray[IndexOfNFT].imageFileName = NFTData.image[0].name
                                        NFTArray[IndexOfNFT].image = NFTData.image
                                        NFTArray[IndexOfNFT].url = NFTData.url

                                        NFTArray2[IndexOfNFT].title = NFTData.title
                                        NFTArray2[IndexOfNFT].description = NFTData.description.join()
                                        NFTArray2[IndexOfNFT].imageFileName = NFTData.image[0].name
                                        NFTArray2[IndexOfNFT].image = Base64NFTImage
                                        NFTArray2[IndexOfNFT].url = NFTData.url
                                    }else{
                                        NFTObject["title"] = NFTData.title
                                        NFTObject["description"] = NFTData.description
                                        NFTObject["imageFileName"] = NFTData.image[0].name
                                        NFTObject["image"] = NFTData.image
                                        NFTObject["url"] = NFTData.url

                                        NFTArray.push(NFTObject)
                                        SetNFTArray(NFTArray)

                                        NFTObject2["title"] = NFTData.title
                                        NFTObject2["description"] = NFTData.description.join()
                                        NFTObject2["imageFileName"] = NFTData.image[0].name
                                        NFTObject2["image"] = Base64NFTImage
                                        NFTObject2["url"] = NFTData.url

                                        NFTArray2.push(NFTObject2)
                                        SetNFTArray2(NFTArray2)
                                    }
                                    SetNFTData((current) => ({...current,
                                        "title": "",
                                        "description": "",
                                        "imageFileName": "",
                                        "image": "",
                                        "url": ""
                                    }))
                                    SetIsChangingNFTData(false)
                                    SetIsAddNFTModalOpened(current => !current)
                                }}
                            >
                                {IsChangingNFTData ? "Save Changes" : "Activate"}
                            </Button>
                            
                            <Button color="dark" variant="white" size="md" 
                                onClick={() => {
                                    if(IsChangingNFTData){
                                        SetNFTData((current) => ({...current,
                                            "title": "",
                                            "description": "",
                                            "imageFileName": "",
                                            "image": "",
                                            "url": ""
                                        }))
                                        SetIsChangingNFTData(false)
                                    }
                                    SetIsAddNFTModalOpened(current => !current)
                                }}
                            >
                                {IsChangingNFTData ? "Cancel" : "Close"}
                            </Button>
                        </Group>
                    </Stack>
                </Stack>
            </Modal>

            <Modal opened={IsRejectMessagesModalOpened} onClose={() => SetIsRejectMessagesModalOpened(current =>!current)} title={<Text fw="bold" fz="lg" c="white">Rejection Reason(s)</Text>} withCloseButton={true} closeOnClickOutside={false} className="CMSModal">
                <Stack>
                    {RejectMessages?.map((message, index) => 
                        <Card shadow="sm" padding="md" radius="md" key={index}>
                            <Text fz="sm">
                                {message.message}
                            </Text>
                        </Card>
                    )}
                </Stack>
            </Modal>

            <ConfirmationModal 
                isOpen={IsDeleteNFTModalOpened}
                closeModal={() => SetIsDeleteNFTModalOpened(false)}
                modalTitle="Confirmation to delete this NFT"
                modalDescription="Are you sure you want to delete this NFT?"
                callBackAction={() => {SetIsDeleteNFTModalOpened(false); DeleteNFT(NFTId)}}
                label="Yes, delete it"
            />

            <ConfirmationModal 
                isOpen={IsArchiveNFTModalOpened}
                closeModal={() => SetIsArchiveNFTModalOpened(false)}
                modalTitle="Confirmation to archive this NFT"
                modalDescription="Are you sure you want to archive this NFT?"
                callBackAction={() => {SetIsArchiveNFTModalOpened(false); ArchiveNFT(NFTId)}}
                label="Yes, archive it"
            />
        </Box>
    )
}
