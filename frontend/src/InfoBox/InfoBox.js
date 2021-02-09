import { React, useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import json from "../openings.json"
import chessBookWithPawn from "../images/chess-logo.svg"
import openBook from "../images/open-book.svg"
import chessGear from "../images/chess-gear.svg"
import img from "../images/strategy.svg"
import Options from "../Options/Options"

import "./InfoBox.css"

const InfoBox = ({changeOpponent, changePlayerColor}) => {

    const chess = useSelector(state => state.game);
    const pgn = useSelector(state => state.pgn);
    const fen = useSelector(state => state.fen);
    const [opening, setOpening] = useState()
    const [eco, setEco] = useState()
    const [comment, setComment] = useState()
    const [annotated, setAnnotated] = useState()
    const [options, showOptions] = useState(false)
    const dispatch = useDispatch()

    const onMoveClick = (move) => {
        chess.move(move)
        dispatch({type: "UPDATE_GAME", game: chess, fen: chess.fen(), pgn: chess.pgn()})

    }

    useEffect(() => {
        let fenArray = fen.split(' ')
        let fenAgain = fenArray[0] + " " + fenArray[1] + " " + fenArray[2]
        let position = json.find(opening => opening.fen === fenAgain)

        if (position && position.name !== position) {
            setOpening(position.name)
            setEco(position.eco)
        }

        if (position && position.comment) {
            setComment(position.comment)
        } else if (position === undefined && comment !== "") {
            setComment("")
        }
    }, [fen, opening, eco, comment, annotated]);

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
    }, [chess, pgn])
    
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
            return <button 
                        key={opening.name} 
                        style={{backgroundColor:color, borderColor:color}}
                        className="annotated-move"
                        onClick={() => onMoveClick(move)}
                    >
                        {move}
                    </button>
        })
    }

    const currentInfo = () => {
        if (options) {
            return (
                <div>
                    <Options 
                    changeOpponent={changeOpponent} 
                    changePlayerColor={changePlayerColor}/>
                    <img id="commentary-background-image" src={img} alt="open book" />
                </div>
            )
        } else {
            return (
                <div>
                    {comment}
                    <img id="commentary-background-image" src={openBook} alt="open book" />
                </div>
            )
        }
    }

    const undoMove = () => {
        chess.undo()
        dispatch({type: "UPDATE_GAME", game: chess, fen: chess.fen(), pgn: chess.pgn()})
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
            </div>

            <div>
                <button id="undo-button" onClick={undoMove}>⟲</button>
            </div>

            <div id="continuations">
                <span id="continuations-title">Annotated Continuations:</span> <br />
                {annotatedMoves()}
            </div>

        </div>
    );
}

export default InfoBox;
