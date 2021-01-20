import { Component } from "react"
import "./EvaluationBar.css"

class EvaluationBar extends Component {

    vh() {
        if (this.props.mate !== 0) return 100;
    }

    render() {
        let vh =  this.props.currentPlayer === 'w' ? 
        50 - (this.props.evaluation  * 4) :
        50 + (this.props.evaluation  * 4);

        if (vh > 100) {vh = 98}
        
        return (
            <div id="evaluation-bar-holder">
                <div id="evaluation-bar" style={{height: `${vh}%`, transition: 'height 2s'}}>    
                    <p id="eval">{this.props.currentPlayer === 'b' ? '-' : '+'}{this.props.evaluation.toFixed(2)} </p>
                </div>
            </div>
        )};
}

export default EvaluationBar;