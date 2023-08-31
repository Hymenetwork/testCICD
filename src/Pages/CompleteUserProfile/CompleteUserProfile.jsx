import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, Box, Button, Card, Group, Image, Input, MediaQuery, Modal, Stack, Text } from "@mantine/core";

import { HYMELogoWithText } from "../../Helpers/Constants";
import { AlphaNumericOnly, ToasterMessage, api } from "../../Utils";

import { IconCheck, IconExclamationCircle } from "@tabler/icons-react";
import "./CompleteUserProfile.css";

export const CompleteUserProfile = () => {
    let id, title, message, icon, color, hasRedirect, redirectLocation = ""
    let UsernameMinChar = 6
    let UsernameMaxChar = 12

    const Navigate = useNavigate()
    const [IsAvatarModalOpen, { open, close }] = useDisclosure(false);

    const [UserName, setUserName] = useState("")
    const [WalletAddress, setWalletAddress] = useState("")

    let TestAvatar = `https://api.dicebear.com/6.x/adventurer/svg?seed=${UserName}`

    useEffect(() => {
        GetUserProfile()
        setWalletAddress(localStorage.getItem("WALLET_ADD") ?? "")
    }, [])
    
    //! Complete Profile 
    const CompleteProfile = () => {
        const UserNameLenght = UserName.length
        
        if(UserNameLenght >= UsernameMinChar && UserNameLenght <= UsernameMaxChar){
            if(AlphaNumericOnly(UserName)){
                UpdateUserProfile()
            }else{
                id = "InvalidUsername"
                title= "Invalid Username"
                message = "Please use alphanumeric characters only."
                icon = <IconExclamationCircle className="Icon" />
                color = "red"
    
                ToasterMessage(id, title, message, icon, color)
            }
        }else{
            id = "UsernameCharacterLimitError"
            title= "Username cannot be empty"
            message = `Please enter at least ${UsernameMinChar} to ${UsernameMaxChar} alphanumeric characters.`
            icon = <IconExclamationCircle className="Icon" />
            color = "red"

            ToasterMessage(id, title, message, icon, color)
        }
    }

    //! Avatar Library
    const GenerateAvatars = () => {
        let Avatar = ""
        let Avatars = []

        for(let i = 1; i <= 50; i++){
            Avatar = `/Avatars/avatar (${i}).png`

            // let RandNumber = Math.floor(Math.random() * 100)
            // let RandLetter = (Math.random() + 1).toString(36).substring(7)
            // let Avatar = `https://api.dicebear.com/6.x/avataaars/svg?seed=${RandLetter+RandNumber}`
            Avatars.push(<Card radius="md" className="AvatarLibraryCard" key={i}><Image src={Avatar} alt="Avatar" height={40} width={40} radius="xl" /></Card>)
        }
        return Avatars

    }
    
    //! Get User Profile
    const GetUserProfile = async () => {
        const GetUserProfileEP = `/users/me`
        await api.get(GetUserProfileEP).then((result) => {
            const Data = result.data 
            const Status = result.status

            if(Status === 200){
                Data.name && Navigate("/")
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    //! Update User Profile
    const UpdateUserProfile = async () => {
        const UpdateUserProfileEP = `/users`
        await api.put(UpdateUserProfileEP, {
            "name": UserName
        }).then((result) => {
            const Status = result.status

            if(Status === 204){
                id = "UserProfileCompleted"
                title= "Your profile is now completed"
                message = "You will be redirected in a second..."
                icon = <IconCheck className="Icon" />
                color = "green"
                hasRedirect = true,
                redirectLocation = "/"

                ToasterMessage(id, title, message, icon, color, hasRedirect, redirectLocation)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <Box className="CompleteProfilePage HYMEBackground">
            <MediaQuery smallerThan="sm" styles={{
                "div.CompleteProfileCard": {
                    width: "250px",
                    padding: "1rem"
                }
            }}>
                <Stack spacing="xl">
                    <Card p={36} radius="md" withBorder className="CompleteProfileCard">
                        <Stack>
                            <Stack align="center">
                                <Image src={HYMELogoWithText} alt="HYME Logo" maw={165} />
                            </Stack>

                            <Stack align="center" justify="center" spacing={0} className="CompleteProfileAvatarSection">
                                <Avatar radius="xl" size="lg" color="hyme-violet.3" variant="gradient" mb="sm" className="Avatar" onClick={open} />
                                <Text fz="sm" onClick={open}>Choose Avatar</Text>
                            </Stack>
                        
                            <Stack spacing="sm">
                                <Input.Wrapper
                                    label="Username"
                                >
                                    <Input 
                                        placeholder="Type your Username" 
                                        onChange={(e) => setUserName(e.target.value)} 
                                        value={UserName}
                                    />
                                </Input.Wrapper>

                                <Input.Wrapper
                                    label="Wallet Address"
                                >
                                    <Input placeholder="Wallet Address" disabled value={WalletAddress} className="WalletAddressInput" />
                                </Input.Wrapper>

                            </Stack>
                        
                            <Button className="PrimaryButton" fullWidth sx={{ fontWeight: 400 }} onClick={() => CompleteProfile()}>
                                Continue
                            </Button>
                        </Stack>
                    </Card>
                </Stack>
            </MediaQuery>

            <Modal opened={IsAvatarModalOpen} onClose={close} title="Pick your avatar" centered size="xl" withCloseButton={false} className="AvatarLibrary">
                <Group position="center">
                    <GenerateAvatars />
                </Group>
            </Modal>
        </Box>
    )
}
