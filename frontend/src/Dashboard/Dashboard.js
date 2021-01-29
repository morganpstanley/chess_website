import React, { useState } from 'react';
import Chess from "chess.js"
import InfoBox from "../InfoBox/InfoBox"
import Chessboard from "../Chessboard/Chessboard"

import 'react-chessground/dist/styles/chessground.css'
import "./Dashboard.css"

const Dashboard = () => {

  const [chess] = useState(new Chess())
  const [fen, setFen] = useState()
  const [computerOpponent, setComputerOpponent] = useState(true)
  const [playerColor, setPlayerColor] = useState('white')

  const changeOpponent = () => {
    setComputerOpponent(!computerOpponent)
    return computerOpponent
  }

  const changePlayerColor = () => {
      setPlayerColor(playerColor === "white" ? "black" : "white")
  }

  return (
    <div id ="dashboard">

    <Chessboard 
      chess={chess} 
      orientation={playerColor}
      computerOpponent={computerOpponent}
      setFen={setFen}
    />

    <InfoBox 
      fen={chess.fen()} 
      changeOpponent={changeOpponent} 
      changePlayerColor={changePlayerColor} 
    />

    </div>
  );
}

export default Dashboard