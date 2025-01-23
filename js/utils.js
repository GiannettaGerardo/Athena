export function disableBtn(btn) {
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.cursor = 'auto';
}

export function enableBtn(btn) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
}

export function _C(elementName, innerText, classString) {
    const el = document.createElement(elementName);
    if (classString) {
        el.setAttribute('class', classString);
    }
    if (innerText) {
        el.innerText = innerText;
    }
    return el;
}