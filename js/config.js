class Config {
    #homeURL = 'https://giannettagerardo.github.io/Athena';
    #surveyURL = 'https://giannettagerardo.github.io/Athena/survey.html';
    #dashboardURL = 'https://giannettagerardo.github.io/Athena/dashboard.html';

    get homeURL() { return this.#homeURL }
    get surveyURL() { return this.#surveyURL }
    get dashboardURL() { return this.#dashboardURL }
}

export const CONFIG = new Config();