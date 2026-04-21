import React from 'react'
import '../styles/rules.css'

export default function Rules(){
  return (
    <main>
      <h1 className="section-title" style={{marginTop:0}}>Playbook & Credits</h1>
      <div className="rules-grid">
        <section className="rules-list card">
          <h2>Sudoku Essentials</h2>
          <ol>
            <li>Each row must contain digits 1 through 9 (or 1 through 6 on the easy board) exactly once.</li>
            <li>Each column follows the same rule—no duplicates, no gaps.</li>
            <li>Each sub-grid (3x3 for 9x9, 3x2 for 6x6) must also contain every digit without repeats.</li>
            <li>Only logical deduction allowed: no guessing, no pencil snapping.</li>
            <li>Use highlighting, scanning, and notation to narrow candidates before committing.</li>
          </ol>
        </section>
        <section className="credits card">
          <h2>Made By</h2>
          <p>Crafted by the Sudoku team for CS5610 on February 13, 2026.</p>
          <div className="credits-links">
            <p><a href="mailto:haoranwang@northeastern.edu">haoranwang@northeastern.edu</a></p>
            <p><a href="mailto:qilinzeng@northeastern.edu">qilinzeng@northeastern.edu</a></p>
          </div>
        </section>
      </div>
    </main>
  )
}
