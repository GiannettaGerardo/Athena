
class Storage {
    constructor() {
        this.contextId = localStorage.getItem('contextId');
        this.sessions = JSON.parse(localStorage.getItem('sessions'));
        this.surveys = JSON.parse(localStorage.getItem('surveys'));
    }

    saveState() {
        if (this.contextId) {
            localStorage.setItem('contextId', this.contextId);
        } else {
            localStorage.removeItem('contextId');
        }
        if (this.sessions) {
            localStorage.setItem('sessions', JSON.stringify(this.sessions));
        } else {
            localStorage.removeItem('sessions');
        }
        if (this.surveys) {
            localStorage.setItem('surveys', JSON.stringify(this.surveys));
        } else {
            localStorage.removeItem('surveys');
        }
    }
}

export const STORAGE = new Storage();