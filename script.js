// Game Variables
let score = 0;
let timeLeft = 60;
let gameInterval;
let timerInterval;
let santaPosition = 50;
let gameActive = false;
let highScore = localStorage.getItem('christmasHighScore') || 0;

// DOM Elements
const startScreen = document.getElementById('startScreen');
const gameArea = document.getElementById('gameArea');
const gameOverScreen = document.getElementById('gameOverScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const santa = document.getElementById('santa');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const highScoreDisplay = document.getElementById('highscore');
const finalScoreDisplay = document.getElementById('finalScore');
const messageDisplay = document.getElementById('message');

// Initialize
highScoreDisplay.textContent = highScore;

// Event Listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

// Keyboard Controls
document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    
    if (e.key === 'ArrowLeft') {
        moveSanta('left');
    } else if (e.key === 'ArrowRight') {
        moveSanta('right');
    }
});

// Touch Controls for Mobile
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

document.addEventListener('touchmove', (e) => {
    if (!gameActive) return;
    
    const touchEndX = e.touches[0].clientX;
    const diff = touchEndX - touchStartX;
    
    if (diff > 10) {
        moveSanta('right');
    } else if (diff < -10) {
        moveSanta('left');
    }
    
    touchStartX = touchEndX;
});

// Move Santa
function moveSanta(direction) {
    const gameAreaWidth = gameArea.offsetWidth;
    const santaWidth = santa.offsetWidth;
    const step = 5;
    
    if (direction === 'left') {
        santaPosition = Math.max(0, santaPosition - step);
    } else if (direction === 'right') {
        santaPosition = Math.min(100, santaPosition + step);
    }
    
    santa.style.left = santaPosition + '%';
}

// Start Game
function startGame() {
    score = 0;
    timeLeft = 60;
    santaPosition = 50;
    gameActive = true;
    
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    santa.style.left = '50%';
    
    startScreen.style.display = 'none';
    gameArea.classList.add('active');
    gameOverScreen.classList.remove('active');
    
    // Start spawning items
    gameInterval = setInterval(spawnItem, 1000);
    
    // Start timer
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Spawn Falling Items
function spawnItem() {
    if (!gameActive) return;
    
    const item = document.createElement('div');
    item.className = 'falling-item';
    
    // Random item type (70% gifts, 30% bombs)
    const isGift = Math.random() > 0.3;
    item.textContent = isGift ? '🎁' : '💣';
    item.dataset.type = isGift ? 'gift' : 'bomb';
    
    // Random horizontal position
    const randomLeft = Math.random() * 90;
    item.style.left = randomLeft + '%';
    
    // Random fall speed
    const fallDuration = 2 + Math.random() * 2;
    item.style.animationDuration = fallDuration + 's';
    
    gameArea.appendChild(item);
    
    // Check collision
    const collisionCheck = setInterval(() => {
        if (!gameActive) {
            clearInterval(collisionCheck);
            return;
        }
        
        const itemRect = item.getBoundingClientRect();
        const santaRect = santa.getBoundingClientRect();
        
        // Check if item reached bottom
        if (itemRect.top > window.innerHeight) {
            clearInterval(collisionCheck);
            item.remove();
            return;
        }
        
        // Check collision with Santa
        if (
            itemRect.left < santaRect.right &&
            itemRect.right > santaRect.left &&
            itemRect.top < santaRect.bottom &&
            itemRect.bottom > santaRect.top
        ) {
            clearInterval(collisionCheck);
            
            if (item.dataset.type === 'gift') {
                score += 10;
                createFloatingText('+10', itemRect.left, itemRect.top, '#38ef7d');
                playSound('gift');
            } else {
                score = Math.max(0, score - 5);
                createFloatingText('-5', itemRect.left, itemRect.top, '#ff4444');
                playSound('bomb');
            }
            
            scoreDisplay.textContent = score;
            item.remove();
        }
    }, 50);
    
    // Remove item after animation
    setTimeout(() => {
        if (item.parentNode) {
            item.remove();
        }
    }, fallDuration * 1000);
}

// Create Floating Text Effect
function createFloatingText(text, x, y, color) {
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.position = 'fixed';
    floatingText.style.left = x + 'px';
    floatingText.style.top = y + 'px';
    floatingText.style.color = color;
    floatingText.style.fontSize = '2em';
    floatingText.style.fontWeight = 'bold';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.zIndex = '1000';
    floatingText.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
    floatingText.style.animation = 'floatUp 1s ease-out';
    
    document.body.appendChild(floatingText);
    
    setTimeout(() => {
        floatingText.remove();
    }, 1000);
}

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px);
        }
    }
`;
document.head.appendChild(style);

// Play Sound (Visual feedback since we can't use audio files)
function playSound(type) {
    // Visual feedback instead of sound
    if (type === 'gift') {
        santa.style.transform = 'translateX(-50%) scale(1.2)';
        setTimeout(() => {
            santa.style.transform = 'translateX(-50%) scale(1)';
        }, 200);
    } else if (type === 'bomb') {
        santa.style.transform = 'translateX(-50%) rotate(10deg)';
        setTimeout(() => {
            santa.style.transform = 'translateX(-50%) rotate(-10deg)';
            setTimeout(() => {
                santa.style.transform = 'translateX(-50%) rotate(0deg)';
            }, 100);
        }, 100);
    }
}

// End Game
function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    
    // Remove all falling items
    const fallingItems = document.querySelectorAll('.falling-item');
    fallingItems.forEach(item => item.remove());
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('christmasHighScore', highScore);
        highScoreDisplay.textContent = highScore;
        messageDisplay.textContent = '🎉 Kỷ lục mới! Xuất sắc! 🎉';
    } else if (score >= 100) {
        messageDisplay.textContent = '🌟 Tuyệt vời! Bạn là cao thủ bắt quà! 🌟';
    } else if (score >= 50) {
        messageDisplay.textContent = '👍 Làm tốt lắm! Tiếp tục cố gắng! 👍';
    } else {
        messageDisplay.textContent = '💪 Cố gắng lên! Lần sau sẽ tốt hơn! 💪';
    }
    
    finalScoreDisplay.textContent = score;
    gameOverScreen.classList.add('active');
}

// Restart Game
function restartGame() {
    gameArea.classList.remove('active');
    gameOverScreen.classList.remove('active');
    startScreen.style.display = 'flex';
}
