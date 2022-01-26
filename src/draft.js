import { displayNotification, prompt } from "./includes.js";
const fs = require('fs');

document.getElementById("add-draft-button").addEventListener("click", addDraft);

const svgInnerHtml = document.getElementsByClassName('minus-icon')[0].innerHTML;
const path = 'src/drafts/drafts.json';

checkIfDraftsFileExists();

showAllDrafts();
addEventListenersToDrafts();


function checkIfDraftsFileExists() {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            fs.writeFile(path, '{}', (err) => {
                if (err) throw err;
            });
        }
    });
}

function addDraft() {
    const id = GenerateID();

    const button1 = $('<button></button>').addClass('use-draft green-button').text('Use');
    const button2 = $('<button></button>').addClass('delete-draft red-button').text('Delete');
    
    const div = $('<div></div>').addClass('flex-row').append(button1, button2);
    
    const draftName = $('#draft-name').val();
    const h4 = $('<h4></h4>').text(draftName === '' ? 'Draft' : draftName);

    const draft_item = $('<div></div>').addClass('draft-item flex-col').css({'margin-top':'1em'}).attr('id', id).append(h4, div);
    
    $('.drafts').first().append(draft_item);
    $('#draft-name').val('');

    saveDraftToJson(draftName, id);

    addEventListenersToDrafts();
}

function addEventListenersToDrafts() {
    $('.delete-draft').on("click", deleteDraft)
    $('.use-draft').on("click", useDraft);

    function deleteDraft() {
        const draftName = $(this).parent().parent().find('h4').text();
        const object = $(this).parent().parent();

        prompt(`Are you sure you want to delete "${draftName}"?`, () => {
            deleteDataInJson(object.attr('id'));
            object.remove();
            displayNotification(`"${draftName}" has been deleted.`);
        },
        () => {} );
    }

    function useDraft() {
        console.log('use draft');
        const draftName = $(this).parent().parent().find('h4').text();
        
        prompt(`Are you sure you want to use "${draftName}"?`, () => {
            loadDraft($(this));
            displayNotification(`"${draftName}" has been loaded.`);
        },
        () => {});
    }
}

let itteration = 0;
function GenerateID() {
    let ID = '_' + Math.random().toString(36).substr(2);

    // check if ID already exists in drafts.json
    fs.readFile(path, 'utf8', (err, data) => {

        if (err) throw err; 

        itteration++;
        if (itteration >= 3190187286) {
            displayNotification('you managed to get more than 3 billion drafts you absolute madlad!!');
            itteration = 0;
            return;
        }

        // if ID exists in drafts.json, generate new ID
        const drafts = JSON.parse(data);
        while (drafts[ID]) {
            ID = '_' + Math.random().toString(36).substr(2);
        }
    });

    return ID;
}

function saveDraftToJson(draftName, ID) {
    const fields = $('.field-element')

    // loop through the fields and put the fieldName, fieldValue and fieldInline into an object
    const fieldsArray = [];
    fields.each(function() {
        const fieldName = $(this).find('#field-name').val();
        const fieldValue = $(this).find('#field-value').val();
        const fieldInline = $(this).find('#field-inline').is(':checked');
        const field = {
            fieldName: fieldName,
            fieldValue: fieldValue,
            fieldInline: fieldInline,
        };
        fieldsArray.push(field);
    });

    const draft = {
        ID: ID,
        name: draftName,
        data: {
            webhook_url: $('#webhook').val(),
            content: $('#content').val(),
            embedEnabled: $('#add-embed').attr('data-status-boolean'),
            embed: {
                author: {
                    name: $('#username').val(),
                    url: $('#user-url').val(),
                    icon_url: $('#user-icon').val()
                },
                title: $('#title').val(),
                title_url: $('#titleUrl').val(),
                description: $('#description').val(),
                color: $('#color').val(),
                thumbnail: {
                    url: $('#thumbnailUrl').val()
                },
                image: {
                    url: $('#imageUrl').val()
                },
                fields: fieldsArray,
                footer: {
                    text: $('#footerText').val(),
                    icon_url: $('#footerIconUrl').val()
                },
                timestamp: $('#timestamp').is(':checked')
            }
        }
    };

    fs.readFile(path, 'utf8', (err, data) => {
        if (err) throw err;

        const drafts = JSON.parse(data);
        drafts[draft.ID] = draft;

        fs.writeFile(path, JSON.stringify(drafts), (err) => {
            if (err) throw err;
        });
    });
}

function deleteDataInJson(dataID) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) throw err;

        const drafts = JSON.parse(data);
        delete drafts[dataID];

        fs.writeFile(path, JSON.stringify(drafts), (err) => {
            if (err) throw err;
        });
    });
}

function showAllDrafts() {
    // show all the drafts from the json file
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) throw err;

        const drafts = JSON.parse(data);
        for (const draft in drafts) {
            const draftName = drafts[draft].name;
            const id = drafts[draft].ID;

            const button1 = $('<button></button>').addClass('use-draft green-button').text('Use');
            const button2 = $('<button></button>').addClass('delete-draft red-button').text('Delete');
            
            const div = $('<div></div>').addClass('flex-row').append(button1, button2);
            
            const h4 = $('<h4></h4>').text(draftName === '' ? 'Draft' : draftName);

            const draft_item = $('<div></div>').addClass('draft-item flex-col').css({'margin-top':'1em'}).attr('id', id).append(h4, div);
            
            $('.drafts').first().append(draft_item);
        }

        addEventListenersToDrafts();
    });

}

function loadDraft(object) {
    const draftID = object.parent().parent().attr('id');
    let draftData;

    console.log("id: " + draftID);

    fs.readFile(path, 'utf8', (err, data) => {
        if (err) throw err;

        draftData = JSON.parse(data)[draftID].data;

        console.log(draftData);


        $('#webhook').val(draftData.webhook_url);
        $('#content').val(draftData.content);

        $('#add-embed').attr('data-status-boolean', draftData.embedEnabled);
        if (draftData.embedEnabled !== true) {
            $('#add-embed').text('Add Embed');
        } else {
            $('#add-embed').text('Remove Embed');
        }

        $('#username').val(draftData.embed.author.name);
        $('#user-url').val(draftData.embed.author.url);
        $('#user-icon').val(draftData.embed.author.icon_url);

        $('#title').val(draftData.embed.title);
        $('#titleUrl').val(draftData.embed.title_url);

        $('#description').val(draftData.embed.description);
        $('#color').val(draftData.embed.color);

        $('#thumbnailUrl').val(draftData.embed.thumbnail.url);
        $('#imageUrl').val(draftData.embed.image.url);

        $('#footerText').val(draftData.embed.footer.text);
        $('#footerIconUrl').val(draftData.embed.footer.icon_url);

        $('#timestamp')[0].checked = draftData.embed.timestamp;

        removeAllFieldElement();
        for(const fieldData of draftData.embed.fields) {
            const name = fieldData.fieldName;
            const value = fieldData.fieldValue;
            const inline = fieldData.fieldInline;

            addFieldElements(name, value, inline);
        }

    });
}



function removeAllFieldElement() {
    $('.field-element').remove();
}

function addFieldElements(name, value, inline) {
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

    // set proper data into the field
    fieldNameInput.value = name;
    fieldValueInput.value = value;
    if (inline === true) fieldInlineinput.checked = true;
    else fieldInlineinput.checked = false;

    fieldElement.appendChild(fieldNameInput);
    fieldElement.appendChild(fieldValueInput);
    fieldElement.appendChild(inlineAndLabelDiv);
    fieldElement.appendChild(SVG);
    
    fieldList.appendChild(fieldElement);

    addEventListenersToFields();
}

function addEventListenersToFields() {
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

function removeFieldElement(event) {
    let field = event.path
    field = field.filter(currentElement => {
        return currentElement.nodeName === 'svg';
    });
    field = field[0].parentElement;

    const fieldList = document.getElementById('field-list');
    fieldList.removeChild(field);
}
