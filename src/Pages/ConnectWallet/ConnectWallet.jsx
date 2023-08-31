import { Box, Button, Image, Stack, Text } from "@mantine/core"
import { IconCheck, IconExclamationCircle, IconInfoCircle } from '@tabler/icons-react'

import { ethers } from 'ethers'

import { HYMELogoWithTextV2 } from '../../Helpers/Constants'
import { CharacterRandomizer, ETHAddressTruncator, ToasterMessage, api } from '../../Utils'

export const ConnectWallet = () => {
    let id, title, message, icon, color, hasRedirect, redirectLocation = ""
    
    const eth = window.ethereum
    const SignMessage = CharacterRandomizer()

    //! Connect To Wallet
    const ConnectToWallet = async() => {
        if(!eth) return MetaMaskExtensionChecker()

        try {
            await eth.request({method: "eth_requestAccounts"})

            const provider = new ethers.BrowserProvider(eth)
            const signer = await provider.getSigner()
            const signature = await signer.signMessage(SignMessage)
            const address = await signer.getAddress()

            localStorage.setItem("WALLET_ADD", ETHAddressTruncator(address).toLowerCase())
            AuthenticateUser(SignMessage, signature, address)
        } catch (error) {
            console.log(error.code)
            console.log("dto")
            const ErrorCode = error.code

            if(ErrorCode === 4001){
                id = "RequestCancelled"
                title= ""
                message = "You cancelled the connection request."
                icon = <IconExclamationCircle className="Icon" />
                color = "red"

                ToasterMessage(id, title, message, icon, color)
            }

            if(ErrorCode === -32002){
                id = "RequestPending"
                title= ""
                message = "Your request is already pending, please check your MetaMask."
                icon = <IconExclamationCircle className="Icon" />
                color = "red"

                ToasterMessage(id, title, message, icon, color)
            }

            if(ErrorCode === "ACTION_REJECTED"){
                id = "SignMessageRejected"
                title= ""
                message = "You rejected the message signature."
                icon = <IconExclamationCircle className="Icon" />
                color = "red"

                ToasterMessage(id, title, message, icon, color)
            }
        }
    }

    //! MetaMask Extension Checker
    const MetaMaskExtensionChecker = () => {
        id = "NoMetaMaskFound"
        title= ""
        message = 
            <Text span>
                You have no installed MetaMask extension. <br />
                <Text span component="a" href="https://metamask.io/download/" target="_blank" underline>
                    Click here to install
                </Text>
            </Text>
        icon = <IconInfoCircle className="Icon" />
        color = "blue"

        ToasterMessage(id, title, message, icon, color)
    }

    //! Authenticate User
    const AuthenticateUser = async (message, signature, walletAddress) => {
        const AuthenticateUserEP = `/authentication/wallet`
        await api.post(AuthenticateUserEP, {
            "message": message,
            "signature": signature,
            "walletAddress": walletAddress
        }).then((result) => {
            const Status = result.status
            const Data = result.data

            if(Status === 200){
                const Token = Data.token
                localStorage.setItem("HYME_SESS_TK", Token)

                id = "ConnectedSuccessfully"
                title= "Wallet Connected Successfully"
                message = "You will be redirected in a second to complete your profile."
                icon = <IconCheck className="Icon" />
                color = "green"
                hasRedirect = true,
                redirectLocation = "/complete-profile"

                ToasterMessage(id, title, message, icon, color, hasRedirect, redirectLocation)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <Box className="ConnectWalletPage HYMEBackground">
            <Stack align="center" justify="center" h="100vh" spacing="xl">
                <Image src={HYMELogoWithTextV2} alt="HYME Logo" maw={250} />

                <Button className="PrimaryButton" onClick={ConnectToWallet}>
                    Connect Wallet
                </Button>

                <Text mt="xl" fz="sm" fw="light" component="a" href="#">Continue as Guest</Text>
            </Stack>
        </Box>
    )
}
