import { useState, useEffect } from "react"
import json from "../openings.json"
import chessBookWithPawn from "../images/chess-logo.svg"
import openBook from "../images/open-book.svg"
import chessGear from "../images/chess-gear.svg"
import Options from "../Options/Options"

import "./InfoBox.css"

const InfoBox = ({chess, fen, pgn, changeOpponent, changePlayerColor}) => {

    const [opening, setOpening] = useState()
    const [eco, setEco] = useState()
    const [comment, setComment] = useState()
    const [annotated, setAnnotated] = useState()
    const [options, showOptions] = useState(false)

    useEffect(() => {
        let fenArray = fen.split(' ')
        let fenAgain = fenArray[0] + " " + fenArray[1] + " " + fenArray[2]
        let posistion = json.find(opening => opening.fen === fenAgain)

        if (posistion && posistion.name !== posistion) {
            setOpening(posistion.name)
            setEco(posistion.eco)
        }

        if (posistion && posistion.comment) {
            setComment(posistion.comment)
        } else if (posistion === undefined && comment !== "") {
            setComment("")
        }
    }, [chess, fen, opening, eco, comment, annotated]);

    useEffect(() => {
        const turn = chess.turn() === "w" ? 2 : 1
        setAnnotated(json.filter(opening => {
            const openingsLength  = opening.moves.split(' ').length;
            let pgnLength = pgn.split(' ').length

            if (pgnLength === 1) {pgnLength = 0} // splitting an empty string by " " returns an empty array with a length of 1...

            return opening.moves.includes(pgn)
            && openingsLength - pgnLength === turn
            && opening.comment
        }))
    }, [pgn, chess])
    
    const annotatedMoves = () => {
        return annotated?.map(opening => {
            let color;
            if (opening?.analysis === "bad") {
                color = "rgb(255, 99, 110)"
            } else if (opening?.analysis === "forced") {
                color = "cornflowerblue"
            }              
            else {
                color = "seagreen"
            }
            const arr = opening.moves.split(' ')
            const move = arr[arr.length - 1]
            return <button key={opening.name} style={{backgroundColor:color, borderColor:color}} className="annotated-move">{move}</button>
        })
    }

    const currentInfo = () => {
        if (options) {
            return (
                <div>
                    <Options 
                    changeOpponent={changeOpponent} 
                    changePlayerColor={changePlayerColor}/> 
                </div>
            )
        } else {
            return (
                <div>{comment}</div>
            )
        }
    }

    const undoMove = () => {
        chess.undo()
    }

    return (
        <div id="infobox">

            <div id="position">
                <img src={chessBookWithPawn} alt="book with pawn on front" id="book-image"/>
                <span id="opening"> {eco} {opening} </span> 
                <br />
                <button className={options ? "ribbon active" : "ribbon"} onClick={() => showOptions(!options)}>
                    <img src={chessGear} alt="gear with chess piece in center" id="gears" />
                </button>
            </div>

            <div id="commentary">
                {currentInfo()}
                <br />
                <img id="commentary-background-image" src={openBook} alt="open book" />
            </div>

            <div id="continuations">
                <span id="continuations-title">Annotated Continuations:</span> <br />
                {annotatedMoves()}
            </div>

        </div>
    );
}

export default InfoBox;
