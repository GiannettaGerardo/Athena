class Config {
    #homeURL = '/';
    #surveyURL = '/survey.html';
    #dashboardURL = '/dashboard.html';

    get homeURL() { return this.#homeURL }
    get surveyURL() { return this.#surveyURL }
    get dashboardURL() { return this.#dashboardURL }
}

export const CONFIG = new Config();