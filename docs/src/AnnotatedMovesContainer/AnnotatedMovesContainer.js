import Legend from "../Legend/Legend"
import { useSelector, useDispatch } from "react-redux"
import "./AnnotatedMovesContainer.css"

const AnnotatedMovesContainer = ({annotated}) => {

    const chess = useSelector(state => state.game)
    const dispatch = useDispatch()

    const onMoveClick = (move) => {
        chess.move(move)
        dispatch({type: "UPDATE_GAME", game: chess, fen: chess.fen(), pgn: chess.pgn()})
    }

    const showAnnotatedMoves = () => {
        return annotated?.map(opening => {
            const arr = opening.moves.split(' ')
            const move = arr[arr.length - 1]
            return (
            <button 
                key={opening.name} 
                className={`annotated-move ${opening?.analysis || "normal"}`}
                onClick={() => onMoveClick(move)}
            >
            {move}
            </button>
        )})
    }

    return (
        <div id="continuations">
            <div id="continuations-title-and-legend">
                <span id="continuations-title">Annotated Continuations:</span>
                <Legend
                    divId="good"
                    text={"Good moves are just that: good."} />
                <Legend
                    divId="forced"
                    text={`Though few moves are truly forced upon a player, 
                    sometimes a single move is the only reasonable option, 
                    and therefore is "forced" in a sense. These moves have 
                    been highlighted to help you understand that it's only 
                    really necessary to study these moves if you're interested 
                    in why these moves are better or why others are worse.`} />
                <Legend
                    divId="bad"
                    text={`Occasionaly we'll specifically discourage a popular 
                    move due to either a better move being available, or the 
                    resulting complications being tough for beginners to understand.`} />
                <br />
            </div>
            {showAnnotatedMoves()}
        </div>
    )
}

export default AnnotatedMovesContainer