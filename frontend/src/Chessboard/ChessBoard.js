import React, {useState} from 'react';
import Chessground from 'react-chessground'
import Chess from "chess.js"
import EvaluationBar from '../EvaluationBar/EvaluationBar';
import InfoBox from "../InfoBox/InfoBox"
import CaptureArea from "../CaptureArea/CaptureArea"
import PromotionPrompt from "../PromotionPrompt/PromotionPrompt"

import 'react-chessground/dist/styles/chessground.css'
import "./chessboard.css"

const stockfish = new Worker('stockfish.js')

const Game = () => {

  const [chess] = useState(new Chess('k7/6KP/8/8/8/8/8/8 w - - 0 1'))
  const [pendingMove, setPendingMove] = useState()
  const [fen, setFen] = useState('k7/6KP/8/8/8/8/8/8 w - - 0 1')
  const [lastMove, setLastMove] = useState()
  const [evaluation, setEvaluation] = useState(0.0)
  const [computerOpponent, setComputerOpponent] = useState(true)
  const [evalColor, setEvalColor] = useState('w')
  const [mate, setMate] = useState(0)
  const [playerColor, setPlayerColor] = useState('white')
  const [showModal, setShowModal] = useState(false)

  const onMove = (from, to) => {
    const moves = chess.moves({ verbose: true })
    for (let i = 0, len = moves.length; i < len; i++) { /* eslint-disable-line */
      if (moves[i].flags.indexOf("p") !== -1 && moves[i].from === from) {
        stockfish.postMessage(`position fen ${chess.fen()}`)
    stockfish.postMessage('go depth 19')
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
    stockfish.postMessage('go depth 15')
  }

  stockfish.onmessage = (event) => { 
    var bestMove = event.data.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
    var evaluation = event.data.match(/(?<=cp )(-?\d*)/);
    var mate = event.data.match(/(?<=mate )(-?\d*)/)
    if (evaluation != null) {
      setEvaluation(evaluation[1] / 100)
      setEvalColor(chess.turn())
    }
    if (bestMove != null && computerOpponent) {
      chess.move({from: bestMove[1], to:bestMove[2]});
      setFen(chess.fen())
      setLastMove([bestMove[1], bestMove[2]])
    }
    if (mate) {
      setMate(mate[0])
    }
  }

  const promotion = e => {
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
      color: turnColor()
    }
  }

  const changeOpponent = () => {
    setComputerOpponent(!computerOpponent)
    return computerOpponent
  }

  const changePlayerColor = () => {
      setPlayerColor(playerColor === "white" ? "black" : "white")
  }

  return (
    <div id ="dashboard">

      <div id="chessboard">
        <EvaluationBar currentPlayer={evalColor} evaluation={evaluation} mate={mate}/>

        <Chessground
          orientation={playerColor}
          turnColor={turnColor()}
          movable={calcMovable()}
          lastMove={lastMove}
          fen={fen}
          onMove={onMove}
        />

        <CaptureArea fen={chess.fen()}/>
      </div>

    <InfoBox 
      fen={chess.fen()} 
      changeOpponent={changeOpponent} 
      changePlayerColor={changePlayerColor} 
    />

    <PromotionPrompt promotion={promotion} showModal={showModal} />

    </div>
  );
}

export default Game