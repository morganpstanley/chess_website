import React, {useState} from 'react';
import { useSelector, useDispatch } from "react-redux"
import Chessground from 'react-chessground'
import EvaluationBar from '../EvaluationBar/EvaluationBar';
import CaptureArea from "../CaptureArea/CaptureArea"
import PromotionPrompt from "../PromotionPrompt/PromotionPrompt"
import { useEffectWhen } from '../helpers'

import 'react-chessground/dist/styles/chessground.css'
import "./chessboard.css"

const stockfishPlayer = new Worker('/stockfish.js')
const stockfishWhite = new Worker('/stockfish.js')
const stockfishBlack = new Worker('/stockfish.js')

const Chessboard = () => {

  const [pendingMove, setPendingMove] = useState()
  const [lastMove, setLastMove] = useState()
  const [evaluation, setEvaluation] = useState({evaluation: 0.2, color: "w", mate: 0})
  const [depth, setDepth] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const computerOpponent = useSelector(state => state.computerOpponent)
  const playerColor = useSelector(state => state.userColor)
  const chess = useSelector(state => state.game)
  const fen = useSelector(state => state.fen)
  const computerLevel = useSelector(state => state.difficulty)
  const dispatch = useDispatch()

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
  }

  useEffectWhen(() => {
    let level = computerLevel === 1 ? 0 : (computerLevel - 1) * 5
    stockfishPlayer.postMessage(`setoption name Skill Level value ${level}`)
  }, [computerLevel])

  const stockfishMove = () => {
    if (showModal === true) setShowModal(false);
    stockfishPlayer.postMessage(`position fen ${chess.fen()}`)
    stockfishPlayer.postMessage('go depth 15')
  }

  const stockfishAnalyze = () => {
    if (chess.turn() === "w") {
      stockfishBlack.postMessage('stop')
      stockfishWhite.postMessage(`position fen ${chess.fen()}`)
      stockfishWhite.postMessage('go depth 23')
    } else {
      stockfishWhite.postMessage('stop')
      stockfishBlack.postMessage(`position fen ${chess.fen()}`)
      stockfishBlack.postMessage('go depth 23')
    }
  }

  stockfishPlayer.onmessage = (event) => { 
    let bestMove = event.data.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);

    if (bestMove) {
      move(bestMove[1], bestMove[2]);
    }
  }

  const move = (from, to) => {
    chess.move({from, to});
    dispatch({type: "UPDATE_GAME", game: chess, fen: chess.fen(), pgn: chess.pgn()})
    setLastMove([from, to]);
  }

  useEffectWhen(() => {
    stockfishAnalyze()
  }, [fen])

  stockfishWhite.onmessage = (event) => {
   handleMessage(event, "w")
  }

  stockfishBlack.onmessage = (event) => {
   handleMessage(event, "b")
  }

  const handleMessage = (event, color) => {
    let evaluation = event.data.match(/(?:cp )(-?\d*)/);
    let mate = event.data.match(/(?:mate )(-?\d*)/);
    let currDepth = event.data.match(/(?:depth )(-?\d*)/);
    if (currDepth?.[1] && currDepth[1] !== depth ) {
      setDepth(currDepth[1])
    }
    if (evaluation != null && chess.turn() === color) {
      setEvaluation(
        {evaluation: evaluation[1] / 100, 
          color: color,
          mate: 0
        })
    }
    if (mate?.[1]) {
      setEvaluation(
        {...evaluation,
          color: color, 
          mate: mate[1]})
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

useEffectWhen (() => {
  if (chess.game_over()) {
    setTimeout(onGameOver, 500)
  }
}, [chess.game_over()])

const onGameOver = () => {
  alert('Game over, bro.')
}

useEffectWhen(() => {
  if (turnColor() !== playerColor && computerOpponent) {
    stockfishMove()
  }
}, [lastMove, computerOpponent, playerColor])

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
          animation={{duration: 300}}
        />

        <div id="depth">
          <span id="depth-title">DEPTH</span> 
          <br />
          <span id="depth-num">{depth}</span>
        </div>

        <CaptureArea fen={chess.fen()}/>

        <PromotionPrompt promotion={promotion} showModal={showModal}/>
      </div>
  );
}

export default Chessboard