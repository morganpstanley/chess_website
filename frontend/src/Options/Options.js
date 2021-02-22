import "./Options.css"
import { useDispatch } from "react-redux"

const Options = () => {

    const dispatch = useDispatch();

    const handleChange = (event) => {
        let {name, value} = event.target;
        if (value !== "white" && value !== "black") {value = JSON.parse(value)};
        dispatch({type: name, payload: value});
    }

    return (
        <div id="options">
            <form className="option" id="player-color-option">
                <h3>Player Color</h3>
                <div className="switch-field">
                    <input onChange={handleChange} type="radio" id="radio-one" name="SET_USER_COLOR" value="white" defaultChecked/>
                    <label htmlFor="radio-one">White</label>
                    <input onChange={handleChange} type="radio" id="radio-two" name="SET_USER_COLOR" value="black" />
                    <label htmlFor="radio-two">Black</label>
                </div>
            </form>
            <form className="option" id="computer-player-option">
                <h3>Opponent</h3>
                <div className="switch-field">
                    <input onChange={handleChange} type="radio" id="radio-three" name="SET_OPPONENT" value="false" defaultChecked/>
                    <label htmlFor="radio-three">Human</label>
                    <input onChange={handleChange} type="radio" id="radio-four" name="SET_OPPONENT" value="true" />
                    <label htmlFor="radio-four">Computer</label>
                </div>
            </form>
            <form className="option" id="computer-player-level">
                <h3>Computer Level</h3>
                <div className="switch-field">
                    <input onChange={handleChange} type="radio" id="radio-five" name="SET_COMPUTER_DIFFICULTY" value="1" defaultChecked/>
                    <label htmlFor="radio-five">1</label>
                    <input onChange={handleChange} type="radio" id="radio-six" name="SET_COMPUTER_DIFFICULTY" value="2" />
                    <label htmlFor="radio-six">2</label>
                    <input onChange={handleChange} type="radio" id="radio-seven" name="SET_COMPUTER_DIFFICULTY" value="3" />
                    <label htmlFor="radio-seven">3</label>
                    <input onChange={handleChange} type="radio" id="radio-eight" name="SET_COMPUTER_DIFFICULTY" value="4" />
                    <label htmlFor="radio-eight">4</label>
                    <input onChange={handleChange} type="radio" id="radio-nine" name="SET_COMPUTER_DIFFICULTY" value="5" />
                    <label htmlFor="radio-nine">5</label>
                </div>
            </form>
        </div>
    );
}

export default Options;