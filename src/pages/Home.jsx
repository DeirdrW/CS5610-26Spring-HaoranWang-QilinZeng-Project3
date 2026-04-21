import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/home.css'

export default function Home(){
  return (
    <main className="page-home home-stage">
      <p className="hidden-label">Sudoku</p>
      <Link className="hero-button" to="/rules">Learn Rules</Link>
      <div className="sudoku-title" aria-hidden="true">
        <span>S</span>
        <span>U</span>
        <span>D</span>
        <span>O</span>
        <span>K</span>
        <span>U</span>
      </div>
      <Link className="hero-button" to="/games">Play Game</Link>
    </main>
  )
}
