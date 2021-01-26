import { useState, useEffect } from "react"
import "./CaptureArea.css"

import p from "../images/pieces/wP.svg"
import b from "../images/pieces/wB.svg"
import n from "../images/pieces/wN.svg"
import r from "../images/pieces/wR.svg"
import q from "../images/pieces/wQ.svg"

import P from "../images/pieces/bP.svg"
import B from "../images/pieces/bB.svg"
import N from "../images/pieces/bN.svg"
import R from "../images/pieces/bR.svg"
import Q from "../images/pieces/bQ.svg"





const CaptureArea = ({fen}) => {

    const [whitePieces, setWhitePieces] = useState([]);
    const [blackPieces, setBlackPieces] = useState([]);
    const [difference, setDifference] = useState(0)

    useEffect(() => {
        const f = fen.split(' ')[0]
        const white = [];
        const black = [];
        let difference = 0;
        for(let i = 0; i < 8 - [...f.match(/p/g) || [] ].length; i++) {
            white.push("p")
            difference++
        }
        for(let i = 0; i < 2 - [...f.match(/b/g) || [] ].length; i++) {
            white.push("b")
            difference += 3
        }
        for(let i = 0; i < 2 - [...f.match(/n/g) || [] ].length; i++) {
            white.push("n")
            difference += 3
        }
        for(let i = 0; i < 2 - [...f.match(/r/g) || [] ].length; i++) {
            white.push("r")
            difference += 5
        }
        if (!f.match(/q/g)) {
            white.push("q")
            difference += 9
        }

        for(let i = 0; i < 8 - [...f.match(/P/g) || [] ].length; i++) {
            black.push("P")
            difference--
        }
        for(let i = 0; i < 2 - [...f.match(/B/g) || [] ].length; i++) {
            black.push("B")
            difference -= 3
        }
        for(let i = 0; i < 2 - [...f.match(/N/g) || [] ].length; i++) {
            black.push("N")
            difference -= 3
        }
        for(let i = 0; i < 2 - [...f.match(/R/g) || [] ].length; i++) {
            black.push("R")
            difference -= 5
        }
        if (!f.match(/Q/g)) {
            black.push("Q")
            difference -= 9
        }
        setWhitePieces(black)
        setBlackPieces(white)
        setDifference(difference)
    }, [fen])

    const displayCaptures = (captures, color) => {
        let captureArray = [];
        if (color === "w") {
            captureArray = [p, b, n, r, q]
        } else {
            captureArray = [P, B, N, R, Q]
        }
        return (
            captures.map((x, i) => {
                switch(x) {
                    case "p":
                    case "P":
                        return <img src={captureArray[0]} key={i} alt="" className="captured-piece captured-pawn" />
                    case "b":
                    case "B":
                        return <img src={captureArray[1]} key={i} alt="" className="captured-piece captured-bishop" />
                    case "n":
                    case "N":
                        return <img src={captureArray[2]} key={i} alt="" className="captured-piece captured-knight" />
                    case "r":
                    case "R":
                        return <img src={captureArray[3]} key={i} alt="" className="captured-piece captured-rook" />
                    case "q":
                    case "Q":
                        return <img src={captureArray[4]} key={i} alt="" className="captured-piece captured-queen" />
                    default:
                        return "Error"  
                }
            })
        )
    }
        
    return (
        <div id="capture-area-wrapper">
            <div className="capture-area" id="capture-area-white">
                {displayCaptures(whitePieces, "w")}
                {difference < 0 ? "+" + Math.abs(difference): null}
            </div>
            <div className="capture-area" id="capture-area-black">
                {displayCaptures(blackPieces, "b")}
                {difference > 0 ? "+" + Math.abs(difference): null}
            </div>
        </div>
    );
}

export default CaptureArea;