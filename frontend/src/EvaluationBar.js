import { Component } from "react"
import "./EvaluationBar.css"

class EvaluationBar extends Component {

    state = {
        currentPlayer: 'w',
        viewHeight: 100 - (this.props.evaluation  * 10)
    }

    render() {
        let vh =  this.props.currentPlayer === 'w' ? 
        40 - (this.props.evaluation  * 3.5) :
        40 + (this.props.evaluation  * 3.5);
        return (
            <div id="evaluation-bar" style={{height: `${vh}vh`, transition: 'height 2s'}}>    
            <p id="eval">{this.props.currentPlayer === 'b' ? '-' : '+'}{this.props.evaluation.toFixed(2)} </p>
            </div>
        )};
}

export default EvaluationBar;