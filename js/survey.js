import { CONFIG } from './config.js';
import { STORAGE, SESSION } from './store.js';
import Stepper from './stepper.js'; 
import { SurveyContext } from './context.js';

const ANSWERS = [['-1', ''], ['0', 'No'], ['0.5', 'Partial'], ['1', 'Yes']];
const contextBtn = document.getElementById('context-btn');
const sessionIdInput = document.getElementById('session-id');
const creationInput = document.getElementById('creation-input');
const lastUpdateInput = document.getElementById('lastupdate-input');
const survey = document.getElementById('survey');
let stepper;
let surveysContext;

initialize();

function setContextBtn() {
    contextBtn.innerText = STORAGE.contextId;
}

function initialize() {
    const surveys = SESSION.getSurveys();
    if (surveys?.length !== 0) {
        setContextBtn();
        stepper = new Stepper(surveys);
        surveysContext = new Array(surveys.length);
        for (let i = 0; i < surveys.length; ++i) {
            surveysContext[i] = new SurveyContext(STORAGE.surveys[i]);
        }
        createSurveyByStepper();
    } else {
        window.location.href = CONFIG.homeURL;
    }
}

function createSurveyByStepper() {
    const index = stepper.getCurrentIndex();
    const surveys = STORAGE.surveys;
    if (index < 0 || index >= surveys.length) return;
    // append title
    const title = document.createElement('h1');
    title.setAttribute('class', 'survey-title');
    title.innerText = surveys[index].id;
    survey.appendChild(title);
    // append description (optional)
    if (surveys[index].description?.trim().length !== 0) {
        const desc = document.createElement('div');
        desc.setAttribute('class', 'survey-desc');
        desc.innerText = surveys[index].description;
        survey.appendChild(desc);
    }
    // append categories
    createCategories(surveys[index]);
}

function createCategories(surveyNode) {
    const categories = surveyNode.categories;
    const size = categories.length;
    for (let i = 0; i < size; ++i) {
        // append category container to the survey
        const categoryContainer = document.createElement('div');
        categoryContainer.setAttribute('key', i);
        categoryContainer.setAttribute('class', 'cat-container');
        survey.appendChild(categoryContainer);

        // append category title
        const title = document.createElement('h2');
        title.setAttribute('class', 'cat-title');
        title.innerText = `${i+1}. ${categories[i].name}`;
        categoryContainer.appendChild(title);
        
        // append category description (optional)
        if (categories[i].description?.trim().length !== 0) {
            const catDesc = document.createElement('div');
            catDesc.setAttribute('class', 'cat-desc');
            const span = document.createElement('span');
            span.innerHTML = 'Description';
            catDesc.appendChild(span);
            const divDesc = document.createElement('div');
            divDesc.innerText = categories[i].description;
            catDesc.appendChild(divDesc);
            categoryContainer.appendChild(catDesc);

            createQuestions(categoryContainer, categories[i]);
        }
    }
}

function createQuestions(container, category) {
    const questions = category.questions;
    const size = questions.length;
    for (let i = 0; i < size; ++i) { 
        // append question container to the category container
        const questionContainer = document.createElement('div');
        questionContainer.setAttribute('key', i);
        questionContainer.setAttribute('class', 'q');
        container.appendChild(questionContainer);
        // append question number
        const qNumber = document.createElement('span');
        qNumber.setAttribute('class', 'qn');
        qNumber.innerText = `${i+1}.`;
        questionContainer.appendChild(qNumber);
        // append questions answers
        questionContainer.appendChild(createAndGetAnswers());
        // append question comment button
        questionContainer.appendChild(createAndGetCommentBtn());
        // append question text
        const qText = document.createElement('span');
        qText.setAttribute('class', 'q-text');
        qText.innerText = questions[i].q;
        questionContainer.appendChild(qText);
    }   
}

function createAndGetAnswers() {
    const qAnswers = document.createElement('select');
    qAnswers.setAttribute('class', 'q-answer');
    
    for (const answ of ANSWERS) {
        const opt = document.createElement('option');
        opt.value = answ[0];
        opt.innerText = answ[1];
        qAnswers.appendChild(opt);
    }

    return qAnswers;
}

function createAndGetCommentBtn() {
    const commentBtn = document.createElement('button');
    commentBtn.setAttribute('class', 'comment-btn');
    const icon = document.createElement('i');
    icon.style.fontSize = '15px';
    icon.setAttribute('class', 'material-icons');
    icon.innerText = 'description';
    commentBtn.appendChild(icon);
    commentBtn.addEventListener('click', handleCommentInput);
    return commentBtn;
}

function handleCommentInput(ev) {
    const commentBtn = ev.currentTarget;
    const qDiv = commentBtn.parentElement;
    if (!qDiv) return;
    const qCat = qDiv.parentElement;
    if (!qCat) return;
    // if comment button isn't clicked
    if (qDiv.lastChild.nodeName !== 'INPUT') {
        const qIdx = Number.parseInt(qDiv.getAttribute('key'));
        if (Number.isNaN(qIdx) || qIdx < 0) return;
        const cIdx = Number.parseInt(qCat.getAttribute('key'));
        if (Number.isNaN(cIdx) || cIdx < 0) return;
        // change button style when clicked
        commentBtn.setAttribute('class', 'comment-btn active');
        // add input comment
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('class', 'comment');
        input.placeholder = 'Enter a note...';
        input.innerText = surveysContext[stepper.getCurrentIndex()].comments[cIdx][qIdx];
        qDiv.appendChild(input);
    }
    // if comment button is clicked
    else {
        // change button style when clicked
        commentBtn.setAttribute('class', 'comment-btn');
        // remove input comment
        qDiv.removeChild(qDiv.lastChild);
    }   
}
