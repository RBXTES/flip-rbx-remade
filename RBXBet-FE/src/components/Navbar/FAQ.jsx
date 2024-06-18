import PropTypes from 'prop-types'

export default function FAQ ({ closeModal }) {
    return (
        <>
            <div className="popup">
                        <div className="cross" onClick={() => { 
                            closeModal()
                        }} alt="close button" />
                        <h1 className="infoTitle">FAQ</h1>
                        <ul>
                            <li>
                                <h3 className="question">What is Buxdrop?</h3>
                                <p className="answer">Buxdrop is a dynamic Roblox gambling platform inspired by another site, providing users with a thrilling experience featuring crypto-only transactions.</p>
                            </li>
                            <li>
                                <h3 className="question">How does the deposit system work?</h3>
                                <p className="answer">Users will deposit their favorite crypto into their onsite account, this will allow them to join games.</p>
                            </li>
                            <li>
                                <h3 className="question">Can I use crypto for both deposits and withdrawals?</h3>
                                <p className="answer">Absolutely! Buxdrop facilitates crypto transactions for both deposits and withdrawals, ensuring a seamless and secure financial process for all users.</p>
                            </li>
                            <li>
                                <h3 className="question">Is Buxdrop fair?</h3>
                                <p className="answer">Yes, Buxdrop is committed to fairness and transparency. We utilize provably fair algorithms to ensure every game outcome is unbiased and verifiable, providing users with a trustworthy gaming  arcade.</p>
                            </li>
                            <li>
                                <h3 className="question">Tell me more about buxdrop?</h3>
                                <p className="answer">Our website will automatically convert your bet amount to fake limiteds. Utilize your balance to find an item matching your bet and withdraw them as crypto currency.</p>
                            </li>
                        </ul>
                    </div>
                    <div className="popup-backdrop" onClick={() => { 
                        closeModal()
                    }} />
        </>
    )
}

FAQ.propTypes = {
    closeModal: PropTypes.func
}