import React, { useState } from 'react';
import InfoBox from "../InfoBox/InfoBox"
import Chessboard from "../Chessboard/Chessboard"

import 'react-chessground/dist/styles/chessground.css'
import "./Dashboard.css"

const Dashboard = () => {

  const [computerOpponent, setComputerOpponent] = useState(false)
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
      playerColor={playerColor}
      computerOpponent={computerOpponent}
    />

    <InfoBox 
      changeOpponent={changeOpponent} 
      changePlayerColor={changePlayerColor} 
    />

    </div>
  );
}

export default Dashboard