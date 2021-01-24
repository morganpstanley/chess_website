import { useState, useEffect } from "react"
import "./EvaluationBar.css"

const EvaluationBar = ({currentPlayer, evaluation}) => {

    const [vh, setVh] = useState(0);
    const [better, setBetter] = useState('w');
    const [displayNum, setDisplayNum] = useState(0.2)

    useEffect(() => {
        
        //set eval bar height
        const  evalHeight =  currentPlayer === 'w' ? 
        50 - (evaluation  * 4) :
        50 + (evaluation  * 4);
        
        if (evalHeight > 100) {
            setVh(98)
        } else if (evalHeight < 0) {
            setVh(2)
        } else {
            setVh(evalHeight)
        }

        if (evaluation > 0) {
            setBetter(currentPlayer)
            setDisplayNum(evaluation.toFixed(2))
        } else {
            setDisplayNum(Math.abs(evaluation).toFixed(2))
        };

    }, [currentPlayer, evaluation, displayNum]);
        
    return (
        <div id="evaluation-bar-holder">
            <p id="eval">{better === 'w'  ? '+' : '-'}{displayNum} </p>
            <div id="evaluation-bar" style={{height: `${vh}%`, transition: 'height 2s'}} />
        </div>
    );
}

export default EvaluationBar;