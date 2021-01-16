import { Component } from "react"
import "./InfoBox.css"
import json from "./openings.json"
import chessBookWithPawn from "./images/chess-logo.svg"
import chessBoardWithKnight from "./images/open-book.svg"

class InfoBox extends Component {

    state = {
        opening: '',
        eco: '',
        fen: '',
        comment: ''
    }

    componentDidUpdate(){
        let fenArray = this.props.fen.split(' ')
        let fen = fenArray[0] + " " + fenArray[1] + " " + fenArray[2]
        let opening = json.find(element => element.fen === fen)
        if (opening && opening.name !== this.state.opening) {
            this.setState({
                opening: opening.name,
                eco: opening.eco,
                fen: opening.fen
            })
        }
        if (opening && opening.comment && opening.comment !== this.state.comment) {
            this.setState({
                comment: opening.comment
            })
        } else if (opening === undefined && this.state.comment !== "") {
            this.setState({
                comment: ""
            })
        }
    }

    render() {
        return (
            <div id="infobox">
                <div id="position">
                  <img src={chessBookWithPawn} alt="book with pawn on front" id="book-image"/>
                  <span id="opening"> {this.state.eco} {this.state.opening} </span> <br />
                </div>
                <div id="commentary">
                  {this.state.comment}
                  <img id="commentary-background" src={chessBoardWithKnight} alt="background" />
                </div>
            </div>
        )};
}

export default InfoBox;
