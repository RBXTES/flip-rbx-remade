import './Login.css'
import PropTypes from 'prop-types'

export default function Login ({ submitForm, closeModal }) {
    return (
        <>
            <div className="loginModal">
                <div className="cross" onClick={() => { closeModal()} } alt="close button" />
                <h1 className="loginHeader">Login</h1>
                <form action="" onSubmit={(e) => { submitForm(e) }}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" required maxLength='35' placeholder="Your email" name="email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" required minLength='6' placeholder="Your password" name="password"/>
                    </div>
                    <button type='submit'>LOGIN</button>
                </form>
                <span className="subText">
                    Forgot your password? Join our <a href="https://discord.gg/NWCsTcv3" rel='noreferrer' target='_blank'>Discord</a>
                </span>
            </div>
            <div className="modalBackground" onClick={() => { 
                closeModal()
            }} /> 
        </>        
    )
}

Login.propTypes = {
    submitForm: PropTypes.func,
    closeModal: PropTypes.func
}