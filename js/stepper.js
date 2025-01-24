export default class Stepper {
    #stepper;
    #currentIdx;
    #isStepCompleteCallback;
    #resolveClickCallback;

    constructor(elements, isStepCompleteCallback, resolveClickCallback) {
        this.#stepper = document.getElementById('stepper');
        if (! this.#stepper.classList.contains('progressBar')) {
            this.#stepper.setAttribute('class', 'progressBar');
        }
        this.#currentIdx = 0;
        this.#resolveClickCallback = resolveClickCallback;
        this.#isStepCompleteCallback = isStepCompleteCallback;

        const size = elements.length;
        for (let i = 0; i < size; ++i) {
            const li = document.createElement('li');
            li.innerText = elements[i];
            li.setAttribute('key', i);
            const isStepComplete = this.#isStepCompleteCallback(i);
            if (i === 0) {
                li.setAttribute('class', isStepComplete ? 'active complete' : 'active not-complete');
            }
            else {
                li.setAttribute('class', isStepComplete ? 'active complete' : 'not-complete');
            }
            li.addEventListener('click', (ev) => {this.#switchActive(ev.target)});
            this.#stepper.appendChild(li);
        }
    }

    #switchActive(target) {
        const targetKey = Number.parseInt(target.getAttribute('key'));
        // if click the same step that is already clicked
        if (targetKey === this.#currentIdx) return;
        
        const targetStepClass = target.getAttribute('class');
        const actualStep = this.#stepper.childNodes[this.#currentIdx];
        const actualStepClass = actualStep.getAttribute('class');
        actualStep.setAttribute('class', (actualStepClass === 'active complete') ? 'complete' : 'not-complete');
        target.setAttribute('class', (targetStepClass === 'complete') ? 'active complete' : 'active not-complete');
        this.#currentIdx = targetKey;

        this.#resolveClickCallback(this.#currentIdx);
    }
    
    handleStepCompletion(isStepComplete) {
        const actualStep = this.#stepper.childNodes[this.#currentIdx];
        actualStep.setAttribute('class', isStepComplete ? 'active complete' : 'active not-complete');
    }

    getCurrentIndex() {
        return this.#currentIdx;
    }
}