import { useState, useEffect } from "react"
import json from "../openings.json"
import chessBookWithPawn from "../images/chess-logo.svg"
import openBook from "../images/open-book.svg"
import chessGear from "../images/chess-gear.svg"
import Options from "../Options/Options"

import "./InfoBox.css"

const InfoBox = (props) => {

    const [opening, setOpening] = useState('')
    const [eco, setEco] = useState('')
    const [comment, setComment] = useState('')
    const [options, showOptions] = useState(false)

    useEffect(() => {
        let fenArray = props.fen.split(' ')
        let fen = fenArray[0] + " " + fenArray[1] + " " + fenArray[2]
        let posistion = json.find(element => element.fen === fen)

        if (posistion && posistion.name !== posistion) {
            setOpening(posistion.name)
            setEco(posistion.eco)
        }

        if (posistion && posistion.comment && posistion.comment !== comment) {
            setComment(posistion.comment)
        } else if (posistion === undefined && comment !== "") {
            setComment("")
        }
    }, [props.fen, opening, eco, comment]);    

    return (
        <div id="infobox">
            <div id="position">
                <img src={chessBookWithPawn} alt="book with pawn on front" id="book-image"/>
                <span id="opening"> {eco} {opening} </span> <br />
                <button className="ribbon" onClick={() => showOptions(!options)}>
                    <img src={chessGear} alt="gear with chess piece in center" id="gears" />
                </button>
            </div>
            <div id="commentary">
                {options? <Options changeOpponent={props.changeOpponent}/> : comment}
                <img id="commentary-background-image" src={openBook} alt="open book" />
            </div>
        </div>
    );
}

export default InfoBox;
