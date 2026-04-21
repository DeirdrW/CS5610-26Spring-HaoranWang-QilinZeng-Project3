import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logout } from '../services/userService'
import '../styles/navbar.css'

export default function Navbar(){
  const navigate = useNavigate()
  const { user, isAuthenticated, setUser } = useAuth()

  async function handleLogout() {
    await logout()
    setUser(null)
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="brand"><Link to="/">Sudoku</Link></div>
      <input id="nav-toggle" className="nav-toggle" type="checkbox" />
      <label htmlFor="nav-toggle" className="nav-toggle-label">Menu</label>
      <ul className="nav-links">
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/games" end>Games</NavLink></li>
        <li><NavLink to="/rules">Rules</NavLink></li>
        <li><NavLink to="/scores">High Scores</NavLink></li>
        {isAuthenticated ? (
          <>
            <li><span className="nav-user">@{user.username}</span></li>
            <li><button className="button secondary" type="button" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/register">Register</NavLink></li>
          </>
        )}
      </ul>
    </header>
  )
}
