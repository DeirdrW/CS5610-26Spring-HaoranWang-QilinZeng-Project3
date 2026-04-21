import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../styles/game.css'
import { useSudokuState, useSudokuDispatch } from '../context/SudokuContext'
import Board from '../components/Board'
import { useAuth } from '../context/AuthContext'
import { submitHighscore } from '../services/highscoreService'
import { deleteSudokuGame, getSudokuGame, updateSudokuGame } from '../services/sudokuService'
import { validateBoard } from '../utils/generator'

export default function Game(){
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const state = useSudokuState()
  const dispatch = useSudokuDispatch()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [completedFromServer, setCompletedFromServer] = useState(false)
  const [hasSubmittedWin, setHasSubmittedWin] = useState(false)
  const completionCheckInitializedRef = useRef(false)

  const boardStatus = useMemo(() => validateBoard(state.puzzle), [state.puzzle])
  const canDelete = Boolean(
    isAuthenticated &&
    user?.id &&
    game?.createdBy &&
    String(game.createdBy) === String(user.id)
  )

  useEffect(() => {
    if (authLoading) return
    async function loadGame() {
      setLoading(true)
      setError('')
      try {
        const data = await getSudokuGame(gameId)
        setGame(data.game)
        setCompletedFromServer(Boolean(data.completed))
        setHasSubmittedWin(Boolean(data.completed))
        completionCheckInitializedRef.current = false
        const isLocked = !isAuthenticated || Boolean(data.completed)
        dispatch({
          type: 'LOAD_GAME',
          payload: {
            board: data.userBoard,
            original: data.game.puzzle,
            size: data.game.puzzle.length,
            running: !isLocked,
            forceDisabled: isLocked,
            seconds: Number.isFinite(data.userSeconds) ? data.userSeconds : 0,
          },
        })
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load game')
      } finally {
        setLoading(false)
      }
    }
    loadGame()
  }, [gameId, isAuthenticated, authLoading, dispatch])

  useEffect(() => {
    if (!game) return
    if (authLoading) return
    if (completedFromServer || !isAuthenticated) {
      dispatch({ type: 'SET_RUNNING', payload: false })
    }
  }, [game, completedFromServer, isAuthenticated, authLoading, dispatch])

  useEffect(() => {
    if (!game || !isAuthenticated || completedFromServer || hasSubmittedWin) return
    if (!completionCheckInitializedRef.current) {
      completionCheckInitializedRef.current = true
      return
    }
    if (!boardStatus.complete) return
    async function saveWin() {
      try {
        await updateSudokuGame(gameId, { currentBoard: state.puzzle, seconds: state.seconds })
        await submitHighscore(gameId, state.seconds, state.puzzle)
        setCompletedFromServer(true)
        setHasSubmittedWin(true)
      } catch (err) {
      }
    }
    saveWin()
  }, [boardStatus.complete, game, isAuthenticated, completedFromServer, hasSubmittedWin, gameId, state.puzzle, state.seconds])

  useEffect(() => {
    if (!game || !isAuthenticated || completedFromServer) return
    if (!Array.isArray(state.puzzle) || state.puzzle.length === 0) return
    const timeout = setTimeout(() => {
      updateSudokuGame(gameId, { currentBoard: state.puzzle, seconds: state.seconds }).catch(() => {})
    }, 500)
    return () => clearTimeout(timeout)
  }, [state.puzzle, game, isAuthenticated, completedFromServer, gameId, state.seconds])

  useEffect(() => {
    if (!game || !isAuthenticated || completedFromServer) return
    if (state.seconds <= 0 || state.seconds % 5 !== 0) return
    updateSudokuGame(gameId, { seconds: state.seconds }).catch(() => {})
  }, [state.seconds, game, isAuthenticated, completedFromServer, gameId])

  async function reset(){
    if (!isAuthenticated || completedFromServer) return
    dispatch({type:'RESET'})
    try {
      await updateSudokuGame(gameId, { reset: true })
    } catch (err) {
    }
  }

  async function handleDelete() {
    if (!canDelete) return
    try {
      await deleteSudokuGame(gameId)
      navigate('/games')
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to delete game')
    }
  }

  if (loading) {
    return <main><p>Loading game...</p></main>
  }
  if (error) {
    return <main><p className="form-error">{error}</p></main>
  }

  return (
    <div className="game-page">
      <h2>{game?.name} ({game?.difficulty})</h2>
      {!isAuthenticated ? <p>You can view this game while logged out, but editing is disabled.</p> : null}
      {completedFromServer ? <p>This game is already completed by your account.</p> : null}
      <Board />
      <div className="board-controls">
        <button className="button secondary" onClick={reset} disabled={!isAuthenticated || completedFromServer}>Reset</button>
        {canDelete ? (
          <button className="button" onClick={handleDelete} type="button">
            DELETE
          </button>
        ) : null}
      </div>
    </div>
  )
}
