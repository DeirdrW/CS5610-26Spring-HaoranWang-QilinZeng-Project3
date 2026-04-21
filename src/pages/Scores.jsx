import React from 'react'
import { useEffect, useState } from 'react'
import { listHighscores } from '../services/highscoreService'
import '../styles/scores.css'

export default function Scores(){
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadScores() {
      setLoading(true)
      try {
        const highscores = await listHighscores()
        setScores(highscores)
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load highscores')
      } finally {
        setLoading(false)
      }
    }
    loadScores()
  }, [])

  return (
    <main>
      <h1 className="section-title" style={{marginTop:0}}>Hall of Fame</h1>
      {loading ? <p>Loading highscores...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      <div className="table-wrap score-table">
        <table>
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Username</th>
              <th scope="col">Wins</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={score.username}>
                <td><span className={`rank rank-${(index % 5) + 1}`}>{index + 1}</span></td>
                <td className={`tone tone-${(index % 5) + 1}`}>{score.username}</td>
                <td className={`tone tone-${(index % 5) + 1}`}>{score.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
