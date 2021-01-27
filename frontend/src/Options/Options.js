import "./Options.css"

const Options = (props) => {

    return (
        <div id="options">
            <div className="option" id="computer-player-option">
                <label className="switch">
                    <input defaultChecked type="checkbox" />
                    <span onClick={() => props.changeOpponent()} className="slider round"></span>
                </label>
                <span className="options-text">computer opponent?</span>
            </div>
            <div className="option" id="player-color-option">
                <label className="switch">
                    <input defaultChecked type="checkbox" />
                    <span onClick={() => props.changePlayerColor()} className="slider round"></span>
                </label>
                <span className="options-text">player color</span>
            </div>
        </div>
    );
}

export default Options;