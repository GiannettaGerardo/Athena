
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

class Session {
    #id;
    #surveys;
    #status;
    #creation;
    #lastUpdate;

    constructor() {
        const surveys = JSON.parse(sessionStorage.getItem('surveys'));

        this.#id = sessionStorage.getItem('id');
        this.#surveys = (surveys && Array.isArray(surveys)) ? surveys : new Array();
        this.#status = sessionStorage.getItem('status');
        this.#creation = sessionStorage.getItem('creation');
        this.#lastUpdate = sessionStorage.getItem('lastUpdate');
    }

    getId() { return this.#id }
    getSurveys() { return this.#surveys }
    getStatus() { return this.#status }
    getCreation() { return this.#creation }
    getLastUpdate() { return this.#lastUpdate }

    setId(id) {
        this.#id = id;
        sessionStorage.setItem('id', id);
    }

    setSurveys(surveys) {
        this.#surveys = surveys;
        sessionStorage.setItem('surveys', JSON.stringify(surveys));
    }

    setStatus(status) {
        this.#status = status;
        sessionStorage.setItem('status', status);
    }

    setCreation(creation) {
        this.#creation = creation;
        sessionStorage.setItem('creation', creation);
    }

    setLastUpdate(lastUpdate) {
        this.#lastUpdate = lastUpdate;
        sessionStorage.setItem('lastUpdate', lastUpdate);
    }
}

export const STORAGE = new Storage();
export const SESSION = new Session();