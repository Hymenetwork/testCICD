import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import { AppRoutes } from "./Routes/AppRoutes";

import { Provider } from "react-redux";
import { Store } from "./Redux/Store";

import "./Assets/css/App.css";
import { Loading } from "./Components";
import { useLogout, useMetaMaskAccountChangeChecker } from "./Hooks";
import { ETHAddressTruncator, Wallet_Address } from "./Utils";

const App = () => {
    const { Account, IsUserChangingAccount } = useMetaMaskAccountChangeChecker()
    const { Logout } = useLogout()

    if(IsUserChangingAccount){
        if(Account?.length > 0){
            if(Wallet_Address !== ETHAddressTruncator(Account)){
                Logout()
            }
        }else{
            Logout()
        }
    }

    return (
        <Provider store={Store}>
            <MantineProvider 
                theme={{ 
                    colorScheme: "dark",
                    fontFamily: "Poppins, Manrope, Sen, Sora",
                    colors: {
                        "hyme-bw": ['#f2f2f2', '#d9d9d9', '#bfbfbf', '#a6a6a6', '#8c8c8c', '#737373', '#595959', '#404040', '#262626', '#0d0d0d'],
                        "hyme-violet": ['#ebe7ff', '#c2b8fe', '#998af7', '#705bf2', '#472ced', '#2d12d3', '#220da5', '#170977', '#0c0549', '#05011e'],
                        "dark": ['#d5d7e0', '#acaebf', '#8c8fa3', '#666980', '#4d4f66', '#34354a', '#2b2c3d', '#000000', '#0c0d21', '#01010a'],
                    }
                }} 
                withGlobalStyles 
                withNormalizeCSS
            >
                <Notifications limit={5} />
                <Loading />
                <AppRoutes />
            </MantineProvider>
        </Provider>
    )    
}

export default App
