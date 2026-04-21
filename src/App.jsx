import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Games from './pages/Games'
import Game from './pages/Game'
import Rules from './pages/Rules'
import Scores from './pages/Scores'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'

export default function App(){
  return (
    <div className="app-root">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/games" element={<Games/>} />
          <Route path="/game/:gameId" element={<Game/>} />
          <Route path="/rules" element={<Rules/>} />
          <Route path="/scores" element={<Scores/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
      </main>
    </div>
  )
}
