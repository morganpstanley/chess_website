import React, {Component} from 'react';
import Chess from 'chess.js';
import EvaluationBar from './EvaluationBar'
import {Chessboard, INPUT_EVENT_TYPE, MOVE_INPUT_MODE, COLOR} from "cm-chessboard"
import "./chessboard.css"

var stockfish = new Worker("stockfish.js");

const game = new Chess();
let chessboard;

class WithMoveValidation extends Component {

    state = {
        evaluation: 0
    }

    componentDidMount() {
        chessboard = new Chessboard(document.getElementById("board"), {
            position: game.fen(),
            orientation: COLOR.white,
            moveInputMode: MOVE_INPUT_MODE.dragPiece,
            responsive: true,
            sprite: {
            url: "/chessboard-sprite.svg", // pieces and markers are stored as svg in the sprite
            grid: 40 // the sprite is tiled with one piece every 40px
            }
        })
        chessboard.enableMoveInput(this.inputHandler);
        this.computerMove()
    }

    inputHandler = (event) => {
        console.log(event)
        if (event.type === INPUT_EVENT_TYPE.moveDone) {
            const move = {from: event.squareFrom, to: event.squareTo}
            const result = game.move(move)
            setTimeout(this.computerMove, 2000)
            return result
        } else {
            return true
        }
    }

    computerMove = () => {
        stockfish.postMessage(`position fen ${game.fen()}`)
        stockfish.postMessage('go depth 15')
        let move;
        let evaluation;

        stockfish.onmessage = (event) => {  
            // console.log(event)       
            move = event.data.split(' ')[1]
            if (event.data.split(' ')[9] !== undefined) {
                evaluation = event.data.split(' ')[9] / 200
                this.setState({
                    evaluation: evaluation
                })
            }
            game.move(move, {sloppy:true});
            chessboard.setPosition(game.fen())
        };
    }

  render() {

    return (
        <div>
            <EvaluationBar evaluation={this.state.evaluation} currentPlayer={game.turn()}/>
            <div
                id='board'
                style={{
                float: "left",
                maxWidth: '80vh',
                maxHeight: '80vh',
                width: `calc(100vw - 40px)`,
                height: `calc(95vw - 40px)`,
                marginRight: '20p',
                marginBottom: '20px'
                }}
                >
            </div>
        </div>
    );
  }
}

export default WithMoveValidation;