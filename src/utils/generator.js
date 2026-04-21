function boxSizes(size){
  if(size===9) return {r:3,c:3}
  if(size===6) return {r:2,c:3}
  return {r:Math.sqrt(size)|0,c:Math.sqrt(size)|0}
}

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1))
    ;[arr[i],arr[j]]=[arr[j],arr[i]]
  }
  return arr
}

export function generateSolution(size){
  const board = Array.from({length:size},()=>Array(size).fill(0))
  const nums = Array.from({length:size},(_,i)=>i+1)
  const {r:cR, c:cC} = boxSizes(size)

  function canPlace(board,row,col,val){
    for(let i=0;i<size;i++) if(board[row][i]===val) return false
    for(let i=0;i<size;i++) if(board[i][col]===val) return false
    const br = Math.floor(row/cR)*cR
    const bc = Math.floor(col/cC)*cC
    for(let i=0;i<cR;i++) for(let j=0;j<cC;j++) if(board[br+i][bc+j]===val) return false
    return true
  }

  function solve(pos=0){
    if(pos===size*size) return true
    const row = Math.floor(pos/size), col = pos%size
    const order = shuffle(nums.slice())
    for(const n of order){
      if(canPlace(board,row,col,n)){
        board[row][col]=n
        if(solve(pos+1)) return true
        board[row][col]=0
      }
    }
    return false
  }
  solve()
  return board
}

export function generatePuzzle(size){
  const sol = generateSolution(size)
  const total = size*size
  let keep = size===6? Math.floor(total/2) : (28 + Math.floor(Math.random()*3))
  const indices = Array.from({length:total},(_,i)=>i)
  shuffle(indices)
  const keepSet = new Set(indices.slice(0,keep))
  const puzzle = Array.from({length:size},(_,r)=>Array.from({length:size},(_,c)=> keepSet.has(r*size+c)? sol[r][c] : 0))
  return puzzle
}

export function validateBoard(board){
  if(!board || board.length===0) return {valid:false, complete:false}
  const size = board.length
  const {r:cR,c:cC} = boxSizes(size)
  const errors = new Set()
  function markConflict(r1,c1,r2,c2){
    errors.add(`${r1},${c1}`)
    errors.add(`${r2},${c2}`)
  }
  for(let r=0;r<size;r++){
    for(let c=0;c<size;c++){
      const v = board[r][c]
      if(v===0) continue
      for(let cc=0;cc<size;cc++) if(cc!==c && board[r][cc]===v) markConflict(r,c,r,cc)
      for(let rr=0;rr<size;rr++) if(rr!==r && board[rr][c]===v) markConflict(r,c,rr,c)
      const br = Math.floor(r/cR)*cR
      const bc = Math.floor(c/cC)*cC
      for(let i=0;i<cR;i++) for(let j=0;j<cC;j++){
        const rr = br+i, cc = bc+j
        if((rr!==r || cc!==c) && board[rr][cc]===v) markConflict(r,c,rr,cc)
      }
    }
  }
  const complete = board.flat().every(v=>v!==0) && errors.size===0
  return {valid: errors.size===0, errors, complete}
}

export default {generatePuzzle, generateSolution, validateBoard}
