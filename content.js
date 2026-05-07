if (window.__myContentScriptLoaded) {
    console.log("Duplicate content script detected, skipping init");
}
window.__myContentScriptLoaded = true;

console.log("Content script loaded at", performance.now());

const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {acceptNode(node) {
      // Only accept text nodes or <span> elements
      if (node.nodeType === Node.TEXT_NODE) return NodeFilter.FILTER_ACCEPT;
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN') {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_SKIP;
    }
    },
    false);


class titleCon{
    constructor(fontFamily, fontSize, fontWeight, lineHeight, className){
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.fontWeight = fontWeight;
    //titleCon.color = color;
    this.lineHeight = lineHeight;
    this.className = className;
    }
}

//const edge = new titleCon('\"\"', "20px", "600", "26px", "title");
const tv2 = new titleCon('TV2, "Helvetica Neue", "Segoe UI", sans-serif', '12px', '500', '20px', ['tc_heading', 'tc_heading--4', 'tc_heading--weight-700'])

let titleProfile;
let titlePoint = 0;
const titlePointThrs = 4;

let previousGuess = ["nah"];
let currentGuess;
let answer;

let spans;
let parentEl;
let titleParent;
let title;
let titleScrambled;
let titleFound = false;
let node;

function requestUrl(){
    chrome.runtime.onMessage.addListener((message) => {
    if(message.action === "receiveUrl") {
        console.log("Content script received URL:", message.data);
        if (message.data === "https://www.bing.com/") {
            titleProfile = edge;
            console.log(titleProfile);
            findTitle();
        }
        else if(message.data === "https://tv2.dk/"){
            titleProfile = tv2;
            findTitle();
        }
        }
    });
}

function findTitle(){
    while (titleFound === false){
        if (!node){ return;}
        parentEl = node.parentElement;
        if(parentEl){
            console.log(parentEl.classList);
            let hasClass = false
            for (let name of titleProfile.className){
                console.log(name);
                if (parentEl.classList.contains(name)){
                hasClass = true;
                console.log("class found");
                break;}
            }
            if (!hasClass){
                node = walker.nextNode();
                continue;
            }
            console.log(
            className: parentEl.classList);
            console.log(node.textContent);
            title = node;
            console.log("TITLE FOUND!!" + title.textContent);
            answer = title.textContent.split("");
            titleFound = true;
            scrambleTitle();
        }
        else{
            node = walker.nextNode();
        }
    }
}

function charGiveStyle(){
    titleParent = title.parentNode;
    console.log("span begun");
    const frag = document.createDocumentFragment();
    for(let char of title.textContent){
        const span = document.createElement("span");
        span.className = "title";
        span.textContent = char;
        span.style.color = "#ccc";
        frag.appendChild(span);
    }
    titleParent.replaceChild(frag, title);
    spans = Array.from(titleParent.querySelectorAll(".title"));
    console.log("span finished");
    console.log(spans.length);
}

function scrambleTitle(){
    charGiveStyle();
    if (spans.length < 1) {return "Error no title found";}
    if (spans.length > 1) {
        for(let i = spans.length - 1; i >= 0; i--) {
            let ran = Math.floor(Math.random()*(i+1));
            [spans[i].textContent, spans[ran].textContent] = [spans[ran].textContent, spans[i].textContent];
            console.log(spans[i].textContent);
            console.log(i);
        }
        chrome.runtime.sendMessage({action: "startGame"});
    }
}



//this is the setup:
requestUrl();
node = walker.nextNode();

if(titleScrambled === "Error no title found"){
    node = walker.nextNode();
    titleFound = false;
    titlePoint = 0;
    findTitle();
    console.log(titleScrambled);
}
if(titleScrambled === "Error no title found"){chrome.runtime.sendMessage({error: "noTitle"});}


//this is the game loop:
chrome.runtime.onMessage.addListener((request) => {
    if((request.action === "userGuess") && (request.guess != previousGuess)){
        //Resolves when the answer given is not 100% correct
        currentGuess = request.guess.split("");
        previousGuess = currentGuess.join("");
        answerScore = 0;
        for(let i = 0; i < spans.length; i++){
            if (currentGuess[i] === answer[i].textContent){
                answerScore++;
                spans[i].textContent = currentGuess[i];
                spans[i].style.color = "#7fff00";
            }
            else{spans[i].style.color = "#Ff0000";}
        }
        if(answerScore === spans.length){console.log("you win!!");}
        else{console.log("Not correct");}
    }
    setTimeout(1000);
})