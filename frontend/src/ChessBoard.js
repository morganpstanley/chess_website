import React, {useState} from 'react';
import Chessground from 'react-chessground'
import 'react-chessground/dist/styles/chessground.css'
import Chess from "chess.js"
import rook from "./images/wR.svg"
import queen from "./images/wQ.svg"
import bishop from "./images/wB.svg"
import knight from "./images/wN.svg"
import EvaluationBar from './EvaluationBar';
import Modal from "react-modal"
import "./chessboard.css"
import InfoBox from "./InfoBox"

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

const stockfish = new Worker('stockfish.js')

Modal.setAppElement('#root')

const Game = () => {

  const [chess] = useState(new Chess('8/7P/k6K/8/8/8/8/8 w - - 0 1'))
  const [pendingMove, setPendingMove] = useState()
  const [showModal, setShowModal] = useState(false)
  const [fen, setFen] = useState('8/7P/k6K/8/8/8/8/8 w - - 0 1')
  const [lastMove, setLastMove] = useState()
  const [evaluation, setEvaluation] = useState(0.0)

  const onMove = (from, to) => {
    const moves = chess.moves({ verbose: true })
    for (let i = 0, len = moves.length; i < len; i++) { /* eslint-disable-line */
      if (moves[i].flags.indexOf("p") !== -1 && moves[i].from === from) {
        setPendingMove([from, to])
        setShowModal(true)
        return
      }
    }
    if (chess.move({ from, to, promotion: "x" })) {
      stockfish.postMessage(`position fen ${chess.fen()}`)
      setFen(chess.fen())
      setLastMove([from, to])
      setTimeout(computerMove, 500)
    }
  }

  const computerMove = () => {
    setShowModal(false);
    stockfish.postMessage(`position fen ${chess.fen()}`)
    stockfish.postMessage('go depth 19')
  }

  stockfish.onmessage = (event) => { 
    var match = event.data.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
    var evaluation = event.data.match(/(?<=cp )(-?\d*)/);
    // var mate = event.data.match(/(?<=mate )(-?\d*)/)
    if (evaluation != null) {
      setEvaluation(evaluation[1] / 100)
    }
    if (match != null) {
      chess.move({from: match[1], to:match[2]});
      setFen(chess.fen())
      setLastMove([match[1], match[2]])
    }
  }

  const promotion = e => {
    console.log('d', pendingMove)
    const from = pendingMove[0]
    const to = pendingMove[1]
    chess.move({ from, to, promotion: e })
    setFen(chess.fen())
    setLastMove([from, to])
    setShowModal(false)
    setTimeout(computerMove, 500)
  }

  const turnColor = () => {
    return chess.turn() === "w" ? "white" : "black"
  }

  const calcMovable = () => {
    const dests = new Map()
    chess.SQUARES.forEach(s => {
      const ms = chess.moves({ square: s, verbose: true })
      if (ms.length) dests.set(s, ms.map(m => m.to))
    })
    return {
      free: false,
      dests,
      color: "white"
    }
  }

  return (
    <div id ="chessboard">
      <EvaluationBar currentPlayer={chess.currentPlayer} evaluation={evaluation}/>
      <Chessground
        width="38vw"
        height="38vw"
        turnColor={turnColor()}
        movable={calcMovable()}
        lastMove={lastMove}
        fen={fen}
        onMove={onMove}
        style={{ margin: "auto" }}
      />
    <InfoBox fen={chess.fen()}/>
    <Modal isOpen={showModal} style={customStyles}>
      <div style={{ textAlign: "center", cursor: "pointer" }}>
        <span role="presentation" onClick={() => promotion("q")}>
          <img src={queen} alt="" style={{ width: 50 }} />
        </span>
        <span role="presentation" onClick={() => promotion("r")}>
          <img src={rook} alt="" style={{ width: 50 }} />
        </span>
        <span role="presentation" onClick={() => promotion("b")}>
          <img src={bishop} alt="" style={{ width: 50 }} />
        </span>
        <span role="presentation" onClick={() => promotion("n")}>
          <img src={knight} alt="" style={{ width: 50 }} />
        </span>
      </div>
    </Modal>
  </div>
  );
}

export default Game