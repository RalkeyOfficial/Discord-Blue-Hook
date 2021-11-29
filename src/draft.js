import { displayNotification, prompt } from "./includes.js";

const addDraftButton = document.getElementById("add-draft-button").addEventListener("click", addDraft);

addEventListenerToDrafts();

function addDraft() {
    const button1 = $('<button></button>').addClass('use-draft green-button').text('Use');
    const button2 = $('<button></button>').addClass('delete-draft red-button').text('Delete');
    
    const div = $('<div></div>').addClass('flex-row').append(button1, button2);
    
    const draftName = $('#draft-name').val();
    const h4 = $('<h4></h4>').text(draftName);

    const draft_item = $('<div></div>').addClass('draft-item flex-col').css({'margin-top':'1em'}).append(h4, div);
    
    $('.drafts').first()[0].append(draft_item[0]);

    addEventListenerToDrafts();
}

function addEventListenerToDrafts() {
    $('.delete-draft').click(deleteDraft);
    $('.use-draft').click(useDraft);

    function deleteDraft() {
        const draftName = $(this).parent().parent().find('h4').text();
        const object = $(this).parent().parent();

        prompt(`Are you sure you want to delete "${draftName}"`, () => {
            object.remove();
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
