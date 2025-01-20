class Config {
    /*#homeURL = 'https://giannettagerardo.github.io/Athena';
    #surveyURL = 'https://giannettagerardo.github.io/Athena/survey.html';
    #dashboardURL = 'https://giannettagerardo.github.io/Athena/dashboard.html';*/
    #homeURL = 'http://127.0.0.1:5500';
    #surveyURL = 'http://127.0.0.1:5500/survey.html';
    #dashboardURL = 'http://127.0.0.1:5500/dashboard.html';

    get homeURL() { return this.#homeURL }
    get surveyURL() { return this.#surveyURL }
    get dashboardURL() { return this.#dashboardURL }
}

export const CONFIG = new Config();