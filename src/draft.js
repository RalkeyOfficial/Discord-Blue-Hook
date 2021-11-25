import { displayNotification } from "./includes.js";

const addDraftButton = document.getElementById("add-draft-button").addEventListener("click", addDraft);

function addDraft() {
    const draft = document.getElementById("draft");
    const draftText = document.getElementById("draft-text");
    const draftList = document.getElementById("draft-list");
    const draftListItem = document.createElement("li");
    const draftListItemText = document.createElement("span");
    const draftListItemDelete = document.createElement("button");
    const draftListItemEdit = document.createElement("button");

    draftListItemText.innerText = draftText.value;
    draftListItemDelete.innerText = "Delete";
    draftListItemEdit.innerText = "Edit";

    draftListItemDelete.addEventListener("click", deleteDraft);
    draftListItemEdit.addEventListener("click", editDraft);

    draftListItem.appendChild(draftListItemText);
    draftListItem.appendChild(draftListItemDelete);
    draftListItem.appendChild(draftListItemEdit);
    draftList.appendChild(draftListItem);

    draftText.value = "";

    function deleteDraft() {
        draftListItem.remove();
    }

    function editDraft() {
        const draftListItemText = draftListItem.getElementsByTagName("span")[0];
        const draftListItemEdit = draftListItem.getElementsByTagName("button")[1];
        const draftListItemSave = document.createElement("button");

        draftListItemSave.innerText = "Save";
        draftListItemSave.addEventListener("click", saveDraft);

        draftListItem.removeChild(draftListItemEdit);
        draftListItem.removeChild(draftListItemSave);
        draftListItem.appendChild(draftListItemSave);

        function saveDraft() {
            draftListItemText.innerText = draftText.value;
            draftListItem.removeChild(draftListItemSave);
            draftListItem.appendChild(draftListItemEdit);
        }
    }
}
