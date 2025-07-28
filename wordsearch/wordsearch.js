// Word Search Game Variables
let wordSearchGame = null;
let wordSearchTimer = null;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadWordSearchStats();
    startNewWordSearchGame();
});

// ==================== WORD SEARCH GAME ====================

class WordSearchGame {
    constructor() {
        this.grid = [];
        this.words = [];
        this.foundWords = new Set();
        this.gameStarted = false;
        this.startTime = null;
        this.selectedCells = [];
        this.isSelecting = false;
        this.init();
    }
    
    init() {
        this.generatePuzzle();
        this.renderGrid();
        this.renderWordList();
        this.startTimer();
    }
    
    generatePuzzle() {
        // Define word lists for different themes
        const wordLists = {
            animals: ['LION', 'TIGER', 'BEAR', 'WOLF', 'DEER', 'FOX', 'CAT', 'DOG'],
            colors: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE', 'PINK', 'BROWN'],
            fruits: ['APPLE', 'BANANA', 'ORANGE', 'GRAPE', 'MANGO', 'KIWI', 'PEAR', 'PLUM'],
            countries: ['USA', 'CANADA', 'MEXICO', 'BRAZIL', 'FRANCE', 'GERMANY', 'JAPAN', 'CHINA']
        };
        
        // Randomly select a theme
        const themes = Object.keys(wordLists);
        const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
        this.words = wordLists[selectedTheme];
        
        // Create 15x15 grid
        this.grid = this.createGrid(15, 15);
        this.placeWords();
        this.fillEmptyCells();
    }
    
    createGrid(rows, cols) {
        const grid = [];
        for (let i = 0; i < rows; i++) {
            grid[i] = [];
            for (let j = 0; j < cols; j++) {
                grid[i][j] = '';
            }
        }
        return grid;
    }
    
    placeWords() {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],  // Up-left, Up, Up-right
            [0, -1],           [0, 1],    // Left, Right
            [1, -1],  [1, 0],  [1, 1]     // Down-left, Down, Down-right
        ];
        
        this.words.forEach(word => {
            let placed = false;
            let attempts = 0;
            
            while (!placed && attempts < 100) {
                const direction = directions[Math.floor(Math.random() * directions.length)];
                const startRow = Math.floor(Math.random() * this.grid.length);
                const startCol = Math.floor(Math.random() * this.grid[0].length);
                
                if (this.canPlaceWord(word, startRow, startCol, direction)) {
                    this.placeWord(word, startRow, startCol, direction);
                    placed = true;
                }
                attempts++;
            }
        });
    }
    
    canPlaceWord(word, startRow, startCol, direction) {
        const [dr, dc] = direction;
        
        for (let i = 0; i < word.length; i++) {
            const row = startRow + i * dr;
            const col = startCol + i * dc;
            
            if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[0].length) {
                return false;
            }
            
            if (this.grid[row][col] !== '' && this.grid[row][col] !== word[i]) {
                return false;
            }
        }
        return true;
    }
    
    placeWord(word, startRow, startCol, direction) {
        const [dr, dc] = direction;
        
        for (let i = 0; i < word.length; i++) {
            const row = startRow + i * dr;
            const col = startCol + i * dc;
            this.grid[row][col] = word[i];
        }
    }
    
    fillEmptyCells() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                if (this.grid[i][j] === '') {
                    this.grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }
    }
    
    renderGrid() {
        const gridContainer = document.getElementById('wordsearch-grid');
        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${this.grid[0].length}, 1fr)`;
        
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.textContent = this.grid[i][j];
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                cell.addEventListener('mousedown', (e) => this.startSelection(e, i, j));
                cell.addEventListener('mouseover', (e) => this.updateSelection(e, i, j));
                cell.addEventListener('mouseup', (e) => this.endSelection(e));
                
                gridContainer.appendChild(cell);
            }
        }
    }
    
    renderWordList() {
        const wordList = document.getElementById('word-list');
        wordList.innerHTML = '';
        
        this.words.forEach(word => {
            const wordItem = document.createElement('div');
            wordItem.className = 'word-item';
            wordItem.textContent = word;
            wordItem.dataset.word = word;
            wordList.appendChild(wordItem);
        });
        
        document.getElementById('total-words').textContent = this.words.length;
        document.getElementById('words-found').textContent = this.foundWords.size;
    }
    
    startSelection(e, row, col) {
        e.preventDefault();
        this.isSelecting = true;
        this.selectedCells = [{row, col}];
        this.updateCellSelection(row, col, true);
    }
    
    updateSelection(e, row, col) {
        if (!this.isSelecting) return;
        
        // Clear previous selection
        this.selectedCells.forEach(({row: r, col: c}) => {
            this.updateCellSelection(r, c, false);
        });
        
        // Calculate direction and select cells
        const start = this.selectedCells[0];
        const direction = this.getDirection(start.row, start.col, row, col);
        
        if (direction) {
            this.selectedCells = this.getCellsInDirection(start.row, start.col, direction);
            this.selectedCells.forEach(({row: r, col: c}) => {
                this.updateCellSelection(r, c, true);
            });
        }
    }
    
    endSelection(e) {
        if (!this.isSelecting) return;
        
        this.isSelecting = false;
        
        // Check if selected cells form a word
        if (this.selectedCells.length > 1) {
            const selectedWord = this.getWordFromCells(this.selectedCells);
            this.checkWord(selectedWord);
        }
        
        // Clear selection
        this.selectedCells.forEach(({row, col}) => {
            this.updateCellSelection(row, col, false);
        });
        this.selectedCells = [];
    }
    
    getDirection(startRow, startCol, endRow, endCol) {
        const dr = endRow - startRow;
        const dc = endCol - startCol;
        
        if (dr === 0 && dc === 0) return null;
        
        const gcd = Math.abs(this.gcd(dr, dc));
        return [dr / gcd, dc / gcd];
    }
    
    gcd(a, b) {
        return b === 0 ? a : this.gcd(b, a % b);
    }
    
    getCellsInDirection(startRow, startCol, direction) {
        const [dr, dc] = direction;
        const cells = [];
        let row = startRow;
        let col = startCol;
        
        while (row >= 0 && row < this.grid.length && col >= 0 && col < this.grid[0].length) {
            cells.push({row, col});
            row += dr;
            col += dc;
        }
        
        return cells;
    }
    
    getWordFromCells(cells) {
        return cells.map(({row, col}) => this.grid[row][col]).join('');
    }
    
    checkWord(word) {
        const reversedWord = word.split('').reverse().join('');
        
        if (this.words.includes(word) && !this.foundWords.has(word)) {
            this.foundWords.add(word);
            this.markWordAsFound(word);
            this.updateStats();
            
            if (this.foundWords.size === this.words.length) {
                this.endGame();
            }
        } else if (this.words.includes(reversedWord) && !this.foundWords.has(reversedWord)) {
            this.foundWords.add(reversedWord);
            this.markWordAsFound(reversedWord);
            this.updateStats();
            
            if (this.foundWords.size === this.words.length) {
                this.endGame();
            }
        }
    }
    
    markWordAsFound(word) {
        // Mark word in list as found
        const wordItem = document.querySelector(`[data-word="${word}"]`);
        if (wordItem) {
            wordItem.classList.add('found');
        }
        
        // Mark cells as found (this would require storing word positions)
        // For simplicity, we'll just update the display
    }
    
    updateCellSelection(row, col, selected) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            if (selected) {
                cell.classList.add('selected');
            } else {
                cell.classList.remove('selected');
            }
        }
    }
    
    updateStats() {
        document.getElementById('words-found').textContent = this.foundWords.size;
    }
    
    startTimer() {
        this.startTime = Date.now();
        this.updateTimer();
    }
    
    updateTimer() {
        if (!this.startTime) return;
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('wordsearch-timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        wordSearchTimer = setTimeout(() => this.updateTimer(), 1000);
    }
    
    endGame() {
        if (wordSearchTimer) {
            clearTimeout(wordSearchTimer);
        }
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.updateWordSearchStats();
        setTimeout(() => {
            alert(`🎉 Congratulations! You found all ${this.words.length} words in ${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, '0')}!`);
        }, 500);
    }
    
    reset() {
        this.grid = [];
        this.words = [];
        this.foundWords = new Set();
        this.gameStarted = false;
        this.startTime = null;
        this.selectedCells = [];
        this.isSelecting = false;
        
        // Clear display
        document.getElementById('wordsearch-grid').innerHTML = '';
        document.getElementById('word-list').innerHTML = '';
        document.getElementById('words-found').textContent = '0';
        document.getElementById('wordsearch-timer').textContent = '00:00';
        
        this.init();
    }
}

// Global functions for HTML onclick handlers
function startNewWordSearchGame() {
    if (wordSearchGame) {
        wordSearchGame.reset();
    } else {
        wordSearchGame = new WordSearchGame();
    }
}

// Utility functions
function loadWordSearchStats() {
    // Load Word Search stats
    const wordSearchFound = localStorage.getItem('wordSearchFound') || '0';
    const wordSearchTotal = localStorage.getItem('wordSearchTotal') || '0';
    console.log(`Words found: ${wordSearchFound}/${wordSearchTotal}`);
}

function updateWordSearchStats() {
    if (wordSearchGame) {
        localStorage.setItem('wordSearchFound', wordSearchGame.foundWords.size.toString());
        localStorage.setItem('wordSearchTotal', wordSearchGame.words.length.toString());
    }
}

// Add method to WordSearchGame class
WordSearchGame.prototype.updateWordSearchStats = updateWordSearchStats; 