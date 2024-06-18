import { useState, useEffect, useCallback, useContext } from 'react'
import SocketContext from '../../Context/SocketContext'
import './CoinflipBar.css'
import { getJWT } from '../../util/api'
import PropTypes from 'prop-types'
import CoinflipModal from './CoinflipModal'

export default function CoinflipBar ({ modalPopup }) {
    return (
        <div className="coinflipBar">
            <CreateCoinflip modalPopup={modalPopup}></CreateCoinflip>
            <CoinflipHistory></CoinflipHistory>
        </div>
    )
}

CoinflipBar.propTypes = {
    modalPopup: PropTypes.func
}

function CreateCoinflip ({ modalPopup }) {
    const [coinflipValue, setCoinflipValue] = useState('')
    const [chosenCoin, setChosenCoin] = useState(null)
    const socket = useContext(SocketContext)
    const closeModal = useCallback(() => {
        modalPopup(null)
    }, [modalPopup])

    const handleValueChange = useCallback((e) => {
        setCoinflipValue(e.target.value)
    }, [])

    const handleCoinChange = useCallback((e) => {
        // check for bux being checked
        setChosenCoin(e.target.value)
    }, [])

    const handleModalOpen = useCallback((data) => {
        modalPopup(<CoinflipModal info={data} closeModal={closeModal}></CoinflipModal>)
    }, [modalPopup, closeModal])

    const handleCreateCoinflip = useCallback(async (e) => {
        e.preventDefault()
        const coinflipSettings = {
            coin: chosenCoin,
            value: Number(coinflipValue)
        }
        await fetch('https://backend-production-03d9.up.railway.app/coinflip/create', {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getJWT()}`
            },
            method: "POST",
            mode: 'cors',
            body: JSON.stringify(coinflipSettings)
        })
            .then(res => res.json())
            .then(data => data ? handleModalOpen(data) : '')
        socket.emit('BALANCE_UPDATE', getJWT())
        socket.emit('NEW_COINFLIP')
        setCoinflipValue('')
    }, [chosenCoin, coinflipValue, socket, handleModalOpen])
    
    return (
        <div className="coinflipCreate">
            <form autoComplete='off' action="" onSubmit={(e) => handleCreateCoinflip(e)}>
                <input type="number" className='betAmount' name='betAmount' required min='1' step='0.01' onChange={(e) => handleValueChange(e) } value={coinflipValue} placeholder="Enter bet amount..."/>
                <button type="submit">PLACE BET</button>
                <input type="radio" required onChange={(e) => handleCoinChange(e)} className='coin' name="selectedCoin" id="bux" value='bux' />
                <input type="radio" onChange={(e) => handleCoinChange(e)} className='coin' name="selectedCoin" id="tix" value='tix' />
            </form>
        </div>
    )
}

CreateCoinflip.propTypes = {
    modalPopup: PropTypes.func
}


function CoinflipHistory () {
    return (
        <button className='history'>History</button>
    )
}





