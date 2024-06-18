import SocketContext from "../../Context/SocketContext";
import CoinflipBar from "./CoinflipBar";
import CoinflipGame from "./CoinflipGame";
import CoinflipModal from './CoinflipModal'
import { useCallback, useContext, useEffect, useState } from "react";
import './Coinflip.css'

export default function Coinflip () {
    const [activeGames, setActiveGames] = useState([])
    const [coinflipModal, setCoinflipModal] = useState(null)
    const socket = useContext(SocketContext)

    const handlePopupModal = useCallback((passedModal) => {
        setCoinflipModal(passedModal)
    }, [])

    const handleNewGame = useCallback((games) => {
        setActiveGames(games)
    }, [])
    useEffect(() => {
        socket.on('NEW_COINFLIP', handleNewGame)
        return () => {
            socket.off('NEW_COINFLIP', handleNewGame)
        }
    }, [handleNewGame, socket])
    return (
        <>
            <div className="coinflip">
                <CoinflipBar modalPopup={handlePopupModal} />
                <div className="games">
                    {activeGames.length > 0 ?
                        activeGames.map((game) => {
                            return <CoinflipGame modalPopup={handlePopupModal} key={game._id} info={game}></CoinflipGame>
                        })
                    :
                        <p>No games available</p>
                    }
                </div>
            </div>
            {coinflipModal}
        </>
    )
}