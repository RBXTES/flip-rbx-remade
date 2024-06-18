import PropTypes from 'prop-types'

export default function Leaderboard ({ closeModal }) {
    return (
        <>
            <div className="popup">
                <div className="cross" onClick={() => { 
                    closeModal()
                }} alt="close button" />
                <h1 className="infoTitle">Leaderboard</h1>
                <p>Work In Progress</p>
            </div>
            <div className="popup-backdrop" onClick={() => { 
                closeModal()
            }} />
        </>
    )
}

Leaderboard.propTypes = {
    closeModal: PropTypes.func
}