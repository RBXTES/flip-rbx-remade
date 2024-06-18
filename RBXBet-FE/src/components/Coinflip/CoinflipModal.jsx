import PropTypes from 'prop-types'
import './CoinflipModal.css'
import { bux, tix, anonymousPlayer, key, server } from '../../assets/imageExport'
import { useEffect, useState, useContext, useCallback } from 'react'
import SocketContext from '../../Context/SocketContext'
import { getJWT } from '../../util/api'

export default function CoinflipModal ({ info, closeModal }) {
    const socket = useContext(SocketContext)
    const [winnerStroke, setWinnerStroke] = useState(null)
    const [gameInfo, setGameInfo] = useState(info)
    const [coinflipAnimation, setCoinflipAnimation] = useState(null)

    const handleCoinflipUpdate = useCallback(async (data) => {
        data._id == info._id ? setGameInfo(data) : ''
    }, [info])

    useEffect(() => {
        const randomNumber = Math.floor(Math.random() * 2)
        setCoinflipAnimation(gameInfo.winnerCoin == 'bux' ? `spinBux${randomNumber}` : gameInfo.winnerCoin == 'tix' ? `spinTix${randomNumber}` : '')
        setTimeout(() => {
            if (gameInfo.winnerCoin != null) {
                if (gameInfo.winnerCoin == gameInfo.ownerCoin) {
                    setWinnerStroke('winnerOne')
                } else {
                    setWinnerStroke('winnerTwo')
                }
            }
        }, 3000)
    }, [gameInfo])

    useEffect(() => {
        socket.on('COINFLIP_UPDATE', handleCoinflipUpdate, socket.emit('BALANCE_UPDATE', getJWT()))
        return () => {
            socket.off('COINFLIP_UPDATE', handleCoinflipUpdate)
        }
    }, [socket, handleCoinflipUpdate, gameInfo])
    
    return (
        <>
                <div className="modal">
                <div className="cross" alt="close button" onClick={() => closeModal()} />
                <div className="players">
                    <div className="playerOne player">
                        <img src={`https://gravatar.com/avatar/${gameInfo.playerOne.avatarId}?d=https%3A%2F%2Ftr.rbxcdn.com%2F30DAY-AvatarHeadshot-A91C0E7E0F594224906140CE8B4D1479-Png%2F150%2F150%2FAvatarHeadshot%2FPng%2FnoFilter`} alt="Player One" className={`playerOne avatar ${winnerStroke == 'winnerOne' ? 'winnerOne' : ''}`} />
                        <img src={gameInfo.ownerCoin == 'bux' ? bux : tix} alt="" className="chosenCoin" />
                        <p>{gameInfo.playerOne.username}</p>
                    </div>
                    <div className={`coin ${coinflipAnimation}`}>
                        <div className="bux"></div>
                        <div className="tix"></div>
                    </div>
                    <div className="playerTwo player">
                        <img src={
                            gameInfo.playerTwo == undefined ? anonymousPlayer : `https://gravatar.com/avatar/${gameInfo.playerTwo.avatarId}?d=https%3A%2F%2Ftr.rbxcdn.com%2F30DAY-AvatarHeadshot-A91C0E7E0F594224906140CE8B4D1479-Png%2F150%2F150%2FAvatarHeadshot%2FPng%2FnoFilter`
                        } alt="Player Two" className={`playerTwo avatar ${winnerStroke == 'winnerTwo' ? 'winnerTwo' : ''}`} />
                        <img src={gameInfo.ownerCoin == 'bux' ? tix : bux} alt="" className="chosenCoin" />
                        <p>{gameInfo.playerTwo ? gameInfo.playerTwo.username : ''}</p>
                    </div>
                </div>
                <div className="items">
                    <div className="item playerOne">
                        <div className="totalValue">
                            <p className="percentage">50.00 %</p>
                            <p className="value">R${numeral(gameInfo.value * 500).format('0,0.00a')}</p>
                        </div>
                        <div className="limiteds">
                            <div className="limited">
                                <img src={`https://adurite-images.onrender.com/images?assetId=${gameInfo.playerOne.limited.itemId}&width=420&height=420&format=png`} alt="" />
                                <p className='limitedName'>{gameInfo.playerOne.limited.itemName}</p>
                                <p className="itemValue">R${numeral(gameInfo.value * 500).format('0,0.00a')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="item playerTwo">
                        {gameInfo.playerTwo != null ?
                        <>
                            <div className="totalValue">
                                <p className="percentage">50.00 %</p>
                                <p className="value">R${numeral(gameInfo.value * 500).format('0,0.00a')}</p>
                            </div>
                            <div className="limiteds">
                                <div className="limited">
                                    <img src={`https://adurite-images.onrender.com/images?assetId=${gameInfo.playerTwo.limited.itemId}&width=420&height=420&format=png`} alt="" />
                                    <p className='limitedName'>{gameInfo.playerTwo.limited.itemName}</p>
                                    <p className="itemValue">R${numeral(gameInfo.value * 500).format('0,0.00a')}</p>
                                </div>
                            </div>
                        </>
                        :
                            ''
                        }
                    </div>
                </div>
                <div className="provablyFair">
                    <p className="clientSeed" onClick={() => {
                        navigator.clipboard.writeText(gameInfo.clientSeed ? gameInfo.clientSeed : 'Unavailable')
                        alert('Clientseed Copied')
                    }}><img src={key} alt="" />{gameInfo.clientSeed ? gameInfo.clientSeed : 'Unavailable'}</p>
                    <p className="serverSeed" onClick={() => { 
                        navigator.clipboard.writeText(gameInfo.serverSeed ? gameInfo.serverSeed : gameInfo.hashedServerSeed)
                        alert(gameInfo.serverSeed ? 'Serverseed Copied' : 'Hashed Serverseed Copied')
                    }}><img src={server} alt="" />{gameInfo.serverSeed ? gameInfo.serverSeed : gameInfo.hashedServerSeed}</p>
                </div>
            </div>
            <div className="modal-backdrop" onClick={() => closeModal()} />
            </>
    )
}

CoinflipModal.propTypes = {
    closeModal: PropTypes.func,
    info: PropTypes.object
}