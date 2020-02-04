document.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
    }
});

const cardContainerNode = document.getElementById("card-container");
const navContainerNode = document.getElementById("nav-container");
let questions;

let zeroQuestionList = [{
    id: 1,
    questionText: "Can you answer these questions?",
    answer: "I'm sure you can! Good luck",
    creationDate: 1541944069,
    rating: 0
}, {
    id: 2,
    questionText: "In CSS what is the difference between margin and padding",
    answer: "Margin is the space outside an element's border, while padding is the space between the border",
    creationDate: 1541944069,
    rating: 0
}, {
    id: 3,
    questionText: "What responsive web design means?",
    answer: "Wiki: Responsive web design (RWD) is an approach to web design that makes web pages render well on a variety of devices and window or screen sizes.",
    creationDate: 1541944069,
    rating: 2
}, {
    id: 4,
    questionText: "What is JSON?",
    answer: "JSON stands for JavaScript Object Notation",
    creationDate: 1541944069,
    rating: 1
}, {
    id: 5,
    questionText: "What is event binding?",
    answer: "KnockOutJS: The event binding allows you to add an event handler for a specified event so that your chosen JavaScript function will be invoked when that event is triggered for the associated DOM element.",
    creationDate: 1541944069,
    rating: 5
}, {
    id: 6,
    questionText: "What is a Promise? ",
    answer: "Something you should keep:) ",
    creationDate: 1541944069,
    rating: 2
}, {
    id: 7,
    questionText: "What does non-blocking I/O means and why is that matter in User Interfaces? ",
    answer: "allows asnyc operation",
    creationDate: 1541944069,
    rating: 0
}, {
    id: 8,
    questionText: "What is Babel and why you should know about it? ",
    answer: "Babel will turn your ES6+ code into ES5 friendly code, so you can start using it right now without waiting for browser support. Detailed answer: https://codemix.com/blog/why-babel-matters/",
    creationDate: 1541944069,
    rating: 2
}, {
    id: 9,
    questionText: "What is webpack? ",
    answer: "Webpack is a module bundler. Webpack can take care of bundling alongside a separate task runner.",
    creationDate: 1541944069,
    rating: 0
}, {
    id: 10,
    questionText: "How can you cut a round cheese three times to make eight equal slices?",
    answer: "Do it 3x: cut half, place all the pieces onto each other.",
    creationDate: 1541944069,
    rating: 2
}, {
    id: 11,
    questionText: "Which framework is the best?",
    answer: "I am not familiar all of them so I can not tell:)",
    creationDate: 1541944069,
    rating: 0
}];
init();


function storeQuestionListInWindowLocalStorage() {
    window.localStorage.setItem("storedQuestionList", JSON.stringify(questions));
}


function init() {
    let storedList = window.localStorage.getItem("storedQuestionList");
    if (storedList !== "null" && storedList !== "undefined" && storedList!=="[]") {
        try {
            questions = JSON.parse(window.localStorage.getItem("storedQuestionList"));
        }
        catch (err) {
            questions = zeroQuestionList;
        }
    } else {
        questions = zeroQuestionList;

    }
    storeQuestionListInWindowLocalStorage();
    renderQuestions();
    renderNav();
}


function generateId() {
    return Math.round(Math.random() * 100000);
}


function renderNav() {
    navContainerNode.innerHTML = "";
    questions.forEach(function (question) {
        navContainerNode.appendChild(renderNavLink(question.id, question.questionText));
    })
}

function renderNavLink(id, text) {
    let link = document.createElement("a");
    link.setAttribute("href", "#" + id);
    link.className = "navigator";
    link.innerText = text;
    return link;
}


function renderQuestions() {
    cardContainerNode.innerHTML = "";
    cardContainerNode.appendChild(renderAddButton());
    questions.forEach(function (question) {
        cardContainerNode.appendChild(renderCard(question.id, question.questionText, question.answer, question.creationDate));
    });
}

function renderCard(id, question, answer, created) {
    let defaultValue = {question: question, answer: answer};

    let questionText = renderQuestionElement(question);
    let createdText = renderCreatedElement(new Date(created).toDateString());
    let deleteButton = renderDeleteButtonElement(id);

    let questionContainer = renderQuestionContainer(questionText, createdText, deleteButton);

    let answerText = renderAnswerElement(answer);

    let answerContainer = document.createElement("DIV");
    answerContainer.appendChild(answerText);
    answerContainer.className = "answer-container";

    let parent = document.createElement("DIV");
    parent.appendChild(questionContainer);
    parent.appendChild(answerContainer);
    parent.setAttribute("id", id);
    parent.className = "question-card";

    onSave = (e) => {
        if (event.keyCode === 13) {
            if (e.target === questionText) {
                saveQuestion(id);
                showNotificationBar("Question updated");
            }
            if (e.target === answerText) {
                saveAnswer(id);
                showNotificationBar("Answer updated");
            }
        }
    };

    onHover = () => {
        deleteButton.classList.add("visible");
        deleteButton.classList.remove("hidden");
    };
    onMouseLeave = () => {
        deleteButton.classList.remove("visible");
        deleteButton.classList.add("hidden");
    };

    onFocusOut = () => {
        answer.innerText = defaultValue.answer;
        questionText.innerText = defaultValue.question;
    };


    parent.addEventListener('keyup', onSave, false);
    parent.addEventListener('mouseover', onHover, false);
    parent.addEventListener('mouseleave', onMouseLeave, false);
    parent.addEventListener('focusout', onFocusOut, false);

    deleteButton.onclick = function () {
        function onDelete() {
            if (confirm("Are you sure you van to delete it?")) {
                removeElementFromHTMLQuestionList(id);
                showNotificationBar("Question deletion was successful");
                storeQuestionListInWindowLocalStorage();
            }
        }

        onDelete()
    };

    return parent;
}

function renderAddButton() {
    let addButton = document.createElement("button");
    addButton.innerHTML = "+";
    addButton.addEventListener('click', addNewQuestion, false);
    addButton.className = "addBtn";
    return addButton;
}


function renderQuestionContainer(questionText, createdText, deleteButton) {
    let questionContainer = document.createElement("DIV");
    let left = document.createElement("DIV");
    left.className = "left";
    let right = document.createElement("DIV");
    right.className = "right";

    left.appendChild(questionText);
    left.appendChild(createdText);
    right.appendChild(deleteButton);
    questionContainer.appendChild(left);
    questionContainer.appendChild(right);
    questionContainer.className = "question-container";
    return questionContainer;
}

function renderQuestionElement(question) {
    let questionNode = document.createElement("h2");
    questionNode.innerHTML = question;
    questionNode.className = "question-text";
    questionNode.setAttribute("contenteditable", "true");
    return questionNode;
}


function renderAnswerElement(answer) {

    let answerNodeElement = document.createElement("p");
    answerNodeElement.innerText = answer;
    answerNodeElement.className = "answer-text";
    answerNodeElement.setAttribute("contenteditable", "true");
    return answerNodeElement;
}

function renderCreatedElement(created) {
    let createdNode = document.createElement("div");
    createdNode.className = "created-text";
    createdNode.innerHTML = "Created: " + created;
    return createdNode;
}

function renderDeleteButtonElement() {
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "x";
    deleteButton.className = "delete";
    return deleteButton;
}

function storeNewQuestionInQuestionList(_id, _question, _answer, _created, _rate) {
    questions[questions.length] = {
        id: _id,
        questionText: _question,
        answer: _answer,
        creationDate: _created,
        rating: _rate
    };
    storeQuestionListInWindowLocalStorage();
}


function addNodeElementToQuestions(id, question, answer, created) {
    let card = renderCard(id, question, answer, created)
    cardContainerNode.insertBefore(card, cardContainerNode.firstChild.nextSibling);
    card.getElementsByClassName("question-text")[0].focus();
}

function addNodeElementToNav(id, text) {
    navContainerNode.appendChild(renderNavLink(id, text));
}


function addNewQuestion() {
    let questionText = "New Question";
    let answer = "";
    let created = Date.now();
    let id = generateId();

    storeNewQuestionInQuestionList(id, questionText, answer, created, 0);
    addNodeElementToNav(id, questionText);
    addNodeElementToQuestions(id, questionText, answer, created);

    storeQuestionListInWindowLocalStorage();
}

function removeElementFromQuestionList(_id) {
    questions = questions.filter(function (el) {
        return el.id !== _id;
    })
}

function removeElementFromNav(id) {
    for (let i = 0; i < navContainerNode.childElementCount; i++) {
        if (navContainerNode.children[i].getAttribute("href") === ("#" + id)) {
            navContainerNode.removeChild(navContainerNode.children[i]);
            break;
        }
    }
}

function removeElementFromCardContainerNode(id) {
    cardContainerNode.removeChild(document.getElementById(id));
}

function removeElementFromHTMLQuestionList(id) {
    removeElementFromNav(id);
    removeElementFromCardContainerNode(id);
    removeElementFromQuestionList(id);
    storeQuestionListInWindowLocalStorage();
}


function saveAnswer(id) {
    let indexOfOriginal = questions.indexOf(function (el) {
        return el.id === id;
    });

    let original = questions.filter(function (el) {
        return el.id === id;
    })[0];

    original.answer = document.getElementById(id).getElementsByClassName("answer-text")[0].innerText;
    questions[indexOfOriginal] = original;
    renderQuestions();
    storeQuestionListInWindowLocalStorage();
}

function saveQuestion(id) {
    let indexOfOriginal = questions.indexOf(function (el) {
        return el.id === id;
    });

    let original = questions.filter(function (el) {
        return el.id === id;
    })[0];

    let text = document.getElementById(id).getElementsByClassName("question-text")[0].innerText;
    if (text.length > 0) {
        original.questionText = text;
        questions[indexOfOriginal] = original;
        renderQuestions();
        renderNav();
        storeQuestionListInWindowLocalStorage();
    }

}

function showNotificationBar(text) {
    let x = document.getElementById("snackbar");
    x.className = "show";
    x.innerText = text;
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}




