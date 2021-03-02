import { useState, useEffect } from "react"
import { useEffectWhen } from "../helpers"
import "./EvaluationBar.css"

const colors = ["antiquewhite", "rgb(10,10,10,.85)"]

const EvaluationBar = ({evaluationObj, playerColor}) => {

    let {evaluation, color, mate} = evaluationObj

    const [vh, setVh] = useState(1);
    const [better, setBetter] = useState('w');
    const [displayNum, setDisplayNum] = useState(0.2)
    const [bottomColor, setBottomColor] = useState("antiquewhite")
    const [topColor, setTopColor] = useState("black")

    useEffect(() => {
        if (playerColor === "white") {
            setBottomColor(colors[0])
            setTopColor(colors[1])
        } else {
            setBottomColor(colors[1])
            setTopColor(colors[0])
        }
    }, [playerColor])

    useEffect(() => {
        //set eval bar height
        let  evalHeight =  color === 'w' ? 
        50 - (evaluation  * 4) :
        50 + (evaluation  * 4);

        if (evaluation > 0) {
            setBetter(color)
        } else {
            color === "w" ? setBetter("b") : setBetter("w")
        };
        
        
        //leave at least 2% if checkmate is not found
        if (evalHeight > 100) {
            evalHeight = 98
        }
        if (evalHeight < 0) {
            evalHeight = 2
        }

        if (playerColor === "black") {
            evalHeight = 100 - evalHeight
        }

        setVh(evalHeight)

        setDisplayNum(evaluation?.toFixed(2))

    }, [playerColor, color, evaluation]);

    useEffectWhen(() => {
        let vh;
        if (mate > 0) {
            if (mate % 2 === 1) {
                if (color === "w") {
                    setBetter('w')
                    vh = 0
                } else {
                    setBetter('b')
                    vh = 100
                }
            } else {
                if (color === "b") {
                    setBetter('w')
                    vh = 100
                } else {
                    setBetter('w')
                    vh = 0
                }
            }
        }

        if (playerColor === "black") {
            vh = 100 - vh
        }

        setVh(vh)

    }, [mate, playerColor])

    const displayEval = () => {
        if (mate !== 0) {
            return "#" + mate
        } else {
            const symbol = better === "w" ? "+" : "-"
            return symbol + Math.abs(displayNum).toFixed(1)
        }
    }

    const evalStyle = () => {
        if (playerColor === "white") {
            return better === "w" ?
                {color: "black", top: '94%'} :
                {color: "white", top: '1%'}
        } else {
            return better=== "b" ?
            {color: "white", top: '94%'} :
            {color: "black", top: '1%'}
        }
    }
        
    return (
        <div id="evaluation-bar-holder" style={{backgroundColor: bottomColor}}>
            <p id="eval" style={evalStyle()}>{displayEval()}</p>
            <div id="evaluation-bar" style={{height: `${vh}%`, transition: 'height 2s', backgroundColor: topColor}} />
        </div>
    );
}

export default EvaluationBar;