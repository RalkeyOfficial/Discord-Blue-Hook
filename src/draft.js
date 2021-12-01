import { displayNotification, prompt } from "./includes.js";
const fs = require('fs');

document.getElementById("add-draft-button").addEventListener("click", addDraft);

addEventListenersToDrafts();

const path = 'src/drafts/drafts.json';

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
    $('.delete-draft').click(deleteDraft);
    $('.use-draft').click(useDraft);

    function deleteDraft() {
        const draftName = $(this).parent().parent().find('h4').text();
        const object = $(this).parent().parent();

        prompt(`Are you sure you want to delete "${draftName}"?`, () => {
            object.remove();
            displayNotification(`"${draftName}" has been deleted.`);
        },
        () => {} );
    }

    function useDraft() {
        const draftName = $(this).parent().parent().find('h4').text();
        
        prompt(`Are you sure you want to use ${draftName}`, () => {

        },
        () => {});
    }
}

let itteration = 0;
function GenerateID() {
    let ID = '_' + Math.random().toString(36).substr(2);

    // check if ID already exists in drafts.json
    fs.readFile(path, 'utf8', (err, data) => {

        itteration++;
        if (itteration >= 3190187286) {
            displayNotification('you managed to get more than 3 billion drafts you absolute madlad!!');
            itteration = 0;
            return;
        }

        // if drafts.json doesn't exist, create it
        if (err) {
            fs.writeFile(path, '{}', (err) => {
                if (err) throw err;
            });
        };

        // if ID exists in drafts.json, generate new ID
        const drafts = JSON.parse(data);
        if (drafts[ID]) {
            ID = GenerateID();
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
            'webhook-url': $('#webhook').val(),
            'content': $('#content').val(),
            'embedEnabled': $('#add-embed').is(':checked'),
            'embed': {
                'author': {
                    'name': $('#username').val(),
                    'url': $('#user-url').val(),
                    'icon_url': $('#user-icon').val()
                },
                'title': $('#title').val(),
                'title_url': $('#titleUrl').val(),
                'description': $('#description').val(),
                'color': $('#color').val(),
                'thumbnail': {
                    'url': $('#thumbnailUrl').val()
                },
                'image': {
                    'url': $('#imageUrl').val()
                },
                'fields': fieldsArray,
                'footer': {
                    'text': $('#footerText').val(),
                    'icon_url': $('#footerIconUrl').val()
                },
                'timestamp': $('#timestamp').is(':checked')
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
