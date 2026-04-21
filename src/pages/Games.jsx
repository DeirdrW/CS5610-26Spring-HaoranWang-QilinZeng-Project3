import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createSudokuGame, listSudokuGames } from '../services/sudokuService'
import { useAuth } from '../context/AuthContext'
import '../styles/games.css'

export default function Games(){
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadGames() {
      setLoading(true)
      try {
        const gameList = await listSudokuGames()
        setGames(gameList)
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load games')
      } finally {
        setLoading(false)
      }
    }
    loadGames()
  }, [])

  async function handleCreate(difficulty) {
    setCreating(difficulty)
    setError('')
    try {
      const data = await createSudokuGame(difficulty)
      navigate(`/game/${data.gameId}`)
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to create game')
    } finally {
      setCreating('')
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <main>
      <h1 className="section-title" style={{marginTop:0}}>Games</h1>
      <div className="games-actions">
        <button className="button" type="button" disabled={!isAuthenticated || creating === 'EASY'} onClick={() => handleCreate('EASY')}>
          Create Easy Game
        </button>
        <button className="button secondary" type="button" disabled={!isAuthenticated || creating === 'NORMAL'} onClick={() => handleCreate('NORMAL')}>
          Create Normal Game
        </button>
      </div>
      {!isAuthenticated ? <p>Please login to create new games.</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      <section className="selection-list">
        {loading ? <p>Loading games...</p> : null}
        {!loading && games.length === 0 ? <p>No games yet. Create your first one.</p> : null}
        {games.map((game) => (
          <Link className="selection-card" to={`/game/${game._id}`} key={game._id}>
            <h3>{game.name}</h3>
            <span>{game.difficulty}</span>
            <span>By {game.createdByUsername}</span>
            <span>{formatDate(game.createdAt)}</span>
          </Link>
        ))}
      </section>
    </main>
  )
}
