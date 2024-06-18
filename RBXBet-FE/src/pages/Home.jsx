import Chat from "../components/Chat/Chat"
import LogoDisplay from "../components/Chat/Logodisplay"
import NavBar from "../components/Navbar/NavBar"
import Coinflip from "../components/Coinflip/Coinflip"
import { createContext } from "react"

export default function Home () {
    return (
        <>   
            <LogoDisplay></LogoDisplay>
            <NavBar></NavBar>
            <Chat></Chat>
            <Coinflip></Coinflip>
        </>
    )
}