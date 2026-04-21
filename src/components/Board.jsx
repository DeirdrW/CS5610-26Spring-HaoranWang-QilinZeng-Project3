import React from 'react'
import { useSudokuState} from '../context/SudokuContext'
import Cell from './Cell'
import { validateBoard } from '../utils/generator'
import '../styles/board.css'

export default function Board(){
  const state = useSudokuState()
  const {puzzle, original, size} = state
  const res = validateBoard(puzzle)
  const forceDisabled = state.forceDisabled || false

  return (
    <div className="board-stage">
      <div className="timer">Time: {state.seconds}s</div>
      <div className="sudoku-board" style={{gridTemplateColumns:`repeat(${size}, 1fr)`, gridTemplateRows:`repeat(${size}, 1fr)`}}>
        {puzzle.map((row,r)=> row.map((val,c)=> (
          <Cell key={`${r}-${c}`}
            row={r} col={c}
            value={val}
            fixed={original[r][c]!==0}
            error={res.errors && res.errors.has(`${r},${c}`)}
            disabled={res.complete || forceDisabled}
          />
        )))}
      </div>
      {res.complete && <div className="congrats">Congratulations — puzzle complete!</div>}
    </div>
  )
}
