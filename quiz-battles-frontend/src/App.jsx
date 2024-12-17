import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { UserProvider } from "./contexts/UserContext";

import LoggedOutRoutes from "./components/LoggedOutRoutes.jsx";
import LoggedInRoutes from "./components/LoggedInRoutes.jsx";
import AdminRoutes from "./components/AdminRoutes.jsx";
import NavBar from "./components/NavBar.jsx"

import Home from "./pages/Home.jsx";
import GameWrapper from "./pages/GameWrapper.jsx";
import CreateItem from "./pages/CreateItem.jsx";
import CreateQuizBattle from "./pages/CreateQuizBattle.jsx";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Host from "./pages/Host.jsx";

import "./App.css"
import { SocketContextProvider } from "./contexts/SocketContext.jsx";

function App() {
  const toastOptions = {
    duration: 3000,
    style: { background: "#7480ff" , color: "black", fontWeight: "500" }
  };
  return (
    <Router>
      <UserProvider>
        <SocketContextProvider>
          <Toaster position="bottom-right" toastOptions={toastOptions} />
          <NavBar/>
          <div className="main-content">
            <div className="m-8">
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route element={<LoggedInRoutes/>}>
                  <Route path="/create" element={<CreateQuizBattle/>}/>
                  <Route path="/game" element={<GameWrapper/>}/>
                  <Route path="/host" element={<Host/>}/>
                </Route>
                <Route element={<LoggedOutRoutes/>}>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/signup" element={<SignUp/>}/>
                </Route>
                <Route element={<AdminRoutes/>}>
                  <Route path="/createitem" element={<CreateItem/>}/>
                </Route>
              </Routes>
            </div>
          </div>
        </SocketContextProvider>
      </UserProvider>
    </Router>
  )
}

export default App
