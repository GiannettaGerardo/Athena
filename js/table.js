import { STORAGE, SESSION } from './store.js';
import { disableBtn, enableBtn } from './utils.js';

class AbstractTable {
    table;
    header;

    constructor(table, ...headers) {
        if (this.constructor == AbstractTable) {
            throw new Error("Class is of abstract type and can't be instantiated");
        };
        this.table = table;

        const tr = document.createElement('tr');
        for (const header of headers) {
            let th = document.createElement('th');
            th.innerText = header;
            tr.appendChild(th);
        }

        this.header = tr;
    }

    clear() {
        while (table.hasChildNodes()) {
            this.table.removeChild(this.table.lastChild);
        }
    }

    fillTable(dataList) {
        let tr, td;
    
        if (!dataList) {
            tr = document.createElement('tr');
            const th = document.createElement('th');
            th.innerText = 'Error message';
            tr.appendChild(th);
            this.table.appendChild(tr);
    
            tr = document.createElement('tr');
            td = document.createElement('td');
            td.innerText = 'No Data available.'
            tr.appendChild(td);
            this.table.appendChild(tr);
            return;
        }
    
        this.table.appendChild(this.header);
        for (const data of dataList) {
            tr = document.createElement('tr');
            this.fillTableCallback(data, tr);
            this.table.appendChild(tr);
        }
    }

    fillTableCallback(data, tr) {
        throw new Error("fillTableCallback is an abstract method and cannot be called");
    }
}

class AbstractTableCheckbox extends AbstractTable {
    constructor(table, ...headers) {
        super(table, ...headers);
    }

    // @Override
    fillTable(dataList) {
        super.fillTable(dataList);
        if (!dataList) { return }
        let input, td, i = 1;
        const size = dataList.length;
        const nodes = this.table.childNodes;
        // nodes[0] is the header
        while (i <= size) {
            td = document.createElement('td');
            input = document.createElement('input');
            input.type = 'checkbox';
            input.addEventListener('click', ev => this.handleRowCheckboxClick(ev));
            td.appendChild(input);
            nodes[i].insertBefore(td, nodes[i].firstChild);
            ++i;
        }
    }

    handleRowCheckboxClick(ev) {
        throw new Error("handleRowCheckboxClick is an abstract method and cannot be called");
    }
}

class HomeTable extends AbstractTableCheckbox {
    startBtn;

    constructor(table, startBtn, ...headers) {
        super(table, ...headers);
        this.startBtn = startBtn;
    }

    // @Override
    fillTable(dataList) {
        super.fillTable(dataList);
        this.table.style.visibility = 'visible';
        this.startBtn.style.visibility = 'visible';
    }

    // @Override
    clear() {
        super.clear();
        this.startBtn.style.visibility = 'hidden';
        this.table.style.visibility = 'hidden';
    }

    handleStartBtn() {
        throw new Error("handleStartBtn is an abstract method and cannot be called");
    }
}

export class NewAssessmentTable extends HomeTable {
    constructor(table, startBtn, ...headers) {
        super(table, startBtn, ...headers);

        const th = document.createElement('th');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.addEventListener('click', ev => this.handleHeaderCheckboxClick(ev));
        th.appendChild(input);
        this.header.insertBefore(th, this.header.firstChild);
    }

    // @Override
    fillTable(dataList) {
        super.fillTable(dataList);
        this.header.childNodes[0].childNodes[0].checked = false;
    }

    // @Override
    fillTableCallback(data, tr) {
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

    handleHeaderCheckboxClick(ev) {
        const nodes = this.table.childNodes;
        const size = nodes.length;
        const checkValue = ev.target.checked;
        for (let i = 1; i < size; ++i) {
            const checkbox = nodes[i].childNodes[0].childNodes[0];
            checkbox.checked = checkValue;
        }
        if (checkValue) {
            let surveys = SESSION.getSurveys();
            if (surveys.length > 0) { 
                surveys = new Array(STORAGE.surveys.length); 
            }
            let i = 0;
            for (const survey of STORAGE.surveys) {
                surveys[i++] = survey.id;
            }
            SESSION.setSurveys(surveys);
        } else {
            SESSION.setSurveys(new Array());
        }
        this.#manageStartBtn();
    }

    // @Override
    handleRowCheckboxClick(ev) {
        if (!ev.target.checked) {
            this.table.childNodes[0].childNodes[0].childNodes[0].checked = false;
        }
        this.#handleSurveyByCheckbox(ev.target);
        this.#manageStartBtn();
    }

    #handleSurveyByCheckbox(checkbox) {
        const size = this.table.childNodes.length;
        for (let i = 0; i < size; ++i) {
            if (this.table.childNodes[i].childNodes[0].childNodes[0] === checkbox) {
                const id = STORAGE.surveys[i-1].id;
                let surveys = SESSION.getSurveys();
                if (!checkbox.checked) {
                    // remove session survey
                    surveys = surveys.filter(s => s !== id);
                } else {
                    // add session survey
                    surveys.push(id);
                }
                SESSION.setSurveys(surveys);
                break;
            }
        }
    }

    #manageStartBtn() {
        if (SESSION.getSurveys().length === 0) {
            disableBtn(this.startBtn);
        } else {
            enableBtn(this.startBtn);
        }
    }

    // @Override
    handleStartBtn() {
        console.log(SESSION.getSurveys());
        return true;
    }
}

export class LoadAssessmentTable extends HomeTable {
    constructor(table, startBtn, ...headers) {
        super(table, startBtn, ...headers);

        this.header.insertBefore(document.createElement('th'), this.header.firstChild);
    }

    // @Override
    fillTableCallback(data, tr) {
        for (const key in data) {
            const td = document.createElement('td');
            td.innerText = data[key];
            tr.appendChild(td);
        }
    }

    // @Override
    handleRowCheckboxClick(ev) {
        if (ev.target.checked) {
            enableBtn(this.startBtn);
            const target = ev.target;
            const nodes = this.table.childNodes;
            const size = nodes.length;
            for (let i = 1; i < size; ++i) {
                const input = nodes[i].childNodes[0].childNodes[0]
                if (input === target) continue;
                input.checked = false;
            }
        } else {
            disableBtn(this.startBtn);
        }
    }

    // @Override
    handleStartBtn() {
        const nodes = this.table.childNodes;
        const size = nodes.length;
        let sessionToLoad = null;
        for (let i = 1; i < size; ++i) {
            if (nodes[i].childNodes[0].childNodes[0].checked) {
                sessionToLoad = STORAGE.sessions[i-1]; 
                break;
            }
        }
        // TODO save session to load in SESSION
        console.log(sessionToLoad);
        return true;
    }
}