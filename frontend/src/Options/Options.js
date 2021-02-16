import "./Options.css"
import { useSelector, useDispatch } from "react-redux"

const Options = () => {

    const dispatch = useDispatch();
    const currentOpponent = useSelector(state => state.computerOpponent)
    const userColor = useSelector(state => state.userColor)

    return (
        <div id="options">
            <div className="option" id="computer-player-option">
                <span className="options-text">Opponent</span>
                <label className="switch">
                    <input type="checkbox" />
                    <span onClick={() => dispatch({type: "SET_OPPONENT", computerOpponent: !currentOpponent})} className="slider round"></span>
                </label>
            </div>
            <div className="option" id="player-color-option">
            <span className="options-text">Player Color</span>
                <label className="switch">
                    <input type="checkbox" />
                    <span onClick={() => dispatch({type: "SET_USER_COLOR", userColor: userColor === "white" ? "black" : "white"})} className="slider round"></span>
                </label>
            </div>
        </div>
    );
}

export default Options;