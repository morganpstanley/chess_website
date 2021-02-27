import Chess from 'chess.js';

const initialState = {
    game: new Chess(),
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    pgn: "",
    depth: 15,
    computerOpponent: false,
    difficulty: 1,
    userColor: "white"
}

export default function reducer(state = initialState, action) {

    console.log(state)

    switch (action.type) {

        case 'UPDATE_GAME':
            return {
                ...state,
                game: action.game,
                fen: action.fen,
                pgn: action.pgn
            }
        
        case "SET_STOCKFISH_DEPTH":
            return {
                ...state,
                depth: action.depth
            }

        case "SET_OPPONENT":
            return {
                ...state,
                computerOpponent: action.payload
            }

        case "SET_COMPUTER_DIFFICULTY":
            return {
                ...state,
                difficulty: action.payload
            }

        case "SET_USER_COLOR":
            return {
                ...state,
                userColor: action.payload
            }

        default:        
            return state
    }
  }