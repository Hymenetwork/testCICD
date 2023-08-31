import axios from 'axios';
import { notifications } from '@mantine/notifications';

export const APILink = import.meta.env.VITE_APP_API_LINK
export const Session_Token = localStorage.getItem("HYME_SESS_TK")
export const Wallet_Address = localStorage.getItem("WALLET_ADD")

export const api = axios.create({
    baseURL: APILink,
    headers: { "Authorization": "Bearer "+Session_Token }
})


export const ETHAddressTruncator = (ETHAddress) => {
        
    // Captures 0x + 4 characters, then the last 4 characters.
    const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/

    const match = ETHAddress.match(truncateRegex)

    if(!match) return ETHAddress
    return `${match[1]}...${match[2]}`
}

export const ToasterMessage = (id, title, message, icon, color, hasRedirect, redirectLocation) => {
    notifications.show({
        id: id || "",
        title: title || "",
        message,
        icon,
        color,
        autoClose: 3000,
        withCloseButton: true,
        onClose: () => hasRedirect && (window.location.href = redirectLocation),
    });
}

export const CharacterRandomizer = () => {
    return "HYME_"+(Math.random() + 1).toString(36).substring(2).toUpperCase()
}

export const AlphaNumericOnly = (value) => {
    const pattern = /^[a-zA-Z0-9]+$/

    return pattern.test(value)
}

export const SliderValueToVideoTime = (duration, sliderValue) => {
    return Math.round(duration * sliderValue / 100)
}

export const FethWithToken = (url, token) => axios.get(url, { 
    headers: { 
        Authorization: `Bearer ${token}`
    } 
}).then((result) => result.data);

export const RankCountSetter = (i) => {
    let j = i % 10,
    k = i % 100;

    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

export const ConvertToBase64 = (file, setFile) => {
    let Reader = new FileReader()
    Reader.readAsDataURL(file)
    Reader.onload = () => {
        setFile(Reader.result.split(",")[1])
    }
}