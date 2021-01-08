import './App.css';
import ChessBoard from "./ChessBoard"
import Header from "./Header"
import InfoBox from "./InfoBox"

function App() {
  return (
    <div className="App">
      <Header />
      <ChessBoard />
      <InfoBox />
    </div>
  );
}
  
export default App;
