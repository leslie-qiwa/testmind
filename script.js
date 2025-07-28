// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load saved stats
    loadStats();
});

// ==================== UTILITY FUNCTIONS ====================

function loadStats() {
    // Load Codebreak best time
    const codebreakBestTime = localStorage.getItem('codebreakBestTime');
    if (codebreakBestTime) {
        const time = parseInt(codebreakBestTime);
        document.getElementById('codebreak-best-time').textContent = 
            `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`;
    }
    
    // Load Word Search stats
    const wordSearchFound = localStorage.getItem('wordSearchFound') || '0';
    const wordSearchTotal = localStorage.getItem('wordSearchTotal') || '0';
    document.getElementById('wordsearch-found').textContent = wordSearchFound;
    document.getElementById('wordsearch-total').textContent = wordSearchTotal;
} 