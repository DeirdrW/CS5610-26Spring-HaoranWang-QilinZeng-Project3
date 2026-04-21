import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/userService'
import { useAuth } from '../context/AuthContext'
import '../styles/login.css'

export default function Login(){
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const disabled = !username.trim() || !password.trim() || submitting

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(username.trim(), password)
      setUser(user)
      navigate('/games')
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <section className="form-card">
        <div className="login-hero">
          <h1>Welcome back</h1>
          <p>Continue the streak by logging into your Sudoku vault.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-username">Username</label>
            <input id="login-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="button" type="submit" disabled={disabled}>Sign In</button>
        </form>
      </section>
    </main>
  )
}
