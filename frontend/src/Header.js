import { Component } from "react"
import "./Header.css"

class Header extends Component {

    render() {
        return (
            <div id="header">
                <h1 id="logo">
                    <span id="logo-font">
                        Little Handbook of Chess Openings
                    </span>
                </h1>
            </div>
        )
    };
}

export default Header;
