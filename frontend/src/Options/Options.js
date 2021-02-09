import "./Options.css"

const Options = ({changeOpponent, changePlayerColor, changeAnalyzeDepth}) => {

    return (
        <div id="options">
            <div className="option" id="computer-player-option">
                <span className="options-text">Computer Opponent</span>
                <label className="switch">
                    <input type="checkbox" />
                    <span onClick={() => changeOpponent()} className="slider round"></span>
                </label>
            </div>
            <div className="option" id="player-color-option">
                <span className="options-text" id="player-color">Player Color</span>
                <label className="switch">
                    <input type="checkbox" />
                    <span onClick={() => changePlayerColor()} className="slider round"></span>
                </label>
            </div>
            <div className="option" id="computer-depth-option">
                <span className="options-text">Stockfish Analysis Depth</span>
                <form>
                    <input onChange={(num) => changeAnalyzeDepth(num)} type="number" id="quantity" name="quantity" min="1" max="5" />
                </form>
            </div>
        </div>
    );
}

export default Options;