import { CONFIG } from './config.js';
import { STORAGE, SESSION } from './store.js';
import { disableBtn } from './utils.js';
import { NewAssessmentTable, LoadAssessmentTable } from './table.js';
 
const contextBtn = document.getElementById('context-btn');
const startBtn = document.getElementById('start-btn');
const errorDiv = document.getElementById('msg-error');
const table = document.getElementById('table');
const inputFile = document.getElementById('data-file');
const newBtn = {
    btn: document.getElementById('new'),
    isClicked: false,
    data: STORAGE.surveys,
    table: new NewAssessmentTable(table, startBtn, 'Survey', 'Description', 'Categories', 'Questions')
}
const loadBtn = {
    btn: document.getElementById('load'),
    isClicked: false,
    data: STORAGE.sessions,
    table: new LoadAssessmentTable(table, startBtn, 'Assessment', 'Survey', 'Status', 'Creation', 'Last update')
}
const buttons = [newBtn, loadBtn];

setContextBtn();
inputFile.addEventListener('change', fileUpload);
newBtn.btn.addEventListener('click', () => { clickButton(newBtn) });
loadBtn.btn.addEventListener('click', () => { clickButton(loadBtn) });
startBtn.addEventListener('click', () => { 
    const _table = newBtn.isClicked ? newBtn.table : loadBtn.table;
    if (_table.handleStartBtn()) {
        window.location.href = CONFIG.surveyURL;
    }
});

function clickButton(btn) {
    resetMenu();
    for (const button of buttons) {
        if (button !== btn) {
            button.isClicked = false;
            button.btn.style.backgroundColor = '';
            button.btn.style.color = 'black';
            continue;
        }
        btn.table.clear();
        if (button.isClicked) {
            button.isClicked = false;
            button.btn.style.backgroundColor = '';
            button.btn.style.color = 'black';
        }
        else {
            button.isClicked = true;
            button.btn.style.backgroundColor = 'rgba(255, 99, 132, 0.7)';
            button.btn.style.color = 'white';
            btn.table.fillTable(btn.data);
        }
    }
}

function fileUpload(ev) {
    resetFileUploadError();
    const file = ev.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev2) => {
            if (STORAGE.init(ev2.target.result)) {
                newBtn.data = STORAGE.surveys;
                loadBtn.data = STORAGE.sessions;
                setContextBtn();
            } else {
                showFileUploadError();
            }
        }
        reader.readAsText(file);
    }
}

function setContextBtn() {
    contextBtn.innerText = STORAGE.contextId;
}

function showFileUploadError() {
    errorDiv.style.display = 'block';
}

function resetFileUploadError() {
    errorDiv.style.display = 'none';
}

function resetMenu() {
    disableBtn(startBtn);
    const surveys = SESSION.getSurveys();
    if (surveys.length > 0) {
        SESSION.setSurveys(new Array());
    }
}
