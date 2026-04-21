import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/userService'
import { useAuth } from '../context/AuthContext'
import '../styles/register.css'

export default function Register(){
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const disabled = !username.trim() || !password || !verifyPassword || password !== verifyPassword || submitting

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (password !== verifyPassword) {
      setError('Passwords do not match')
      return
    }
    setSubmitting(true)
    try {
      const user = await register(username.trim(), password)
      setUser(user)
      navigate('/games')
    } catch (err) {
      setError(err?.response?.data?.error || 'Register failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <section className="form-card">
        <h1>Create an account</h1>
        <p>Pick a username that matches your puzzle energy.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="register-username">Username</label>
            <input id="register-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input id="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="register-confirm">Verify Password</label>
            <input id="register-confirm" type="password" value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} required />
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="button" type="submit" disabled={disabled}>Sign Up</button>
        </form>
      </section>
    </main>
  )
}
