// varubals
let nMultipleCurrentQuestion = 0;
let nMultipleCorrectAnswers = 0;
let arrMultipleQuestions = [];
// const
const AMOUNT_OF_QUESTION = 5; // how many questions we want out of the array

let strLocation = "start-page" //המשתנה שומר את המקום של המשתמש ומחזיר אותו לשם בסגירת האודות
let strTextInput = ""

window.addEventListener("load", () => {
    document.querySelector(".loader").classList.add("fade");
    document.querySelector(".odot-logo").addEventListener("click", odot);
    document.querySelector(".fingerprint").addEventListener("click", fingerprint);
});

// פונקציה האחראית על פתיחת האודות
let odot = () => {
    document.querySelector(`.${strLocation}`).style.display = "none";
    document.querySelector(`.div-odot`).style.display = "block";  
    document.querySelector(`.div-body`).style.overflow = "hidden";
    document.querySelector(`.odot-logo`).style.display = "none";
    if (strLocation === "start-page") {
        document.querySelector(`body`).style.backgroundImage = "url(assets/media/phone_background_1.svg)";
    }  
    document.querySelector(`#back-button-odot`).addEventListener("click", () => {
        document.querySelector(`.${strLocation}`).style.display = "block";
        if (strLocation === "start-page") {
            document.querySelector(`body`).style.backgroundImage = "url(assets/media/locked_background_1.svg)";
        }
        document.querySelector(`.div-odot`).style.display = "none";  
        document.querySelector(`.odot-logo`).style.display = "block";  
        document.querySelector(`.div-body`).style.overflow = "scroll";
    });
}

let fingerprint = () => {
    document.querySelector(".fingerprint").src = "assets/media/red_fingerprint.svg";
    document.querySelector(".p-fingerprint").innerHTML = `טביעת אצבע שגויה <br> ענה על שאלות זיהוי בשביל לפתוח את הטלפון`;
    document.querySelector(".fingerprint").classList.add("fingerprint-shake");
    setTimeout(switchToQuestionPage, 3000);
}

let switchToQuestionPage = () => {
    strLocation = "question-page";
    document.querySelector(`.start-page`).style.display = "none";
    document.querySelector(`.question-page`).style.display = "flex";
    document.querySelector(`body`).style.backgroundImage = "url(assets/media/phone_background_1.svg)";
    arrMultipleQuestions = shuffle(DATA.questions);
    addContentToQuestion();
}

let shuffle = (arr) => {
    let tmp = arr.slice();
    for (let i = 0; i < arr.length; i++) {
        let index = Math.floor(Math.random() * tmp.length);
        arr[i] = tmp[index];
        tmp = tmp.slice(0, index).concat(tmp.slice(index + 1));
    }
    return arr;
}

let addContentToQuestion = () => {
    document.querySelector(`.p-question`).innerHTML = `${arrMultipleQuestions[nMultipleCurrentQuestion][`question`]}`;
    document.querySelector(`.input-question`).addEventListener( "input", inputAnswer);
}

let inputAnswer = (event) => {
    strTextInput = event.target.value;
    if (strTextInput === arrMultipleQuestions[nMultipleCurrentQuestion][`ans`]) {
        document.querySelector(`.input-question`).style.backgroundColor = "green";
        document.querySelector(`.input-question`).disabled = true;
        // send to next question.
        nMultipleCurrentQuestion++;
        setTimeout(() => {
            if(nMultipleCurrentQuestion < AMOUNT_OF_QUESTION) {
                    document.querySelector(`.input-question`).style.backgroundColor = "black";
                    document.querySelector(`.input-question`).disabled = false;
                    strTextInput = "";
                    document.querySelector(`.input-question`).value = "";
                    addContentToQuestion();
                } else {
                    questionsEnd();
                }
            }, 2000)
    } else if (arrMultipleQuestions[nMultipleCurrentQuestion][`ans`].length === strTextInput.length) {
        document.querySelector(`.input-question`).style.backgroundColor = "red";
    } else if (strTextInput.length === 0) {
        document.querySelector(`.input-question`).style.backgroundColor = "black";
    }
}

let questionsEnd = () => {
    document.querySelector(`.question-page`).classList.add(`animate__backOutUp`);
    document.querySelector(`.question-page`).addEventListener("animationend", () => {
        document.querySelector(`.page-notes`).style.display = "block";
        document.querySelector(`.question-page`).style.display = "none";
        document.querySelector(`body`).style.backgroundImage = "url(assets/media/gradient_screensaver.svg)";
        document.querySelector(`.page-notes`).classList.add(`animate__pulse`);
        document.querySelector(`.question-page`).classList.remove(`animate__backOutUp`);
        notesPage();
    });
}

let notesPage = () => {
    strLocation = "page-notes";
    for (let i = 1; i < DATA.notes.length; i++) {
        let item = El("div", {cls: `banner`},
        El("p",{cls: `title-notes`, id: `${i}` , listeners : {click : openNotes}}, DATA.notes[i - 1][`title`]),            
        El("img",{attributes: {class: `background-img-min-notes`, src : `assets/media/${DATA.notes[i - 1][`backgroundImage`]}`, alt : `background`}},),
        );
        document.querySelector(`.start-notes`).append(item);
    }
    document.querySelector(`.div-body`).style.overflow = "scroll";
}

let openNotes = (event) => {
    // document.querySelector(`.page-notes`).classList.remove(`animate__pulse`);
    nNotes = event.target.id;
    document.querySelector(".div-open-notes").style.display = "flex";
    document.querySelector(".start-notes").style.display = "none";
    document.querySelector(`.notes`).style.backgroundImage = `url(assets/media/${DATA.notes[nNotes - 1][`backgroundBigImage`]})`;
    document.querySelector(`.p-notes`).innerHTML = DATA.notes[nNotes - 1][`text`];
    document.querySelector(`.div-body`).style.overflow = "scroll";
    document.querySelector(`.back-button-notes`).addEventListener("click", () => {
        document.querySelector(".div-open-notes").style.display = "none";
        document.querySelector(".start-notes").style.display = "flex";
        // document.querySelector(`.div-body`).style.overflow = "hidden";
    })
}

let El = (tagName, options = {}, ...children) => {
    let el = Object.assign(document.createElement(tagName), options.fields || {});
    if (options.classes && options.classes.length) el.classList.add(...options.classes);
    else if (options.cls) el.classList.add(options.cls);
    if (options.id) el.id = options.id;
    el.append(...children.filter(el => el));
    for (let listenerName of Object.keys(options.listeners || {}))
        if (options.listeners[listenerName]) el.addEventListener(listenerName, options.listeners[listenerName], false);
    for (let attributeName of Object.keys(options.attributes || {})) {
        if (options.attributes[attributeName] !== undefined) el.setAttribute(attributeName, options.attributes[attributeName]);
    }
    return el;
}
