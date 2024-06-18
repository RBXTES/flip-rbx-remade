import './Signup.css'
import PropTypes from 'prop-types'

export default function Signup ({ tosPopup, submitForm, closeModal }) {
    return (
        <>
            <div className="signupModal">
                <div className="cross" onClick={() => { 
                        closeModal()}} alt="close button" />
                <h1 className="signupHeader">Sign Up</h1>
                <form action="" onSubmit={(e) => { submitForm(e) }}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" required minLength='3' maxLength='15' placeholder="Your username" name="username" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" required maxLength='35' placeholder="Your email" name="email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" required minLength='6' maxLength='35' placeholder="Your password" name="password"/>
                    </div>
                    <button type='submit'>SIGN UP</button>
                </form>
                <span className="subText">By signing up you confirm that you are least 18 years of age and agree to our <span onClick={() => tosPopup()}>Terms of Service</span>.</span>
            </div>
            <div className="modalBackground" onClick={() => { 
                closeModal()
            }} /> 
        </>
    )
}

Signup.propTypes = {
    tosPopup: PropTypes.func,
    submitForm: PropTypes.func,
    closeModal: PropTypes.func,
    error: PropTypes.string
}