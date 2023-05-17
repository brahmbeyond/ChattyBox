import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn.jsx';
import SignOut from './components/SignOut';
import Cookies from 'universal-cookie';
import EnterRoom from './components/EnterRoom';
import Chat from './components/Chat';
import './App.css'
import Error from './components/Error.jsx'
import Footer from './components/Footer.jsx';

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [isRoom, setIsRoom] = useState(false);

  return (
    <>
      <Router>

        <Routes>
          <Route path="/" element={isAuth ? <EnterRoom setIsRoom={setIsRoom} isRoom={isRoom} /> : <SignIn setIsAuth={setIsAuth} />} />
          <Route exact path="/chat/:roomName" element={ <Chat />} />
          <Route path="*" element={<Error />} />

        </Routes>
        {isAuth && <SignOut setIsAuth={setIsAuth} setIsRoom={setIsRoom} isRoom={isRoom} />}
<Footer/>
      </Router>
    </>
  );
}

export default App;
