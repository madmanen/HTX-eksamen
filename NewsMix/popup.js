let countdown;
let timeLeft = 60;
let correctAnswer = "1";


document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn");
    const startScreen = document.getElementById("startScreen");
    const gameScreen = document.getElementById("gameScreen");


    startBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage ({action: "getTabUrl"})
});

chrome.runtime.onMessage.addListener((request, sender) => {
    if (request.action === "startGame") {
        startGame();
    }

    if (request.error === "noTittle") {
        noValidTittle();
    }
});

function startGame() {
    startScreen.style.display = "none";
    gameScreen.style.display = "block";
    const timer = document.getElementById("timer");
    const input = document.getElementById("userInput");
    const button = document.getElementById("submitBtn");

    timer.textContent = timeLeft;

    countdown = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            timer.textContent = "Tiden er gået!";
            input.disabled = true;
            button.disabled = true;
        }
    }, 1000);

    button.addEventListener("click", () => {
        input.classList.remove("correct", "wrong");

        if (input.value.trim().toLowerCase() === correctAnswer) {
            input.classList.add("correct");
            clearInterval(countdown);
        } else {
            input.classList.add("wrong");
        }
    });
}
function noValidTittle() {
    document.getElementById("errorBox").style.display = "block";
}
