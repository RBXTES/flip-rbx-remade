import PropTypes from 'prop-types'

export default function TOS ({ closeModal }) {
    return (
        <>
            <div className="popup">
                    <div className="cross" onClick={() => { 
                        closeModal()
                    }} alt="close button" />
                    <h1 className="infoTitle">Terms of Service (TOS)</h1>
                    <span className="infoDate">Last Updated: 8th of February, 2024</span>
                    <ul>
                        <p className='subText'>By accessing Buxdrop.com you agree to these terms of service, all applicable laws, and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials on this website are protected by copyright and trademark law.</p>
                        <h2 className="subHeader">Terms of Use:</h2>
                        <li>
                            <h3 className="question">Acceptance of Terms:</h3>
                            <p className="answer">Accessing or using Buxdrop.com indicates your acceptance of these terms.</p>
                        </li>
                        <li>
                            <h3 className="question">Eligibility:</h3>
                            <p className="answer">Users must be at least 18 years old to use Buxdrop.com.</p>
                        </li>
                        <li>
                            <h3 className="question">User Accounts:</h3>
                            <p className="answer">You&apos;re responsible for maintaining accurate account information.</p>
                        </li>
                        <li>
                            <h3 className="question">Amendment of Terms:</h3>
                            <p className="answer">These terms may change without notice, and your continued use constitutes acceptance of the changes.</p>
                        </li>
                        <li>
                            <h3 className="question">Legal Capacity:</h3>
                            <p className="answer">Buxdrop.com is for adults only; minors are prohibited from using the site.</p>
                        </li>
                        <li>
                            <h3 className="question">Intellectual Property Rights:</h3>
                            <p className="answer">All content on Buxdrop.com belongs to us or our licensors and may not be reproduced without permission.</p>
                        </li>
                        <li>
                            <h3 className="question">Limitation of Liability:</h3>
                            <p className="answer">We are not liable for any losses incurred by using Buxdrop.com</p>
                        </li>
                        <li>
                            <h3 className="question">Bet Participation:</h3>
                            <p className="answer">Users must be 18 or older to place bets; betting is at your own risk.</p>
                        </li>
                        <li>
                            <h3 className="question">Tell me more about buxdrop?</h3>
                            <p className="answer">Our website will automatically convert your bet amount to fake limiteds. Utilize your balance to find an item matching your bet and withdraw them as crypto currency.</p>
                        </li>
                        <li>
                            <h3 className="question">Values:</h3>
                            <p className="answer">Item values may fluctuate without notice; we are not responsible for these changes.</p>
                        </li>
                        <li>
                            <h3 className="question">Termination of Agreement:</h3>
                            <p className="answer">Buxdrop.com may terminate agreements with users at any time without prior notice.</p>
                        </li>
                        <li>
                            <h3 className="question">Account Security:</h3>
                            <p className="answer">Users are responsible for securing their accounts; we are not liable for unauthorized access.</p>
                        </li>
                        <li>
                            <h3 className="question">Deposits & Withdrawals:</h3>
                            <p className="answer">We do not provide refunds for deposits; withdrawals should be made within 30 days.</p>
                        </li>
                        <li>
                            <h3 className="question">Data Collection:</h3>
                            <p className="answer">We collect data for service improvement and verification purposes.</p>
                        </li>
                        <li>
                            <h3 className="question">Claims and Disputes:</h3>
                            <p className="answer">Claims must be made within six months; disputes will be resolved based on transaction records.</p>
                        </li>
                        <p className="subText"> By using Buxdrop.com, you agree to these terms and conditions.</p>
                    </ul>
                </div>
                <div className="popup-backdrop" onClick={() => { 
                    closeModal()
                }} />
        </>
    )
}

TOS.propTypes = {
    closeModal: PropTypes.func
}