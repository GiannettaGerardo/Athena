import { CONFIG } from './config.js';
import { STORAGE, SESSION } from './store.js';
import Stepper from './stepper.js'; 
import { SurveyContext } from './context.js';
import { _C } from './utils.js';

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
        surveysContext = new Array(surveys.length);
        for (let i = 0; i < surveys.length; ++i) {
            surveysContext[i] = new SurveyContext(STORAGE.surveys[i]);
        }
        stepper = new Stepper(surveys, areAnswersCompletedForSurvey, switchSurvey);
        createSurvey(0);
    } else {
        window.location.href = CONFIG.homeURL;
    }
}

function areAnswersCompletedForSurvey(idx) {
    return surveysContext[idx].validateAnswers();
}

function switchSurvey(surveyIdx) {
    // clear the survey container
    while (survey.hasChildNodes()) {
        survey.removeChild(survey.lastChild);
    }
    // create the new survey
    createSurvey(surveyIdx);
}

function createSurvey(index) {
    //const index = stepper.getCurrentIndex();
    const surveys = STORAGE.surveys;
    if (index < 0 || index >= surveys.length) return;
    // append title
    survey.appendChild(_C('h1', surveys[index].id, 'survey-title'));
    // append description (optional)
    if (surveys[index].description?.trim().length !== 0) {
        survey.appendChild(_C('div', surveys[index].description, 'survey-desc'));
    }
    // append categories
    createCategories(surveys[index]);
}

function createCategories(surveyNode) {
    const categories = surveyNode.categories;
    const size = categories.length;
    for (let i = 0; i < size; ++i) {
        // append category container to the survey
        
        const categoryContainer = _C('div', null, 'cat-container');
        categoryContainer.setAttribute('key', i);
        survey.appendChild(categoryContainer);

        // append category title
        categoryContainer.appendChild(_C('h2', `${i+1}. ${categories[i].name}`, 'cat-title'));
        
        // append category description (optional)
        if (categories[i].description?.trim().length !== 0) {
            const catDesc = _C('div', null, 'cat-desc');
            catDesc.appendChild(_C('span', 'Description'));
            catDesc.appendChild(_C('div', categories[i].description));
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
        const questionContainer = _C('div', null, 'q');
        questionContainer.setAttribute('key', i);
        container.appendChild(questionContainer);
        // append question number
        questionContainer.appendChild(_C('span', `${i+1}.`, 'qn'));
        // append questions answers
        questionContainer.appendChild(createAndGetAnswers(questionContainer));
        // append question comment button
        const commentButton = createAndGetCommentBtn();
        questionContainer.appendChild(commentButton);
        // append question text
        questionContainer.appendChild(_C('span', questions[i].q, 'q-text'));
        // activate the comment button and show the comment if any
        openCommentIfAny(questionContainer, commentButton);
    }   
}

function createAndGetAnswers(container) {
    const qAnswers = _C('select', null, 'q-answer');
    for (const answ of ANSWERS) {
        const opt = _C('option', answ[1]);
        opt.value = answ[0];
        qAnswers.appendChild(opt);
    }
    // add the previous answer if any
    const qI = container.getAttribute('key');
    const cI = container.parentElement.getAttribute('key');
    const answer = surveysContext[stepper.getCurrentIndex()].answers[cI][qI];
    qAnswers.value = answer;
    if (answer !== -1) {
        qAnswers.style.backgroundColor = 'rgb(255, 222, 229)';
    }
    // handle answer selection
    qAnswers.addEventListener('change', (ev) => {
        const q = ev.target.parentElement;
        const qIdx = q.getAttribute('key');
        const cIdx = q.parentElement.getAttribute('key');
        const n = Number.parseFloat(ev.target.options[ev.target.selectedIndex].value);
        surveysContext[stepper.getCurrentIndex()].answers[cIdx][qIdx] = n;

        ev.target.style.backgroundColor = n !== -1 ? 'rgb(255, 222, 229)' : null;
        // complete or not the current step in the stepper
        stepper.handleStepCompletion(areAnswersCompletedForSurvey(stepper.getCurrentIndex()));
    })
    return qAnswers;
}

function createAndGetCommentBtn() {
    const commentBtn = _C('button', null, 'comment-btn');
    const icon = _C('i', 'description', 'material-icons');
    icon.style.fontSize = '15px';
    commentBtn.appendChild(icon);
    commentBtn.addEventListener('click', handleCommentInput);
    return commentBtn;
}

function handleCommentInput(ev) {
    const commentBtn = ev.currentTarget;
    const qDiv = commentBtn.parentElement;
    const qIdx = qDiv.getAttribute('key');
    const cIdx = qDiv.parentElement.getAttribute('key');
    const commentStr = surveysContext[stepper.getCurrentIndex()].comments[cIdx][qIdx];
    // if comment button isn't clicked
    if (qDiv.lastChild.nodeName !== 'INPUT') {
        createCommentInput(qDiv, commentBtn, commentStr);
    }
    // if comment button is clicked
    else {
        // change button style when clicked
        commentBtn.setAttribute('class', commentStr ? 'comment-btn filled' : 'comment-btn');
        // remove input comment
        qDiv.removeChild(qDiv.lastChild);
    }   
}

function changeComment(ev) {
    const q = ev.target.parentElement;
    const qIdx = q.getAttribute('key');
    const cIdx = q.parentElement.getAttribute('key');
    surveysContext[stepper.getCurrentIndex()].comments[cIdx][qIdx] = ev.target.value;
}

function openCommentIfAny(qContainer, commentBtn) {
    const cContainer = qContainer.parentElement;
    const qIdx = qContainer.getAttribute('key');
    const cIdx = cContainer.getAttribute('key');
    const comment = surveysContext[stepper.getCurrentIndex()].comments[cIdx][qIdx];
    if (comment) {
        createCommentInput(qContainer, commentBtn, comment);
    }
}

function createCommentInput(qContainer, commentBtn, commentStr) {
    // change button style when clicked
    commentBtn.setAttribute('class', 'comment-btn active');
    // add input comment
    const input = _C('input', null, 'comment');
    input.value = commentStr;
    input.setAttribute('type', 'text');
    input.placeholder = 'Enter a note...';
    input.addEventListener('input', changeComment);
    qContainer.appendChild(input);
}
