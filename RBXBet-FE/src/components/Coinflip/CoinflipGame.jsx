import { anonymousPlayer } from "../../assets/imageExport"
import PropTypes from 'prop-types'
import './CoinflipGame.css'
import { bux, tix } from "../../assets/imageExport"
import CoinflipModal from "./CoinflipModal"
import { useCallback, useEffect, useState, useContext } from "react"
import { getJWT } from "../../util/api"
import SocketContext from "../../Context/SocketContext"

export default function CoinflipGame ({ info, modalPopup }) {
    const [winnerStroke, setWinnerStroke] = useState(null)
    const socket = useContext(SocketContext)
    const closeModal = useCallback(() => {
        modalPopup(null)
    }, [modalPopup])

    useEffect(() => {
        if (info.winnerCoin != null) {
            if (info.winnerCoin == info.ownerCoin) {
                setWinnerStroke('winnerOne')
            } else {
                setWinnerStroke('winnerTwo')
            }
        }
    }, [info])

    const infoId = info._id
    const handleModalOpen = useCallback(() => {
        modalPopup(<CoinflipModal info={info} closeModal={closeModal}></CoinflipModal>)
    }, [info, modalPopup, closeModal])

    const handleJoinCoinflip = useCallback(async () => {
        await fetch('https://backend-production-03d9.up.railway.app/join/coinflip', {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getJWT()}`
            },
            method: "POST",
            mode: 'cors',
            body: JSON.stringify({
                id: infoId
            })
        })
        handleModalOpen()
        socket.emit('COINFLIP_UPDATE', infoId)
        socket.emit('BALANCE_UPDATE', getJWT())
    }, [infoId, socket, handleModalOpen])

    return (
        <>
            <div className="coinflipContainer">
                <div className="playerAvatars">
                    <>
                        <div className="playerOne">
                            <img src={`https://gravatar.com/avatar/${info.playerOne.avatarId}?d=https%3A%2F%2Ftr.rbxcdn.com%2F30DAY-AvatarHeadshot-A91C0E7E0F594224906140CE8B4D1479-Png%2F150%2F150%2FAvatarHeadshot%2FPng%2FnoFilter`} alt="Player One" className={`playerOne ${winnerStroke == 'winnerOne' ? 'winnerOne' : ''}`} />
                            <img src={info.ownerCoin == 'bux' ? bux : tix} alt="" className="chosenCoin" />
                        </div>
                        <p>VS</p>
                        <div className="playerTwo">
                            <img src={
                                info.playerTwo == undefined ? anonymousPlayer : `https://gravatar.com/avatar/${info.playerTwo.avatarId}?d=https%3A%2F%2Ftr.rbxcdn.com%2F30DAY-AvatarHeadshot-A91C0E7E0F594224906140CE8B4D1479-Png%2F150%2F150%2FAvatarHeadshot%2FPng%2FnoFilter`
                            } alt="Player Two" className={`playerTwo ${winnerStroke == 'winnerTwo' ? 'winnerTwo' : ''}`} />
                            <img src={info.ownerCoin == 'bux' ? tix : bux} alt="" className="chosenCoin" />
                        </div>
                    </>
                </div>
                <img src={info.winnerCoin == null ? "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" : info.winnerCoin == 'bux' ? bux : tix} alt="Winning Coin" className="winningCoin" />
                <div className="limiteds">
                    <img src={`https://adurite-images.onrender.com/images?assetId=${info.playerOne.limited.itemId}&width=420&height=420&format=png`} alt="" className="limited" />
                    { info.playerTwo != null ? 
                        <img src={`https://adurite-images.onrender.com/images?assetId=${info.playerTwo.limited.itemId}&width=420&height=420&format=png`} alt="" className="limited" />
                        : ''
                    }
                </div>
                <div className="value">
                    {info.winnerCoin !== null ?
                    <>
                        <p className="robux">R${numeral((info.value) * 1000).format('0,0.00a')}</p>
                        <p className="dollars">${numeral(info.value * 2).format('0,0.00')}</p>
                    </>
                    :
                    <>
                        <p className="robux">R${numeral((info.value) * 500).format('0,0.00a')}</p>
                        <p className="dollars">${numeral(info.value).format('0,0.00')}</p>
                    </>
                    }
                </div>
                <div className="buttons">
                    {
                        info.winnerCoin == null ? 
                            <button className="joinButton button" onClick={() => handleJoinCoinflip()}>Join</button>
                                :
                            ''
                    }
                    <button className="viewButton button" onClick={() => handleModalOpen()}>View</button>
                </div>
            </div>
        </>
    )
}

CoinflipGame.propTypes = {
    info: PropTypes.object,
    modalPopup: PropTypes.func
}