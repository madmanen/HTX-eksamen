let countdown;
let timeLeft = 60;
let correctAnswer = "test";

document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn");
    const startScreen = document.getElementById("startScreen");
    const gameScreen = document.getElementById("gameScreen");

    startBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "getTabUrl" });
    });

    chrome.runtime.onMessage.addListener((request) => {

        if (request.action === "startGame") {
            startGame();
        }

        if (request.error === "noTittle") {
            noValidTittle();
        }
    });
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

        const guess = input.value;

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "userGuess",
                guess: guess
            });
        });
    });
}

function noValidTittle() {
    document.getElementById("errorBox").style.display = "block";
}
