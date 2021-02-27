import "./Header.css"
import logo from "../images/chess-trek.png";

const Header = () => {
    return (
        <div id="header">
            <img src={logo} id="logo-image" alt="logo" />
        </div>
    )
}

export default Header;
