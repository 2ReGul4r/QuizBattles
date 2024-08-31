import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import { UserProvider } from "./contexts/UserContext";

import LoggedOutRoutes from "./components/LoggedOutRoutes.jsx";
import LoggedInRoutes from "./components/LoggedInRoutes.jsx";
import AdminRoutes from "./components/AdminRoutes.jsx";
import NavBar from "./components/NavBar.jsx"

import Home from "./pages/home/Home";
import Game from "./pages/game/Game";
import CreateItem from "./pages/createitem/CreateItem";
import CreateQuizBattle from "./pages/createquizbattle/CreateQuizBattle.jsx";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";

import "./App.css"

function App() {
  const toastOptions = {
    duration: 3000,
    style: { background: "#7480ff" , color: "black", fontWeight: "500" }
  }
  return (
    <Router>
      <Toaster position="bottom-right" toastOptions={toastOptions} />
      <UserProvider>
        <NavBar/>
          <div className="m-8">
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/game" element={<Game/>}/>
              <Route element={<LoggedInRoutes/>}>
                <Route path="/create" element={<CreateQuizBattle/>}/>
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
      </UserProvider>
    </Router>
  )
}

export default App
