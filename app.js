//TODO: edit button -> edit the anwser
//TODO serve it lovalhost?
//TODO every element should be checked parent level
//TODO local browser storage

let questions = [{
    id: 1,
    text: "Can you answer these questions?",
    answer: "Im sure you can! Good luck",
    creationDate: 1541944069,
    rating: 0,
}, {
    id: 2,
    text: "In CSS what is the difference between margin and padding",
    answer: "The zebra is a great Animal",
    creationDate: 1541944069,
    rating: 0,
}];

const cardContainerNode = document.getElementById("card-container");
let navContainerNode = document.getElementById("nav-container");

document.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
    }
});



init(questions);
function init() {
    renderQuestions();
    renderNav();
}

function generateId() {
    return Math.round(Math.random() * 100000);
}

function addNewQuestion() {
    let question = document.getElementById('newQuestion').value;
    let answer = document.getElementById('newAnwser').value;
    if (question.length > 0) {
        let created = Date.now();
        let id = generateId();

        storeNewQuestionInQuestionList(id, question, answer, created, 0);
        document.getElementById('newQuestion').value = "";
        document.getElementById('newAnwser').value = "";

        addNodeElementToQuestions(id, question, answer, created);
        addNodeElementToNav(id, question);
        showNotificationBar("Sucessfully added new question");

    }//todo hint if user try to save empty question
}

function addNodeElementToQuestions(id, question, answer, created){
    cardContainerNode.appendChild(renderCard(id, question, answer, created));
};

function addNodeElementToNav(id, text){
    navContainerNode.appendChild(renderNavLink(id, text));
};

function renderNav() {
    navContainerNode.innerHTML = "";
    questions.forEach(function (question) {
        navContainerNode.appendChild(renderNavLink(question.id, question.text));
    })
}

function renderNavLink(id, text){
    let link = document.createElement("a");
    link.setAttribute("href", "#" + id);
    link.className = "navigator";
    link.innerText = text;
    return link;
}


function renderQuestions() {
    cardContainerNode.innerHTML = "";
    questions.forEach(function (question) {
        cardContainerNode.appendChild(renderCard(question.id, question.text, question.answer, question.creationDate));
    })
}

function storeNewQuestionInQuestionList(_id, _question, _answer, _created, _rate) {
    questions[questions.length] = {id: _id, question: _question, answer: _answer, creationDate: _created, rating: _rate};
}

function removeElementFromQuestionList(_id) {
    questions = questions.filter(function (el) {
        return el.id !== _id;
    })
}

function removeElementFromNav(id){
    for(let i=0;i< navContainerNode.childElementCount;i++){
        if(navContainerNode.children[i].getAttribute("href") === ("#"+id)){
            navContainerNode.removeChild(navContainerNode.children[i]);
            break;
        }
    }
}

function removeElementFromCardContainerNode(id){
    cardContainerNode.removeChild(document.getElementById(id));
};

function removeElementFromHTMLQuestionList(id) {
    console.log(document.getElementById(id));
    removeElementFromNav(id);
    removeElementFromCardContainerNode(id);
    removeElementFromQuestionList(id);
}


function saveAnswer(id) {
    let indexOfOriginal = questions.indexOf(function (el) {
        return el.id === id;
    });

    let original = questions.filter(function (el) {
        return el.id === id;
    })[0];

    console.log(document.getElementById(id).getElementsByClassName("answer")[0].innerText);
    original.answer = document.getElementById(id).getElementsByClassName("answer")[0].innerText;
    questions[indexOfOriginal] = original;

    renderQuestions();
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
        original.text = text;
        questions[indexOfOriginal] = original;
        //TODO update not render all..!
        renderQuestions();
        renderNav();
    }

}

function renderCard(_id, _question, _answer, _created) {
    let defaultValue = {question : _question, answer: _answer};

    let questionText = getQuestionNodeElement(_question);
    let createdText = getCreatedNodeElement(new Date(_created).toDateString());
    let deleteButton = getDeleteButtonNodeElement(_id);

    let questionContainer = getQuestionContainer(questionText, createdText, deleteButton);

    let answer = getAnwserNodeElement(_answer);

    let answerContainer = document.createElement("DIV");
    answerContainer.appendChild(answer);
    answerContainer.className = "answerContainer";

    let parent = document.createElement("DIV");
    parent.appendChild(questionContainer);
    parent.appendChild(answerContainer);
    parent.setAttribute("id", _id);
    parent.className = "question-card";

    onSave = (e) => {
        if (event.keyCode === 13) {
            if (e.target === questionText) {
                saveQuestion(_id);
            }
            if (e.target === answer) {
                saveAnswer(_id);
            }
        }
    };

    onHover = (e) => {
        deleteButton.classList.add("visible");
        deleteButton.classList.remove("hidden");
    };
    onMouseLeave = (e) => {
        deleteButton.classList.remove("visible");
        deleteButton.classList.add("hidden");
    };

    onFocusOut = (e) => {

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
                removeElementFromHTMLQuestionList(_id);
                showNotificationBar("Question deletion was successful");

            }
        }
        onDelete()
    };

    return parent;
}


function getQuestionContainer(questionText, createdText, deleteButton) {
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
    questionContainer.className = "questionContainer";
    return questionContainer;
}

function getQuestionNodeElement(question) {
    let questionNode = document.createElement("h2");
    questionNode.innerHTML = question;
    questionNode.className = "question-text";
    questionNode.setAttribute("contenteditable", "true");
    return questionNode;
}


function getAnwserNodeElement(answer) {

    let answerNodeElement = document.createElement("p");
    answerNodeElement.innerText = answer;
    answerNodeElement.className = "answer";
    answerNodeElement.setAttribute("contenteditable", "true");
    return answerNodeElement;
}

function getCreatedNodeElement(created) {
    let createdNode = document.createElement("div");
    createdNode.className = "created-text";
    createdNode.innerHTML = "Created: " + created;
    return createdNode;
}

function getDeleteButtonNodeElement() {
    let deleteButton = document.createElement("BUTTON");
    deleteButton.innerHTML = "x";
    deleteButton.className = "delete";
    return deleteButton;
}


function showNotificationBar(text) {
    let x = document.getElementById("snackbar");
    x.className = "show";
    x.innerText = text;
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}



