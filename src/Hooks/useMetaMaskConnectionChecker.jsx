import { useEffect, useState } from "react"

export const useMetaMaskConnectionChecker = () => {
    const eth = window.ethereum
    const [IsConnected, SetIsConnected] = useState(false)
    const [WalletAddress, SetWalletAddress] = useState()

    useEffect(() => {
        CheckIfWalletIsConnected()
    }, [])

    const CheckIfWalletIsConnected = async() => {
        if(eth){
            const Accounts = await eth.request({
                method: "eth_accounts"
            })

            if(Accounts.length){
                SetIsConnected(true)
                SetWalletAddress(Accounts[0])
            }else{
                SetIsConnected(false)
            }
        }
    }
    
    return { IsConnected, WalletAddress }
}