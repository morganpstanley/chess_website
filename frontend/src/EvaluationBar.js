import { Component } from "react"
import "./EvaluationBar.css"

class EvaluationBar extends Component {

    vh() {
        if (this.props.mate !== 0) return 100;
    }

    render() {
        let vh =  this.props.currentPlayer === 'w' ? 
        19 - (this.props.evaluation  * 2) :
        19 + (this.props.evaluation  * 2);
        return (
            <div id="evaluation-bar-holder">
                <div id="evaluation-bar" style={{height: `${vh}vw`, transition: 'height 2s'}}>    
                    <p id="eval">{this.props.currentPlayer === 'b' ? '-' : '+'}{this.props.evaluation.toFixed(2)} </p>
                </div>
            </div>
        )};
}

export default EvaluationBar;