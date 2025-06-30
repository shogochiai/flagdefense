class Storage {
    constructor() {
        this.storageKey = 'veggieTetris';
    }

    saveHighScore(score) {
        const currentHighScore = this.getHighScore();
        if (score > currentHighScore) {
            localStorage.setItem(`${this.storageKey}_highScore`, score.toString());
            return true;
        }
        return false;
    }

    getHighScore() {
        const highScore = localStorage.getItem(`${this.storageKey}_highScore`);
        return highScore ? parseInt(highScore) : 0;
    }

    saveGameStats(stats) {
        localStorage.setItem(`${this.storageKey}_stats`, JSON.stringify(stats));
    }

    getGameStats() {
        const stats = localStorage.getItem(`${this.storageKey}_stats`);
        return stats ? JSON.parse(stats) : {
            gamesPlayed: 0,
            totalLines: 0,
            totalScore: 0,
            vegetablesCollected: {}
        };
    }

    updateGameStats(score, lines, vegetableStats) {
        const stats = this.getGameStats();
        
        stats.gamesPlayed++;
        stats.totalLines += lines;
        stats.totalScore += score;
        
        Object.entries(vegetableStats).forEach(([type, count]) => {
            if (!stats.vegetablesCollected[type]) {
                stats.vegetablesCollected[type] = 0;
            }
            stats.vegetablesCollected[type] += count;
        });
        
        this.saveGameStats(stats);
    }

    saveSettings(settings) {
        localStorage.setItem(`${this.storageKey}_settings`, JSON.stringify(settings));
    }

    getSettings() {
        const settings = localStorage.getItem(`${this.storageKey}_settings`);
        return settings ? JSON.parse(settings) : {
            soundEnabled: true,
            musicEnabled: true,
            ghostPieceEnabled: true
        };
    }
}