import Modal from "react-modal"
import rook from "../images/pieces/wR.svg"
import queen from "../images/pieces/wQ.svg"
import bishop from "../images/pieces/wB.svg"
import knight from "../images/pieces/wN.svg"

import "./PromotionPrompt.css"

Modal.setAppElement('#root')

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

const PromotionPrompt = ({promotion, showModal}) => {

    // const [showModal, setShowModal] = useState(false)

    return (
        <div id="promotion-prompt">
        <Modal isOpen={showModal} style={customStyles}>
            <div style={{ textAlign: "center", cursor: "pointer" }}>
                <span role="presentation" onClick={() => promotion("q")}>
                    <img src={queen} alt="" style={{ width: 50 }} />
                </span>
                <span role="presentation" onClick={() => promotion("r")}>
                    <img src={rook} alt="" style={{ width: 50 }} />
                </span>
                <span role="presentation" onClick={() => promotion("b")}>
                    <img src={bishop} alt="" style={{ width: 50 }} />
                </span>
                <span role="presentation" onClick={() => promotion("n")}>
                    <img src={knight} alt="" style={{ width: 50 }} />
                </span>
            </div>
        </Modal>
        </div>
    );
}

export default PromotionPrompt;