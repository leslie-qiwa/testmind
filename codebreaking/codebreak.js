// Codebreak Game Variables
let codebreakGame = null;
let codebreakTimer = null;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function () {
    loadCodebreakStats();
    startNewCodebreakGame();
});

// ==================== CODEBREAK GAME ====================

class CodebreakGame {
    constructor() {
        this.secretCode = [];
        this.currentGuess = ['', '', '', ''];
        this.guesses = [];
        this.attempts = 0;
        this.gameWon = false;
        this.gameStarted = false;
        this.startTime = null;
        this.selectedPegIndex = 0;
        this.colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
        this.init();
    }

    init() {
        this.generateSecretCode();
        this.startTimer();
    }

    generateSecretCode() {
        this.secretCode = [];
        for (let i = 0; i < 4; i++) {
            const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
            this.secretCode.push(randomColor);
        }
        console.log('Secret code:', this.secretCode); // For debugging
    }

    selectColor(color) {
        if (this.gameWon) return;

        this.currentGuess[this.selectedPegIndex] = color;
        this.updateCurrentGuessDisplay();
        this.checkGuessComplete();

        // Automatically move to next circle if not at the end
        if (this.selectedPegIndex < 3) {
            this.selectedPegIndex++;
            this.updateCurrentGuessDisplay();
        }
    }

    selectPeg(index) {
        if (this.gameWon) return;
        this.selectedPegIndex = index;
        this.updateCurrentGuessDisplay();
    }

    updateCurrentGuessDisplay() {
        const pegs = document.querySelectorAll('#current-guess .peg');
        pegs.forEach((peg, index) => {
            peg.className = 'peg';
            if (this.currentGuess[index]) {
                peg.classList.add(this.currentGuess[index]);
            } else {
                peg.classList.add('empty');
            }

            if (index === this.selectedPegIndex) {
                peg.style.borderColor = '#667eea';
                peg.style.borderWidth = '4px';
            } else {
                peg.style.borderColor = '#e2e8f0';
                peg.style.borderWidth = '3px';
            }
        });
    }

    checkGuessComplete() {
        const isComplete = this.currentGuess.every(color => color !== '');
        const submitBtn = document.getElementById('submit-guess');
        submitBtn.disabled = !isComplete;
    }

    submitGuess() {
        if (this.gameWon || this.currentGuess.includes('')) return;

        this.attempts++;
        const feedback = this.getFeedback(this.currentGuess);
        this.guesses.push({
            guess: [...this.currentGuess],
            feedback: feedback
        });

        this.updateGuessesHistory();
        this.updateStats();

        // Check if won
        if (feedback.red === 4) {
            this.gameWon = true;
            this.endGame();
            this.showWinMessage();
        } else if (this.attempts >= 10) {
            this.gameWon = true;
            this.endGame();
            this.showLoseMessage();
        } else {
            // Reset for next guess
            this.currentGuess = ['', '', '', ''];
            this.selectedPegIndex = 0;
            this.updateCurrentGuessDisplay();
            this.checkGuessComplete();
        }
    }

    getFeedback(guess) {
        let red = 0;
        let white = 0;
        const secretCopy = [...this.secretCode];
        const guessCopy = [...guess];

        // Check for exact matches (red pegs)
        for (let i = 0; i < 4; i++) {
            if (guessCopy[i] === secretCopy[i]) {
                red++;
                secretCopy[i] = null;
                guessCopy[i] = null;
            }
        }

        // Check for color matches in wrong position (white pegs)
        for (let i = 0; i < 4; i++) {
            if (guessCopy[i] !== null) {
                const index = secretCopy.indexOf(guessCopy[i]);
                if (index !== -1) {
                    white++;
                    secretCopy[index] = null;
                }
            }
        }

        return { red, white };
    }

    updateGuessesHistory() {
        const history = document.getElementById('guesses-history');
        history.innerHTML = '';

        // Reverse the array to show latest guess first (at the top)
        const reversedGuesses = [...this.guesses].reverse();

        reversedGuesses.forEach((guessData, reverseIndex) => {
            // Calculate the original index for proper attempt numbering
            const originalIndex = this.guesses.length - 1 - reverseIndex;

            const row = document.createElement('div');
            row.className = 'guess-row';

            const guessPegs = document.createElement('div');
            guessPegs.className = 'guess-pegs';
            guessData.guess.forEach(color => {
                const peg = document.createElement('div');
                peg.className = `peg ${color}`;
                guessPegs.appendChild(peg);
            });

            const feedbackPegs = document.createElement('div');
            feedbackPegs.className = 'feedback-pegs';

            // Add red pegs
            for (let i = 0; i < guessData.feedback.red; i++) {
                const peg = document.createElement('div');
                peg.className = 'feedback-peg red';
                feedbackPegs.appendChild(peg);
            }

            // Add white pegs
            for (let i = 0; i < guessData.feedback.white; i++) {
                const peg = document.createElement('div');
                peg.className = 'feedback-peg white';
                feedbackPegs.appendChild(peg);
            }

            const attemptNum = document.createElement('span');
            attemptNum.textContent = `#${originalIndex + 1}`;
            attemptNum.style.fontWeight = 'bold';
            attemptNum.style.minWidth = '30px';

            row.appendChild(attemptNum);
            row.appendChild(guessPegs);
            row.appendChild(feedbackPegs);
            history.appendChild(row);
        });
    }

    updateStats() {
        document.getElementById('attempts').textContent = this.attempts;
    }

    startTimer() {
        this.startTime = Date.now();
        this.updateTimer();
    }

    updateTimer() {
        if (!this.startTime || this.gameWon) return;

        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        codebreakTimer = setTimeout(() => this.updateTimer(), 1000);
    }

    endGame() {
        if (codebreakTimer) {
            clearTimeout(codebreakTimer);
        }

        // Reveal secret code
        const secretPegs = document.querySelectorAll('#secret-code .peg');
        secretPegs.forEach((peg, index) => {
            peg.className = `peg ${this.secretCode[index]}`;
        });

        // Update best time if won
        if (this.gameWon && this.attempts <= 10) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this.updateBestTime(elapsed);
        }
    }

    updateBestTime(newTime) {
        const currentBest = localStorage.getItem('codebreakBestTime');
        if (!currentBest || newTime < parseInt(currentBest)) {
            localStorage.setItem('codebreakBestTime', newTime.toString());
        }
    }

    showWinMessage() {
        setTimeout(() => {
            const startNewGame = confirm(`🎉 Congratulations! You cracked the code in ${this.attempts} attempts!\n\nWould you like to start a new game?`);
            if (startNewGame) {
                this.reset();
            }
        }, 500);
    }

    showLoseMessage() {
        setTimeout(() => {
            const startNewGame = confirm('😔 Game Over! You ran out of attempts. The secret code was revealed above.\n\nWould you like to start a new game?');
            if (startNewGame) {
                this.reset();
            }
        }, 500);
    }

    reset() {
        this.secretCode = [];
        this.currentGuess = ['', '', '', ''];
        this.guesses = [];
        this.attempts = 0;
        this.gameWon = false;
        this.gameStarted = false;
        this.startTime = null;
        this.selectedPegIndex = 0;

        // Clear display
        document.getElementById('guesses-history').innerHTML = '';
        document.getElementById('attempts').textContent = '0';
        document.getElementById('timer').textContent = '00:00';
        document.getElementById('submit-guess').disabled = true;

        // Hide secret code
        const secretPegs = document.querySelectorAll('#secret-code .peg');
        secretPegs.forEach(peg => {
            peg.className = 'peg hidden';
        });

        // Clear current guess display
        this.updateCurrentGuessDisplay();

        this.init();
    }
}

// Global functions for HTML onclick handlers
function startNewCodebreakGame() {
    if (codebreakGame) {
        codebreakGame.reset();
    } else {
        codebreakGame = new CodebreakGame();
    }
}

function selectColor(color) {
    if (codebreakGame) {
        codebreakGame.selectColor(color);
    }
}

function selectPeg(index) {
    if (codebreakGame) {
        codebreakGame.selectPeg(index);
    }
}

function submitGuess() {
    if (codebreakGame) {
        codebreakGame.submitGuess();
    }
}

// Utility functions
function loadCodebreakStats() {
    // Load Codebreak best time
    const codebreakBestTime = localStorage.getItem('codebreakBestTime');
    if (codebreakBestTime) {
        const time = parseInt(codebreakBestTime);
        console.log(`Best time: ${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`);
    }
} 