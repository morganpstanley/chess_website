import React from 'react';
import { useSelector } from "react-redux"
import InfoBox from "../InfoBox/InfoBox"
import Chessboard from "../Chessboard/ChessBoard"

import 'react-chessground/dist/styles/chessground.css'
import "./Dashboard.css"

const Dashboard = () => {

  const chess = useSelector(state => state.game)

  return (
    <div id ="dashboard">

    <Chessboard />

    <InfoBox 
      chess={chess}
      fen={chess.fen()} 
      pgn={chess.pgn()}
    />

    </div>
  );
}

export default Dashboard