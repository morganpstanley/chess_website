import "./Header.css"
import lightningBolt from "../images/lightning.svg";

const Header = () => {
    return (
        <div id="header">
            <div id="logo">
                <img src={lightningBolt} id="logo-image" alt="lighting-bolt" />
                <span id="chess">CHESS</span>
                <span id="battery">BATTERY</span>
            </div>
        </div>
    )
}

export default Header;
