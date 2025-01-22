export class SurveyContext {
    id;
    answers;
    comments;
    
    constructor(survey) {
        this.id = survey.id;
        const categories = survey.categories;
        const cSize = categories.length;
        this.answers = new Array(cSize);
        this.comments = new Array(cSize);
        for (let i = 0; i < cSize; ++i) {
            const questions = categories[i].questions;
            this.answers[i] = new Array(questions.length).fill(-1);
            this.comments[i] = new Array(questions.length).fill('');
        }
    }

}