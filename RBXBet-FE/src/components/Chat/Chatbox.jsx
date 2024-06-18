import {
    Developer,
    HighRoller,
    Moderator,
    Owner,
    VIP,
    Whale,
    Member
} from '../../assets/imageExport'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import './Chatbox.css'

export default function ChatBox ({ message, role, username, pfp, date }) {
    const roleImage = 
        role == 'Developer' ? 
                    Developer :
                role == 'HighRoller' ?
                    HighRoller :
                role == 'Moderator' ? 
                    Moderator :
                role == 'Owner' ? 
                    Owner :
                role == 'VIP' ?
                    VIP : 
                role == 'Whale' ? 
                    Whale :
                Member

    const roleUsername = 
        role == 'Developer' ? 
            'Developer' :
        role == 'HighRoller' ?
            'HighRoller' :
        role == 'Moderator' ? 
            'Moderator' :
        role == 'Owner' ? 
            'Owner' :
        role == 'VIP' ?
            'VIP' : 
        role == 'Whale' ? 
            'Whale' :
        ''

    return (
        <div className="chatBox">
            <img src={`https://gravatar.com/avatar/${pfp}?d=https%3A%2F%2Ftr.rbxcdn.com%2F30DAY-AvatarHeadshot-A91C0E7E0F594224906140CE8B4D1479-Png%2F150%2F150%2FAvatarHeadshot%2FPng%2FnoFilter`} className='pfp' alt="" />
            <div className="content">
                <div className="topHalf">
                    {roleImage != '' ? 
                        <img className='role' src={roleImage} alt="Role Icon" /> :
                        ''
                    }
                    <p className={`username ${roleUsername}`}>
                        {username}
                    </p>
                    <p className="timeStamp">{format(date, 'h:mm aa')}</p>
                </div>
                <div className="messageContent">
                    <p className="message">{message}</p>
                </div>
            </div>
        </div>
    )
}

ChatBox.propTypes = {
    message: PropTypes.string,
    role: PropTypes.string,
    username: PropTypes.string,
    pfp: PropTypes.string,
    date: PropTypes.any
}
