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

const edge = new titleCon(["Segoe UI", "Segoe UI Midlevel", "sans-serif"], "24px", "600", "26px");

let titleProfile;
let titlePoint = 0;
const titlePointThrs = 4;

let previousAnswer;
let title;
let titleScrambled;
let titleFound = false;
let gameActive = false;
let node;

function requestUrl(){
    chrome.runtime.onMessage.addListener((message, sender) => {
    if(message.action === "receiveUrl") {
        if(data.url === "") {titleProfile = edge;}
    }
    })
}

function findTitle(){
    while (titleFound === false){
        const parentEl = node.parentElement;
        if(parentEl){
            let style = window.getComputedStyle(parentEl);
            if(style.fontFamily === titleProfile.fontFamily){titlePoint = titlePoint + 1;}
            if(style.fontSize === titleProfile.fontSize){titlePoint = titlePoint + 1;}
            if(style.fontWeight === titleProfile.fontWeight){titlePoint = titlePoint + 1;}
            if(style.lineHeight === titleProfile.lineHeight){titlePoint = titlePoint + 1;)}
            console.log({
            fontFamily: style.fontFamily,
            fontSize: style.fontSize});
            node = walker.nextNode();
            if(titlePoint => titlePointThrs){
                title = node;
                console.log("TITLE FOUND!!" + title);
                titleFound = true;
            }
            else{
            node = walker.nextNode();
            titlePoint = 0;
            }
        }
    }
}

function scambleTitle(){
    if (title.length <= 1) {return "Error no title found";}
    if (title.length > 1) {
        let charArr = title.split("");
        for(let i = charArr.length - 1; i > 0, i--) {
            cont ran = Math.floor(Math.random()*(i+1));
            [charArr[i], charArr[ran]] = [charArr[ran], charArr[i]];
        }
        scambleTitle = node.textContent = charArr.join("");
        chrome.runtime.sendMessage({action: "startGame"});
        chrome.runtime.sendMessage({action: title});
        gameActive = true;
        return scambleTitle;
    }
}

//this is the setup:
requestUrl();
node = walker.nextNode();
findTitle();
titleScrambled = scambleTitle();
console.log(titleScrambled);
if(titleScrambled === "Error no title found"){
    node = walker.nextNode();
    titleFound = false;
    titlePoint = 0;
    findTitle();
    titleScrambled = scambleTitle();
    console.log(titleScrambled);
}
if(titleScrambled === "Error no title found"){chrome.runtime.sendMessage({error: "noTitle"});}

//this is the game loop:
while (gameActive){
chrome.runtime.onMessage.addListener((request, sender, response) => {
    if(request.answer ){
        //Resolves when the answer given is not 100% correct


    }
    else if(request.correct){
        //Resolves when the answer given is 100% correct and the game is over
        gameActive = false;
    }
  }
}