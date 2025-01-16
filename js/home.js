import { STORAGE } from './store.js';
 
const table = document.getElementById('table');
const newBtn = {
    btn: document.getElementById('new'),
    isClicked: false,
    tableHeader: createTableHeader('Survey', 'Categories', 'Questions'),
    data: STORAGE.surveys
}
const loadBtn = {
    btn: document.getElementById('load'),
    isClicked: false,
    tableHeader: createTableHeader('Assessment', 'Survey', 'Status', 'Timestamp'),
    data: [//STORAGE.sessions
        { id: 'Alfreds Futterkiste', survey: 'CIS Controls v8', status: 'Survey', timestamp: '15/01/2025, 22:44:06'},
        { id: 'Centro_comercial_Moctezuma_evervtvt_btebe_bte_b', survey: 'NIST', status: 'Dashboard', timestamp: '15/01/2025, 22:44:06'},
        { id: 'Laughing Bacchus Winecellars wrvrvrv tev te betbet f', survey: 'CIS Controls v8', status: 'Survey', timestamp: '15/01/2025, 22:44:06'},
        { id: 'Alfreds Futterkiste 2', survey: 'CIS Controls v8', status: 'Survey', timestamp: '15/01/2025, 22:44:06'},
    ]
}
const buttons = [newBtn, loadBtn];

newBtn.btn.addEventListener('click', () => { clickButton(newBtn) });
loadBtn.btn.addEventListener('click', () => { clickButton(loadBtn) });

function clickButton(btn) {
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
            fillAndShowTable(btn.tableHeader, btn.data);
        }
    }
}

function createTableHeader(...headers) {
    const tr = document.createElement('tr');

    let th = document.createElement('th');
    const input = document.createElement('input'); //<input type="checkbox" value="">
    input.type = 'checkbox';
    input.addEventListener('click', (ev) => {
        const nodes = table.childNodes;
        const size = nodes.length;
        const checkValue = ev.target.checked;
        for (let i = 1; i < size; ++i) {
            const checkbox = nodes[i].childNodes[0].childNodes[0];
            checkbox.checked = checkValue;
        }
    });
    th.appendChild(input);
    tr.appendChild(th);

    for (const header of headers) {
        th = document.createElement('th');
        th.innerText = header;
        tr.appendChild(th);
    }

    return tr;
}

function clearAndHideTable() {
    table.style.visibility = 'hidden';
    while (table.hasChildNodes()) {
        table.removeChild(table.lastChild);
    }
}

function fillAndShowTable(headerHtmlNode, dataList) {
    let tr, td, input;

    table.style.visibility = 'visible';
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
        input.addEventListener('click', (ev) => {
            if (!ev.target.checked) {
                table.childNodes[0].childNodes[0].childNodes[0].checked = false;
            }
        });
        td.appendChild(input);
        tr.appendChild(td);
        for (const key in data) {
            td = document.createElement('td');
            td.innerText = data[key];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}
