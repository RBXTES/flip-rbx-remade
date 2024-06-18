import PropTypes from 'prop-types'

export default function ProvablyFair ({ closeModal }) {
    return (
        <>
            <div className="popup">
                <div className="cross" onClick={() => { 
                    closeModal()
                }} alt="close button" />
                <h1 className="infoTitle">Provably Fair</h1>
                <p>Work In Progress</p>
            </div>
            <div className="popup-backdrop" onClick={() => { 
                closeModal()
            }} />
        </>
    )
}


ProvablyFair.propTypes = {
    closeModal: PropTypes.func
}