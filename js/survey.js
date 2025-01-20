import { CONFIG } from './config.js';
import { STORAGE, SESSION } from './store.js';

const contextBtn = document.getElementById('context-btn');
const sessionIdInput = document.getElementById('session-id');
const creationInput = document.getElementById('creation-input');
const lastUpdateInput = document.getElementById('lastupdate-input');

setContextBtn();

function setContextBtn() {
    contextBtn.innerText = STORAGE.contextId;
}
