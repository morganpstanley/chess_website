import { Component } from "react"
import "./InfoBox.css"
import json from "./openings.json"

class InfoBox extends Component {

    state = {
        json: json
    }
    render() {
        console.log(this.state.json)
        return (
            <div id="infobox">
                <div id="position">
                   Italian Game
                </div>
            </div>
        )};
}

export default InfoBox;
