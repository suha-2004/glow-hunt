const menu = document.getElementById("menu");
const game = document.getElementById("game");
const gameOver = document.getElementById("gameOver");

const startBtn = document.getElementById("startBtn");
const againBtn = document.getElementById("againBtn");
const homeBtn = document.getElementById("homeBtn");

const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");

const scoreText = document.getElementById("score");
const comboText = document.getElementById("combo");
const timeText = document.getElementById("time");
const livesText = document.getElementById("lives");

const bestText = document.getElementById("best");
const menuBest = document.getElementById("menuBest");

const finalScore = document.getElementById("finalScore");
const finalBest = document.getElementById("finalBest");
const finalCombo = document.getElementById("finalCombo");
const newBest = document.getElementById("newBest");


let score = 0;
let combo = 1;
let lives = 3;
let time = 60;

let bestScore = localStorage.getItem("glowBest") || 0;

let timer;
let spawnTimer;

let playerX = window.innerWidth / 2;
let playerY = window.innerHeight / 2;


/* Show best score */

menuBest.textContent = bestScore;
bestText.textContent = bestScore;


/* ---------------- START GAME ---------------- */

startBtn.addEventListener("click", startGame);
againBtn.addEventListener("click", startGame);

homeBtn.addEventListener("click", () => {

    gameOver.classList.add("hidden");
    menu.classList.remove("hidden");

});


function startGame() {

    menu.classList.add("hidden");
    gameOver.classList.add("hidden");

    game.classList.remove("hidden");

    score = 0;
    combo = 1;
    lives = 3;
    time = 60;

    scoreText.textContent = score;
    comboText.textContent = "x1";
    livesText.textContent = lives;
    timeText.textContent = time;

    playerX = window.innerWidth / 2;
    playerY = window.innerHeight / 2;

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";


    /* Remove old objects */

    document.querySelectorAll(".target").forEach(item => {
        item.remove();
    });


    clearInterval(timer);
    clearInterval(spawnTimer);


    /* ---------------- COUNTDOWN ---------------- */

    timer = setInterval(() => {

        time--;

        timeText.textContent = time;


        if (time <= 0) {

            endGame();

        }

    }, 1000);


    /* ---------------- SPAWN OBJECTS ---------------- */

    spawnTimer = setInterval(() => {

        spawnTarget();

    }, 400);

}


/* ---------------- PLAYER MOVEMENT ---------------- */

gameArea.addEventListener("mousemove", (event) => {

    playerX = event.clientX;
    playerY = event.clientY;

    movePlayer();

});


gameArea.addEventListener("touchmove", (event) => {

    const touch = event.touches[0];

    playerX = touch.clientX;
    playerY = touch.clientY;

    movePlayer();

}, { passive: true });


function movePlayer() {

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

}


/* ---------------- SPAWN TARGET ---------------- */

function spawnTarget() {

    const target = document.createElement("div");

    const random = Math.random();

    let type;


    /* ---------------- TARGET TYPES ---------------- */

    if (random < 0.72) {

        type = "star";

        target.textContent = "⭐";

    }

    else if (random < 0.88) {

        type = "gem";

        target.textContent = "💎";

    }

    else {

        type = "danger";

        target.textContent = "🔴";

    }


    target.classList.add("target", type);


    /* ---------------- RANDOM POSITION ---------------- */

    const size = 50;

    const x =
        Math.random() *
        (window.innerWidth - size);

    const y =
        100 +
        Math.random() *
        (window.innerHeight - 180);


    target.style.left = x + "px";
    target.style.top = y + "px";


    gameArea.appendChild(target);


    /* ---------------- CHECK COLLISION ---------------- */

    const check = setInterval(() => {

        if (!target.isConnected) {

            clearInterval(check);

            return;

        }


        const targetRect =
            target.getBoundingClientRect();

        const playerRect =
            player.getBoundingClientRect();


        const dx =
            targetRect.left -
            playerRect.left;

        const dy =
            targetRect.top -
            playerRect.top;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance < 45) {

            clearInterval(check);

            collectTarget(target, type);

        }

    }, 30);


    /* ---------------- REMOVE TARGET ---------------- */

    setTimeout(() => {

        if (target.isConnected) {

            target.remove();

            combo = 1;

            comboText.textContent = "x1";

        }

    }, 1800);

}


/* ---------------- COLLECT TARGET ---------------- */

function collectTarget(target, type) {

    target.remove();


    /* ---------------- DANGER ---------------- */

    if (type === "danger") {

        lives--;

        livesText.textContent = lives;

        combo = 1;

        comboText.textContent = "x1";


        if (lives <= 0) {

            endGame();

        }

        return;

    }


    /* ---------------- STAR ---------------- */

    if (type === "star") {

        score += 1 * combo;

    }


    /* ---------------- GEM ---------------- */

    if (type === "gem") {

        score += 5 * combo;

    }


    /* Increase combo */

    combo++;


    scoreText.textContent = score;

    comboText.textContent = "x" + combo;


    /* ---------------- SMALL SCREEN EFFECT ---------------- */

    gameArea.style.transform = "scale(1.01)";


    setTimeout(() => {

        gameArea.style.transform = "scale(1)";

    }, 80);

}


/* ---------------- END GAME ---------------- */

function endGame() {

    clearInterval(timer);
    clearInterval(spawnTimer);


    /* Remove all targets */

    document.querySelectorAll(".target").forEach(item => {

        item.remove();

    });


    /* Show game over screen */

    game.classList.add("hidden");

    gameOver.classList.remove("hidden");


    finalScore.textContent = score;

    finalCombo.textContent = "x" + combo;


    let isNewBest = false;


    /* ---------------- BEST SCORE ---------------- */

    if (score > bestScore) {

        bestScore = score;

        localStorage.setItem(
            "glowBest",
            bestScore
        );

        isNewBest = true;

    }


    finalBest.textContent = bestScore;

    bestText.textContent = bestScore;

    menuBest.textContent = bestScore;


    /* ---------------- NEW BEST ---------------- */

    if (isNewBest) {

        newBest.classList.remove("hidden");

    }

    else {

        newBest.classList.add("hidden");

    }

}