export const useLogout = () => {
    const Logout = () => {
        localStorage.removeItem("WALLET_ADD")
        localStorage.removeItem("HYME_SESS_TK")
        window.location.reload()
    }

    return { Logout }
}
