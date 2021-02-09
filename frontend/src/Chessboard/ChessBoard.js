import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux"
import Chessground from 'react-chessground'
import EvaluationBar from '../EvaluationBar/EvaluationBar';
import CaptureArea from "../CaptureArea/CaptureArea"
import PromotionPrompt from "../PromotionPrompt/PromotionPrompt"

import 'react-chessground/dist/styles/chessground.css'
import "./Chessboard.css"

const stockfishPlayer = new Worker('stockfish.js')
const stockfishWhite = new Worker('stockfish.js')
const stockfishBlack = new Worker('stockfish.js')

const Chessboard = ({playerColor, computerOpponent}) => {

  const chess = useSelector(state => state.game)
  const fen = useSelector(state => state.fen)
  const depth = useSelector(state => state.depth)
  const [currentDepth, setCurrentDepth] = useState(0)
  const [pendingMove, setPendingMove] = useState()
  const [lastMove, setLastMove] = useState()
  const [evaluation, setEvaluation] = useState({evaluation: 0.2, color: "w", mate: 0})
  const [showModal, setShowModal] = useState(false)
  const dispatch = useDispatch()

  const stockfishMove = () => {
    setShowModal(false)
    // setStockfish()
    stockfishPlayer.postMessage(`position fen ${fen}`)
    stockfishPlayer.postMessage('go depth 15')
  }

  const onMove = (from, to) => {
    const moves = chess.moves({ verbose: true })

    //check if move is pawn promotion
    for (let i = 0, len = moves.length; i < len; i++) { /* eslint-disable-line */
      if (moves[i].flags.indexOf("p") !== -1 && moves[i].from === from) {
        setPendingMove([from, to])
        setShowModal(true)
        return
      }
    }

    move(from, to)

    //right now onMove is only being used after player moves, not computer, so can computer promote?
    if (computerOpponent) {stockfishMove()};

  }

  // const setStockfish = () => {
  //   stockfishPlayer.postMessage('setoption name Skill Level value 0')
  //   stockfishPlayer.postMessage('setoption name Skill Level Maximum Error value 900')
  //   stockfishPlayer.postMessage('setoption name Skill Level Probability value 10')
  // }

  const stockfishAnalyze = () => {
    if (chess.turn() === "w") {
      stockfishBlack.postMessage('stop')
      stockfishWhite.postMessage(`position fen ${fen}`)
      stockfishWhite.postMessage(`go depth 23`)
    } else {
      stockfishWhite.postMessage('stop')
      stockfishBlack.postMessage(`position fen ${fen}`)
      stockfishBlack.postMessage(`go depth 23`)
    }
  }

  stockfishPlayer.onmessage = (event) => { 
    let bestMove = event.data.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);

    if (bestMove) {
      move(bestMove[1], bestMove[2]);
    }
  }

  useEffect((stockfishAnalyze), [fen, chess])

  const move = (from, to) => {
    chess.move({from, to});
    setLastMove([from, to]);
    dispatch({type: "UPDATE_GAME", game: chess, fen: chess.fen(), pgn: chess.pgn()})
    stockfishAnalyze();
  }

  stockfishWhite.onmessage = (event) => {
   handleMessage(event, "w")
  }

  stockfishBlack.onmessage = (event) => {
   handleMessage(event, "b")
  }

  const handleMessage = (event, color) => {
    let evaluation = event.data.match(/(?<=cp )(-?\d*)/);
    let mate = event.data.match(/(?<=mate )(-?\d*)/);
    let matchDepth = event.data.match(/(?<=depth )(-?\d*)/);
    if (matchDepth !== null && matchDepth[0] !== currentDepth ) {
      setCurrentDepth(matchDepth[0])
    }
    if (evaluation != null && chess.turn() === color) {
      setEvaluation(
        {evaluation: evaluation[1] / 100, 
          color: color,
          mate: 0
        })
    }
    if (mate) {
      setEvaluation({...evaluation, mate: mate[0]})
    }
  }

  const promotion = e => {
    const from = pendingMove[0]
    const to = pendingMove[1]
    chess.move({ from, to, promotion: e })
    setLastMove([from, to])
    setShowModal(false)
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

  useEffect(() => {
    if (playerColor !== turnColor() && computerOpponent) {
      stockfishMove()
    }
  })

  return (
      <div id="chessboard">
        <EvaluationBar playerColor={playerColor} evaluationObj={evaluation}/>

        <Chessground
          orientation={playerColor}
          turnColor={turnColor()}
          movable={calcMovable()}
          lastMove={lastMove}
          fen={chess.fen()}
          onMove={onMove}
        />

        <div id="depth">
          <span id="depth-title">DEPTH</span> 
          <br />
          <span id="depth-num">{currentDepth}</span>
        </div>

        <CaptureArea/>

        <PromotionPrompt promotion={promotion} showModal={showModal}/>
      </div>
  );
}

export default Chessboard