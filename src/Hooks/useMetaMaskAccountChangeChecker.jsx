import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";

export const useMetaMaskAccountChangeChecker = () => {
    let currentAccount = null;
    const eth = window.ethereum
    const location = useLocation()

    const [IsUserChangingAccount, SetIsUserChangingAccount] = useState(false)
    const [Account, SetAccount] = useState()

    useEffect(() => {
        location.pathname.substring(1) !== "connect-wallet" &&  eth.on("accountsChanged", AccountChanged)

        return () => {
            location.pathname.substring(1) !== "connect-wallet" && eth.removeListener("accountsChanged", AccountChanged)
        }
    }, [])

    const AccountChanged = (Accounts) => {
        SetIsUserChangingAccount(true)
        let AccountsCount = Accounts.length

        if(AccountsCount === 0){
            SetAccount([])
        }else if(Accounts[0] !== currentAccount){
            currentAccount = Accounts[0]
            SetAccount(currentAccount)
        }
    }

    return { Account, IsUserChangingAccount }
}
