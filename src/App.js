import './App.css';
import { useState } from 'react';
import Navbar from './Components/Navbar';
import About from './Components/About';
import Home from './Components/Home';
import Alert from './Components/Alert'
import NoteState from './Context/notes/noteState';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from './Components/Login';
import Signup from './Components/Signup';

function App() {
  const [alert, setAlert] = useState(null)

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })

    setTimeout(() => {
      setAlert(null)
    }, 1500)
  }

  return (
    <>
      <Router>
        <NoteState>
          <Navbar />
          <Alert alert={alert}/>
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Home showAlert={showAlert} />} />
              <Route exact path="/about" element={<About />} />
              <Route exact path="/login" element={<Login showAlert={showAlert} />} />
              <Route exact path="/signup" element={<Signup showAlert={showAlert} />} />
            </Routes>
          </div>
        </NoteState>
      </Router>
    </>
  );
}

export default App;
