const svgInnerHtml = document.getElementsByClassName('minus-icon')[0].innerHTML;

// event listeners
const addFieldButton = document.getElementById("add-field").addEventListener("click", addFieldElement);
const addEmbedButton = document.getElementById("add-embed").addEventListener("click", toggleEmbedElement);

// default functions
addEventListeners();

function addFieldElement() {
    const fieldList = document.getElementById('field-list');
    const fieldElement = document.createElement('div');
    fieldElement.className = `field-element`;
    
    const fieldNameInput = document.createElement('input');
    fieldNameInput.placeholder = 'field name';
    fieldNameInput.id = 'field-name';
    fieldNameInput.name = 'field-name';
    fieldNameInput.type = 'text';
    
    const fieldValueInput = document.createElement('input');
    fieldValueInput.placeholder = 'field value';
    fieldValueInput.id = 'field-value';
    fieldValueInput.name = 'field-value';
    fieldValueInput.type = 'text';
    
    const fieldInlineinput = document.createElement('input');
    fieldInlineinput.name = 'field-inline';
    fieldInlineinput.id = 'field-inline';
    fieldInlineinput.type = 'checkbox';
    
    const label = document.createElement('label');
    label.for = 'field-inline';
    label.innerHTML = 'Inline on';

    const inlineAndLabelDiv = document.createElement('div');
    inlineAndLabelDiv.className = 'inline-and-label';
    inlineAndLabelDiv.appendChild(fieldInlineinput);
    inlineAndLabelDiv.appendChild(label);
    
    const SVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    SVG.classList = 'minus-icon';
    SVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    SVG.setAttribute('x', '0px');
    SVG.setAttribute('y', '0px');
    SVG.setAttribute('width', '24px');
    SVG.setAttribute('height', '24px');
    SVG.setAttribute('viewBox', '0 0 172 172');
    SVG.style = ' fill:#000000;';
    SVG.innerHTML = svgInnerHtml;

    fieldElement.appendChild(fieldNameInput);
    fieldElement.appendChild(fieldValueInput);
    fieldElement.appendChild(inlineAndLabelDiv);
    fieldElement.appendChild(SVG);
    
    fieldList.appendChild(fieldElement);

    addEventListeners();
}

function removeFieldElement(event) {
    let field = event.path
    field = field.filter(currentElement => {
        return currentElement.nodeName === 'svg';
    });
    field = field[0].parentElement;

    const fieldList = document.getElementById('field-list');
    fieldList.removeChild(field);
}

function getFieldElementsCount() {
    const fields = document.getElementsByClassName("field-element");
    if (!fields) return 0;

    return fields.length;
}

function addEventListeners() {
    const fields = document.getElementsByClassName("field-element");
    if (!fields) return;

    for (let field of fields) {
        field = [...field.childNodes];
        field = field.filter(currentElement => {
            return currentElement.nodeName === 'svg';
        });
        field[0].addEventListener("click", removeFieldElement);
    }
}

function toggleEmbedElement() {
    const embedField = document.getElementById('embed-element');
    const embedButton = document.getElementById('add-embed');

    embedField.classList.toggle('hidden');

    embedButton.getAttribute('data-status-boolean') === 'true' ? embedButton.setAttribute('data-status-boolean', 'false') : embedButton.setAttribute('data-status-boolean', 'true');
    if (embedButton.getAttribute('data-status-boolean') === 'true') {
        embedButton.innerHTML = 'Add embed';
    } else {
        embedButton.innerHTML = 'Remove embed';
    }
}
