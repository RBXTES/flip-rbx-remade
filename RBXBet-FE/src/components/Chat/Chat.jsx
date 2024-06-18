import { useState, useEffect, useContext, useCallback, useRef } from 'react'
import ChatBox from './Chatbox'
import SocketContext from '../../Context/SocketContext';
import './Chat.css'
import { threeDots } from '../../assets/imageExport'
import { getJWT } from '../../util/api';

function Chat () {
    const [inputValue, setInputValue] = useState('')
    const [onlineCount, setOnlineCount] = useState(0)
    const [reversedMessages, setReversedMessages] = useState([])

    const messagesContainerRef = useRef(null)

    const socket = useContext(SocketContext);

    const handleLoadMessages = useCallback((receivedMessages) => {
        setReversedMessages(receivedMessages.reverse())
    }, [])

    const handleNewMessage = useCallback((message) => {
        setReversedMessages([message, ...reversedMessages])
    }, [reversedMessages])

    const handleNewOnline = useCallback((count) => {
        setOnlineCount(count)
    }, [])

    const handleInputChange = useCallback((e) => {
        setInputValue(e.target.value)
    }, [])

    const handleMessageSend = useCallback((e) => {
        e.preventDefault()
        const message = {
            message: inputValue,
            author: getJWT()
        }
        socket.emit('SEND_MESSAGE', message)
        setInputValue('')
    }, [inputValue, socket])
   
    useEffect(() => {
        socket.on('NEW_MESSAGE', handleNewMessage)
        socket.on('LOAD_MESSAGES', handleLoadMessages)
        socket.on('USER_COUNT', handleNewOnline)

        return () => {
            socket.off('NEW_MESSAGE', handleNewMessage)
            socket.off('LOAD_MESSAGES', handleLoadMessages)
            socket.off('USER_COUNT', handleNewOnline)
        }
    }, [socket, handleNewMessage, handleNewOnline, handleLoadMessages])

    return (
        <div className="chat">
            <div className="aboveMessages">
                <div className="onlineCount">
                    <div className='circle'></div>
                    <p>{onlineCount}</p>
                </div>
                <p className="chat">CHAT</p>
                <img src={threeDots} alt="" />
            </div>
            <div ref={messagesContainerRef} className="messagesContainer">
                {
                    reversedMessages.map(message => {
                        return <ChatBox key={message.date} message={message.message} username={message.author.username} role={message.author.role} pfp={message.author.avatarId} date={message.date} />
                    })
                }
            </div>
            <form autoComplete='off' className='messageForm' onSubmit={(e) => handleMessageSend(e)} action="">
                <input type="text" value={inputValue} required name='messageInput' onChange={(e) => handleInputChange(e)} minLength={3} maxLength={100} placeholder='Write a message...' />
            </form>
        </div>
    )
}

export default Chat