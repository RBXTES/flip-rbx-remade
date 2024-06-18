import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { useCallback, useState, useEffect, useContext } from "react"
import {
    trophy,
    tick,
    faq,
    tos,
    discord,
    twitter,
    coinflipSelected,
    jackpotUnselected,
    coinflipUnselected,
    jackpotSelected,
    login,
    signup,
    arrow
} from '../../assets/imageExport'
import FAQ from "./FAQ"
import ProvablyFair from "./ProvablyFair"
import Leaderboard from "./Leaderboard"
import TOS from "./TOS"
import './NavBar.css'
import Signup from "../Account/Signup"
import Login from "../Account/Login"
import { getJWT, loginAuto } from "../../util/api"
import SocketContext from "../../Context/SocketContext"

export default function NavBar () {
    const [modalActive, setModalActive] = useState(null)
    const [formInfo, setFormInfo] = useState(null)
    const [loginInfo, setLoginInfo] = useState(null)
    const [userInfo, setUserInfo] = useState(null)
    const [userBalance, setUserBalance] = useState(0)

    let location = useLocation()

    const socket = useContext(SocketContext)

    const closeModal = useCallback(() => {
        setModalActive(null)
    }, [])

    const handleLeaderboardClick = useCallback(() => {
        if (modalActive == null) {
            setModalActive(
                <Leaderboard closeModal={closeModal}></Leaderboard>
            )    
        } else {
            setModalActive(null)
        }
    }, [modalActive, closeModal])

    const handleProvablyFairClick = useCallback(() => {
        if (modalActive == null) {
            setModalActive(
                <ProvablyFair closeModal={closeModal}></ProvablyFair>
            )    
        } else {
            setModalActive(null)
        }
    }, [modalActive, closeModal])

    const handleFaqClick = useCallback(() => {
        if (modalActive == null) {
            setModalActive(
                <FAQ closeModal={closeModal}></FAQ>
            )    
        } else {
            setModalActive(null)
        }
    }, [modalActive, closeModal])

    const handleTosClick = useCallback(() => {
        if (modalActive == null) {
            setModalActive(
                <TOS closeModal={closeModal}></TOS>
            )    
        } else {
            setModalActive(null)
        }
    }, [modalActive, closeModal])

    const handleSignupSend = useCallback(async (e) => {
        e.preventDefault()
        setFormInfo({
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
        })
    }, [])

    const handleLoginSend = useCallback(async (e) => {
        e.preventDefault()
        setLoginInfo({
            email: e.target.email.value,
            password: e.target.password.value
        })
    }, [])

    const handleSignupClick = useCallback(() => {
        function closeModal() {
            setModalActive(null)
        }
        if (modalActive == null) {
            setModalActive(
                <Signup submitForm={handleSignupSend} closeModal={closeModal} tosPopup={handleTosClick} />
            )
        } else {
            setModalActive(null) 
        }
    }, [handleTosClick, modalActive, handleSignupSend])

    const handleLoginClick = useCallback(() => {
        function closeModal() {
            setModalActive(null)
        }
        if (modalActive == null) {
            setModalActive(
                <Login submitForm={handleLoginSend} closeModal={closeModal} />
            )
        } else {
            setModalActive(null) 
        }
    }, [modalActive, handleLoginSend])

    const loadInfo = async () => {
        const data = await loginAuto()
        setUserInfo(data)
        setUserBalance(data.balance)
    }

    const handleBalanceUpdate = useCallback((balance) => {
        setUserBalance(Math.round(balance * 100) / 100)
    }, [])

    useEffect(() => {
        loadInfo()
        socket.on('BALANCE_UPDATE', handleBalanceUpdate)
        return () => {
            socket.off('BALANCE_UPDATE', handleBalanceUpdate)
        }
    }, [handleBalanceUpdate, socket])

    useEffect(() => {
        if (formInfo !== null) {
            const data = JSON.stringify({
                username: formInfo.username,
                password: formInfo.password,
                email: formInfo.email
            })
            fetch('https://backend-production-03d9.up.railway.app/signup', {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                mode: 'cors',
                body: data
            })
                .then(async response => {
                    const responseJSON = await response.text()
                    if (response.status == 400) {
                        return alert(responseJSON)
                    } else if (response.status == 409) {
                        return alert(responseJSON)
                    }
                    document.cookie = `jsonwebtoken=${responseJSON}`;
                    window.location.reload()
                })
            }
    }, [formInfo])

    useEffect(() => {
        if (loginInfo !== null) {
            const data = JSON.stringify({
                email: loginInfo.email,
                password: loginInfo.password
            })            
            fetch('https://backend-production-03d9.up.railway.app/login', {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                mode: 'cors',
                body: data
            })
            .then(async response => {
                const responseJSON = await response.text()
                if (response.status == 400) {
                    return alert(responseJSON)
                }
                document.cookie = `jsonwebtoken=${responseJSON}`;
                window.location.reload()
            })
        }
    }, [loginInfo])

    return (
        <>
            <div className="navBar">
                <div className="infoLinks">
                    <div className="siteInformation">
                        <div className="infoButton" onClick={() => handleLeaderboardClick()}>
                            <img src={trophy} alt="Trophy Icon" />
                            <p>LEADERBOARD</p>
                        </div>
                        <div className="infoButton" onClick={() => handleProvablyFairClick()}>
                            <img src={tick} alt="Tick Icon" />
                            <p>PROVABLY FAIR</p>
                        </div>
                        <div className="infoButton" onClick={() => handleFaqClick()}>
                            <img src={faq} alt="FAQ Icon" />
                            <p>FAQ</p>
                        </div>
                        <div className="infoButton" onClick={() => handleTosClick()}>
                            <img src={tos} alt="TOS Icon" />
                            <p>TOS</p>
                        </div>
                    </div>
                    <div className="socialLinks">
                        <div className="socialLink">
                            <a href="https://discord.gg/FdMBKTwzHy" rel="noreferrer" target="_blank"><img src={discord} alt="Discord Link" /></a>
                        </div>
                        <div className="socialLink">
                            <a href="https://twitter.com/buxdrop" rel="noreferrer" target="_blank"><img src={twitter} alt="Twitter Link" /></a>
                        </div>
                    </div>
                </div>
                <div className="featureLinks">
                    <div className="gameLinks">
                        <Link to='/' className={`gameLink ${location.pathname == '/' ? 'selected' : 'unselected'}`}>
                            <img src={
                                location.pathname == '/' ? 
                                    coinflipSelected :
                                    coinflipUnselected
                            } alt="coinflip" />
                            <p>COINFLIP</p>
                        </Link>
                        <Link to='/jackpot' className={`gameLink ${location.pathname == '/jackpot' ? 'selected' : 'unselected'}`}>
                            <img src={
                                location.pathname == '/jackpot' ? 
                                    jackpotSelected :
                                    jackpotUnselected
                            } alt="jackpot" />
                            <p>JACKPOT</p>
                        </Link>
                    </div>
                    {
                        userInfo == null ?
                        <div className="userLinks">
                            <button className="signupButton" onClick={() => handleSignupClick()}><img src={signup} alt="Sign Up Icon"/>Sign Up</button>
                            <button className="loginButton"  onClick={() => handleLoginClick()}><img src={login} alt="Login Icon"/>Login</button>
                        </div> :
                        <div className="userStats">
                            <div className="wallet">
                                <div className="balance">
                                    <p>{`$${numeral(userBalance).format('0,0.00')}`}</p>
                                </div>
                                <button className="cashier"></button>
                            </div>
                            <div className="profile">
                                <img src={`https://gravatar.com/avatar/${userInfo.avatarId}?d=https%3A%2F%2Ftr.rbxcdn.com%2F30DAY-AvatarHeadshot-A91C0E7E0F594224906140CE8B4D1479-Png%2F150%2F150%2FAvatarHeadshot%2FPng%2FnoFilter`} className="pfp" alt="Profile Picture" />
                                <p>{userInfo.username}</p>
                                <img src={arrow} alt="Options" className="arrow" />
                            </div>
                        </div>
                    }                    
                </div>
            </div>
            {modalActive}
        </>
    )
}