import { STORAGE } from './store.js';

const session = {
    id: '',
    surveys: [],
    status: '',
    creation: '',
    lastUpdate: ''
};
 
const contextBtn = document.getElementById('context-btn');
const startBtn = document.getElementById('start-btn');
const errorDiv = document.getElementById('msg-error');
const table = document.getElementById('table');
const inputFile = document.getElementById('data-file');
const newBtn = {
    btn: document.getElementById('new'),
    isClicked: false,
    tableHeader: createTableHeader('Survey', 'Description', 'Categories', 'Questions'),
    data: STORAGE.surveys,
    fillTableCallback: newBtnFillTable
}
const loadBtn = {
    btn: document.getElementById('load'),
    isClicked: false,
    tableHeader: createTableHeader('Assessment', 'Survey', 'Status', 'Creation', 'Last update'),
    data: STORAGE.sessions,
    fillTableCallback: loadBtnFillTable
}
const buttons = [newBtn, loadBtn];

setContextBtn();
inputFile.addEventListener('change', fileUpload);
newBtn.btn.addEventListener('click', () => { clickButton(newBtn) });
loadBtn.btn.addEventListener('click', () => { clickButton(loadBtn) });

function clickButton(btn) {
    resetMenu();
    for (const button of buttons) {
        if (button !== btn) {
            button.isClicked = false;
            button.btn.style.backgroundColor = '';
            button.btn.style.color = 'black';
            continue;
        }
        if (button.isClicked) {
            button.isClicked = false;
            button.btn.style.backgroundColor = '';
            button.btn.style.color = 'black';
            clearAndHideTable();
        }
        else {
            button.isClicked = true;
            button.btn.style.backgroundColor = 'rgba(255, 99, 132, 0.7)';
            button.btn.style.color = 'white';
            clearAndHideTable();
            fillAndShowTable(btn);
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

function createTableHeader(...headers) {
    const tr = document.createElement('tr');

    let th = document.createElement('th');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.addEventListener('click', handleHeaderCheckboxClick);
    th.appendChild(input);
    tr.appendChild(th);

    for (const header of headers) {
        th = document.createElement('th');
        th.innerText = header;
        tr.appendChild(th);
    }

    return tr;
}

function handleHeaderCheckboxClick(ev) {
    const nodes = table.childNodes;
    const size = nodes.length;
    const checkValue = ev.target.checked;
    for (let i = 1; i < size; ++i) {
        const checkbox = nodes[i].childNodes[0].childNodes[0];
        checkbox.checked = checkValue;
    }
    if (checkValue) {
        if (session.surveys.length > 0) { 
            session.surveys = new Array(STORAGE.surveys.length); 
        }
        let i = 0;
        for (const survey of STORAGE.surveys) {
            session.surveys[i++] = survey.id;
        }
    } else {
        session.surveys = []
    }
    handleStartBtn();
}

function clearAndHideTable() {
    startBtn.style.visibility = 'hidden';
    table.style.visibility = 'hidden';
    while (table.hasChildNodes()) {
        table.removeChild(table.lastChild);
    }
}

function fillAndShowTable(btn) {
    const headerHtmlNode = btn.tableHeader;
    const dataList = btn.data;
    let tr, td, input;

    table.style.visibility = 'visible';
    startBtn.style.visibility = 'visible';
    if (!dataList) {
        tr = document.createElement('tr');
        const th = document.createElement('th');
        th.innerText = 'Error message';
        tr.appendChild(th);
        table.appendChild(tr);

        tr = document.createElement('tr');
        td = document.createElement('td');
        td.innerText = 'No Data available.'
        tr.appendChild(td);
        table.appendChild(tr);
        return;
    }

    table.appendChild(headerHtmlNode);
    for (const data of dataList) {
        tr = document.createElement('tr');
        td = document.createElement('td');
        input = document.createElement('input');
        input.type = 'checkbox';
        input.addEventListener('click', handleRowCheckboxClick);
        td.appendChild(input);
        tr.appendChild(td);
        btn.fillTableCallback(data, tr);
        table.appendChild(tr);
    }
}

function handleRowCheckboxClick(ev) {
    if (!ev.target.checked) {
        table.childNodes[0].childNodes[0].childNodes[0].checked = false;
    }
    if (newBtn.isClicked) {
        handleSurveyByCheckbox(ev.target);
        handleStartBtn();
    }
}

function newBtnFillTable(data, tr) {
    let td = document.createElement('td');
    td.innerText = data.id;
    tr.appendChild(td);

    td = document.createElement('td');
    td.innerText = data.description;
    tr.appendChild(td);

    td = document.createElement('td');
    td.innerText = data.categories.length;
    tr.appendChild(td);

    let qCount = 0;
    for (const cat of data.categories) {
        qCount += cat.questions.length;
    }

    td = document.createElement('td');
    td.innerText = qCount;
    tr.appendChild(td);
}

function loadBtnFillTable(data, tr) {
    for (const key in data) {
        const td = document.createElement('td');
        td.innerText = data[key];
        tr.appendChild(td);
    }
}

function handleSurveyByCheckbox(checkbox) {
    const size = table.childNodes.length;
    for (let i = 0; i < size; ++i) {
        if (table.childNodes[i].childNodes[0].childNodes[0] === checkbox) {
            const id = STORAGE.surveys[i-1].id;
            if (!checkbox.checked) {
                // remove session survey
                session.surveys = session.surveys.filter(s => s !== id);
            } else {
                // add session survey
                session.surveys.push(id);
            }
            break;
        }
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

function disableStartBtn() {
    startBtn.disabled = true;
    startBtn.style.opacity = '0.5';
    startBtn.style.cursor = 'auto';
}

function enableStartBtn() {
    startBtn.disabled = false;
    startBtn.style.opacity = '1';
    startBtn.style.cursor = 'pointer';
}

function resetMenu() {
    disableStartBtn();
    if (session.surveys.length > 0) {
        session.surveys = [];
    }
}

function handleStartBtn() {
    if (session.surveys.length === 0) {
        disableStartBtn();
    } else {
        enableStartBtn();
    }
}