import Chess from 'chess.js';

const initialState = {
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    game: new Chess()
}

export default function reducer(state = initialState, action) {

    console.log(state)

    switch (action.type) {

        case 'UPDATE_FEN': 
            return {
                ...state,
                fen: action.fen
            }

        case 'UPDATE_GAME':
            return {
                ...state,
                game: action.game
            }
      default:        
        return state
    }
  }