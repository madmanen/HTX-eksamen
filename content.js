console.log("CONTENT SCRIPT LOADED");

const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false);


class titleCon{
    constructor(fontFamily, fontSize, fontWeight, lineHeight){
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.fontWeight = fontWeight;
    //titleCon.color = color;
    this.lineHeight = lineHeight;
    }
}

const edge = new titleCon('\"\"', "20px", "600", "26px");
const tv2 = new titleCon('TV2, "Helvetica Neue", "Segoe UI", sans-serif', '28px', '700', '30.8px')

let titleProfile;
let titlePoint = 0;
const titlePointThrs = 4;

let previousAnswerScore;
let currentAnswer;
let answerScore;

let spans;
let parentEl;
let title;
let titleScrambled;
let titleFound = false;
let gameActive = false;
let node;

function requestUrl(){
    chrome.runtime.onMessage.addListener((message, sender) => {
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
    })
}


function findTitle(){
    while (titleFound === false){
        if (!node){ return;}
        parentEl = node.parentElement;
        if(parentEl){
            let style = window.getComputedStyle(parentEl);
            if(style.fontFamily === titleProfile.fontFamily){titlePoint = titlePoint + 1;}
            if(style.fontSize === titleProfile.fontSize){titlePoint = titlePoint + 1;}
            if(style.fontWeight === titleProfile.fontWeight){titlePoint = titlePoint + 1;}
            if(style.lineHeight === titleProfile.lineHeight){titlePoint = titlePoint + 1;}
            console.log({
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            lineHeight: style.lineHeight});
            console.log(titlePoint);
            node = walker.nextNode();
            if(titlePoint >= titlePointThrs){
                title = node;
                console.log("TITLE FOUND!!" + title.textContent);
                titleFound = true;
                scrambleTitle();
            }
            else{
            node = walker.nextNode();
            titlePoint = 0;
            }
        }
    }
}

function charGiveStyle(){
    console.log("span begun");
    const frag = document.createDocumentFragment();
    for(let char of title.textContent){
        const span = document.createElement("span");
        span.className = "title";
        span.textContent = char;
        //span.style.color("#ccc");
        frag.appendChild(span);
    }
    title.parentNode.replaceChild(frag, title);
    console.log("span finished");
    .parentNode.childNodes.forEach((node, index) => {
        console.log(`Node ${index}:`);
        console.log("  Type:", node.nodeType); // 1=Element, 3=Text, 8=Comment
        console.log("  Name:", node.nodeName);
        console.log("  Value:", node.textContent);
    });
}

function scrambleTitle(){
    titleArr = title.textContent.toLowerCase().split("")
    if (titleArr.length <= 1) {return "Error no title found";}
    if (titleArr.length > 1) {
        charGiveStyle();
        spans = Array.from(parentEl.querySelectorAll(".title"));
        for(let i = titleArr.length - 1; i > 0; i--) {
            let ran = Math.floor(Math.random()*(i+1));
            [titleArr[i], titleArr[ran]] = [titleArr[ran], titleArr[i]];
            spans[i].textContent = titleArr[i];
        }
        titleScrambled = titleArr.join("");
        node.textContent = titleScrambled;
        console.log(titleScrambled);
        chrome.runtime.sendMessage({action: "startGame"});
        chrome.runtime.sendMessage({action: title});
        gameActive = true;
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
while (gameActive){
chrome.runtime.onMessage.addListener((request, sender, response) => {
    if(request.answer ){
        //Resolves when the answer given is not 100% correct
        currentAnswer = request.answer.toLowerCase.split("");
        answerScore = 0;
        for(let i = 0; i <= titleArr.length; i++){
            if (currentAnswer[i] === titleArr[i]){
                answerScore = answerScore + 1;
                spans[i].textContent === currentAnswer[i];
                //spans[i].style.color("#7fff00");
            }
        }
    }
    else if(request.correct){
        //Resolves when the answer given is 100% correct and the game is over
        gameActive = false;
    }
  })
}