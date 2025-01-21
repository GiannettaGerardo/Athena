import { CONFIG } from './config.js';
import { STORAGE, SESSION } from './store.js';
import Stepper from './stepper.js'; 

const contextBtn = document.getElementById('context-btn');
const sessionIdInput = document.getElementById('session-id');
const creationInput = document.getElementById('creation-input');
const lastUpdateInput = document.getElementById('lastupdate-input');
let stepper;

initialize();

function setContextBtn() {
    contextBtn.innerText = STORAGE.contextId;
}

function initialize() {
    const surveys = SESSION.getSurveys();
    if (surveys?.length !== 0) {
        stepper = new Stepper(surveys);
        setContextBtn();
    } else {
        window.location.href = CONFIG.homeURL;
    }
}
