import { React, useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import parse from 'html-react-parser';
import json from "../openings.json"
import chessBookWithPawn from "../images/chess-logo.svg"
import openBook from "../images/open-book.svg"
import chessGear from "../images/chess-gear.svg"
import Options from "../Options/Options"
import AnnotatedMovesContainer from "../AnnotatedMovesContainer/AnnotatedMovesContainer"

import "./InfoBox.css"

const InfoBox = ({changeOpponent, changePlayerColor}) => {

    const chess = useSelector(state => state.game);
    const pgn = useSelector(state => state.pgn);
    const fen = useSelector(state => state.fen);
    const [opening, setOpening] = useState()
    const [eco, setEco] = useState()
    const [comment, setComment] = useState('')
    const [annotated, setAnnotated] = useState()
    const [options, showOptions] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        console.log('CHESS:', chess)
        let position = json.find(opening => fen.includes(opening.fen))

        if (position && position.name !== position) {
            setOpening(position.name)
            setEco(position.eco)
        }

        if (position && position.comment) {
            setComment(position.comment)
        } else if (position === undefined && comment !== "") {
            setComment("")
        }
    }, [chess, fen, comment]);

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

    const showInfo = () => {
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
                <div>
                    {parse(comment)}
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
                {showInfo()}
            </div>

            <div>
                <button id="undo-button" onClick={undoMove}>⟲</button>
            </div>

            <AnnotatedMovesContainer annotated={annotated}/>

        </div>
    );
}

export default InfoBox;
