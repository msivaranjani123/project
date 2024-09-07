const gridContainer = document.querySelector('.grid');
let tiles = Array.from(gridContainer.querySelectorAll('.tile'));
let score = 0;
let best = localStorage.getItem('best') || 0; 

document.addEventListener('keydown', handleKeyPress);
document.getElementById('newGameButton').addEventListener('click', startNewGame);
document.getElementById('tryAgainButton').addEventListener('click', startNewGame);


document.getElementById('best').textContent = best;

function handleKeyPress(event) {
  if (event.key.includes('Arrow')) {
    event.preventDefault();
    move(event.key.replace('Arrow', '').toLowerCase());
    updateGrid();
    if (checkWin()) {
      showWin(); 
    } else if (checkGameOver()) {
      showGameOver();
    }
  }
}

function move(direction) {
  switch (direction) {
    case 'up':
      moveUp();
      break;
    case 'down':
      moveDown();
      break;
    case 'left':
      moveLeft();
      break;
    case 'right':
      moveRight();
      break;
  }
}

function moveUp() {
  for (let col = 0; col < 4; col++) {
    let column = tiles.filter((tile, index) => index % 4 === col);
    column = mergeTiles(column);
    for (let i = 0; i < column.length; i++) {
      tiles[i * 4 + col].textContent = column[i] || '';
    }
  }
}

function moveDown() {
  for (let col = 0; col < 4; col++) {
    let column = tiles.filter((tile, index) => index % 4 === col);
    column = mergeTiles(column.reverse());
    for (let i = 0; i < column.length; i++) {
      tiles[(3 - i) * 4 + col].textContent = column[i] || '';
    }
  }
}

function moveLeft() {
  for (let row = 0; row < 4; row++) {
    let rowTiles = tiles.slice(row * 4, (row + 1) * 4);
    rowTiles = mergeTiles(rowTiles);
    for (let i = 0; i < rowTiles.length; i++) {
      tiles[row * 4 + i].textContent = rowTiles[i] || '';
    }
  }
}

function moveRight() {
  for (let row = 0; row < 4; row++) {
    let rowTiles = tiles.slice(row * 4, (row + 1) * 4);
    rowTiles = mergeTiles(rowTiles.reverse());
    for (let i = 0; i < rowTiles.length; i++) {
      tiles[row * 4 + (3 - i)].textContent = rowTiles[i] || '';
    }
  }
}

function mergeTiles(tiles) {
  let merged = [];
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].textContent !== '') {
      if (merged.length > 0 && merged[merged.length - 1] === tiles[i].textContent) {
        merged[merged.length - 1] = (parseInt(merged[merged.length - 1]) * 2).toString();
        score += parseInt(merged[merged.length - 1]);
      } else {
        merged.push(tiles[i].textContent);
      }
    }
  }
  while (merged.length < 4) {
    merged.push('');
  }
  return merged;
}

function updateGrid() {
  document.getElementById('score').textContent = score;
  updateBestScore(); 
  tiles.forEach(updateTileClass);
  generateTile();
}

function updateBestScore() {
  if (score > best) {
    best = score;
    document.getElementById('best').textContent = best;
    localStorage.setItem('best', best);
  }
}

function startNewGame() {
  score = 0;
  document.getElementById('score').textContent = score;
  tiles.forEach(tile => {
    tile.textContent = '';
    updateTileClass(tile);
  });
  generateTile();
  generateTile();
  hideGameOver(); 
  hideWin(); 
}

function generateTile() {
  const emptyTiles = tiles.filter(tile => tile.textContent === '');
  if (emptyTiles.length === 0) return;
  const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  randomTile.textContent = Math.random() < 0.9 ? '2' : '4';
  updateTileClass(randomTile);
}

function updateTileClass(tile) {
  tile.className = 'tile'; 
  if (tile.textContent) {
    tile.classList.add('tile-' + tile.textContent);
  }
}

function checkGameOver() {
 
  for (let i = 0; i < 16; i++) {
    if (tiles[i].textContent === '') return false; 
    
    if (i % 4 < 3 && tiles[i].textContent === tiles[i + 1].textContent) return false; 
    if (i < 12 && tiles[i].textContent === tiles[i + 4].textContent) return false; 
  }
  return true; 
}

function checkWin() {
  
  return tiles.some(tile => tile.textContent === '2048');
}

function showWin() {
  const winElement = document.getElementById('win');
  winElement.style.display = 'flex'; 
}

function hideWin() {
  const winElement = document.getElementById('win');
  winElement.style.display = 'none'; 
}

function showGameOver() {
  const gameOverElement = document.getElementById('gameOver');
  gameOverElement.style.display = 'flex'; 
}

function hideGameOver() {
  const gameOverElement = document.getElementById('gameOver');
  gameOverElement.style.display = 'none'; 
}

startNewGame();

 
