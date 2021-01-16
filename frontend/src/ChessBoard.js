import React, {useState} from 'react';
import Chessground from 'react-chessground'
import 'react-chessground/dist/styles/chessground.css'
import Chess from "chess.js"
import { Col, Modal } from "antd"
import rook from "./images/wR.svg"
import queen from "./images/wQ.svg"
import bishop from "./images/wR.svg"
import knight from "./images/wR.svg"
import EvaluationBar from './EvaluationBar';
import "./chessboard.css"
import InfoBox from "./InfoBox"


const stockfish = new Worker('stockfish.js')

const Game = () => {

  const [chess] = useState(new Chess())
  const [pendingMove, setPendingMove] = useState()
  const [selectVisible, setSelectVisible] = useState(false)
  const [fen, setFen] = useState("")
  const [lastMove, setLastMove] = useState()
  const [evaluation, setEvaluation] = useState(0.0)
  const [mate, setMate] = useState(0)

  const onMove = (from, to) => {
    const moves = chess.moves({ verbose: true })
    for (let i = 0, len = moves.length; i < len; i++) { /* eslint-disable-line */
      if (moves[i].flags.indexOf("p") !== -1 && moves[i].from === from) {
        setPendingMove([from, to])
        setSelectVisible(true)
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
    stockfish.postMessage('go depth 19')
  }

  stockfish.onmessage = (event) => { 
    var match = event.data.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
    var evaluation = event.data.match(/(?<=cp )(-?\d*)/);
    var mate = event.data.match(/(?<=mate )(-?\d*)/)
    console.log(event.data)
    // if (mate != null) {
    //   setEvaluation(mate)
    // }
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
    const from = pendingMove[0]
    const to = pendingMove[1]
    chess.move({ from, to, promotion: e })
    setFen(chess.fen())
    setLastMove([from, to])
    setSelectVisible(false)
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
      <Col span={6} />
      <Col span={12} style={{ top: "10%" }}>
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
      </Col>
      <InfoBox blah={chess.fen()} fen={chess.fen()}/>
      <Col span={6} />
      <Modal visible={selectVisible} footer={null} closable={false}>
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