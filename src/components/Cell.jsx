import React, { useState } from 'react'
import { useSudokuDispatch, useSudokuState } from '../context/SudokuContext'

export default function Cell({row,col,value,fixed,error,disabled=false}){
  const [selected, setSelected] = useState(false)
  const dispatch = useSudokuDispatch()
  const { size } = useSudokuState()

  function handle(e){
    if(disabled) return
    const v = e.target.value.replace(/[^0-9]/g,'')
    const val = v === '' ? 0 : Math.max(0, Math.min(size, Number(v) || 0))
    dispatch({type: 'SET_CELL', payload: {row, col, value: val}})
  }

  function handleFocus(){ if(!disabled) setSelected(true) }
  function handleBlur(){ if(!disabled) setSelected(false) }

  const filled = !fixed && value !== 0

  return (
    <div className={`sudoku-cell ${fixed? 'fixed':''} ${filled? 'filled':''} ${error? 'error':''} ${selected? 'selected':''}`}>
      {fixed ? (
        <div className="cell-val">{value}</div>
      ) : (
        <input
          className="cell-input"
          value={value===0? '': value}
          onChange={handle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={2}
          disabled={disabled}
        />
      )}
    </div>
  )
}
