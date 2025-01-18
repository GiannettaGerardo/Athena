
class Storage {
    constructor() {
        this.contextId = localStorage.getItem('contextId');
        this.sessions = JSON.parse(localStorage.getItem('sessions'));
        this.surveys = JSON.parse(localStorage.getItem('surveys'));
    }

    init(stringData) {
        if (!stringData) return false;
        const objData = JSON.parse(stringData);
        if (this.#isValid(objData)) {
            this.contextId = objData.contextId;
            this.sessions = objData.sessions;
            this.surveys = objData.surveys;
            this.saveState();
            return true;
        }
        return false;
    }

    #isValid(data) {
        if (!data?.contextId) {
            return false;
        }

        if (data.sessions && !Array.isArray(data.sessions)) {
            return false;
        }

        return !data.surveys || Array.isArray(data.surveys);
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

export const SESSION = {
    id: '',
    surveys: [],
    status: '',
    creation: '',
    lastUpdate: ''
};

export const STORAGE = new Storage();