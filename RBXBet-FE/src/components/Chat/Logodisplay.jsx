import './Logodisplay.css'
import { logo } from '../../assets/imageExport'

export default function LogoDisplay () {
    return (
        <div className="logo">
                <img src={logo} alt="" />
            </div>
    )
}