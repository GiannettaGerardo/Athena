export default class Stepper {
    #stepper;
    #currentIdx;

    constructor(elements, resolveClickCallback) {
        this.#stepper = document.getElementById('stepper');
        if (! this.#stepper.classList.contains('progressBar')) {
            this.#stepper.setAttribute('class', 'progressBar');
        }
        this.#currentIdx = 0;

        let first = true;
        for (const element of elements) {
            const li = document.createElement('li');
            li.innerText = element;
            if (first) {
                li.setAttribute('class', 'active not-complete');
                first = false;
            }
            else {
                li.setAttribute('class', 'not-complete');
            }
            li.addEventListener('click', (ev) => {this.#switchActive(ev.target, resolveClickCallback)});
            this.#stepper.appendChild(li);
        }
    }

    #switchActive(target, resolveClickCallback) {
        const nodes = this.#stepper.childNodes;
        const size = nodes.length;
        // if click the same step that is already clicked
        if (this.#isTargetAlreadyActive(nodes, target)) return;
        for (let i = 0; i < size; ++i) {
            if (nodes[i] === target) {
                nodes[i].setAttribute('class', 'active not-complete');
                this.#currentIdx = i;
                continue;
            }
            nodes[i].setAttribute('class', 'not-complete');
        }
        resolveClickCallback(this.#currentIdx);
    }

    #isTargetAlreadyActive(nodes, target) {
        const size = nodes.length;
        for (let i = 0; i < size; ++i) {
            if (nodes[i] === target) {
                return i === this.#currentIdx;
            }
        }
        return false;
    }
    
    next() {
        const nodes = this.#stepper.childNodes;
        if (this.#currentIdx >= nodes.length) {
            return false;
        }
        nodes[this.#currentIdx++].setAttribute('class', 'active');
        if (this.#currentIdx < nodes.length) {
            nodes[this.#currentIdx].setAttribute('class', 'not-complete');
        }
        return true;
    }

    getCurrentIndex() {
        return this.#currentIdx;
    }
}