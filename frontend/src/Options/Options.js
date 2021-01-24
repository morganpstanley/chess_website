import { Component } from "react"
import "./Options.css"

class Options extends Component {

    render() {

        return (
            <div id="options">
                <div className="option" id="computer-player-option">
                    <label className="switch">
                        <input defaultChecked type="checkbox" />
                        <span onClick={() => this.props.changeOpponent()} className="slider round"></span>
                    </label>
                    <span className="options-text">computer opponent?</span>
                </div>
            </div>
        )};
}

export default Options;