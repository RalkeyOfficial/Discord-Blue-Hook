
export function displayNotification(text) {
    const notification = document.getElementById("notification");
    const notificationText = document.getElementById("notification-text");
    notificationText.innerText = text;
    notification.classList.remove("hidden");
    
    /*
        removeEventListener does not support callbacks, so i made a function and added the function to the event listener
        so i can effectively remove the event listener
    */
    notification.addEventListener("click", closeNotification);

    function closeNotification() {
        notification.classList.add("hidden");
        notification.removeEventListener("click", closeNotification);
    }
}

export function prompt(text, function1, function2) {
    const prompt = document.getElementById("prompt");
    const promptText = document.getElementById("prompt-text");

    const promptButtonYes = document.getElementById("prompt-button-yes");
    const promptButtonNo = document.getElementById("prompt-button-no");

    promptButtonYes.addEventListener("click", yesFunction);
    promptButtonNo.addEventListener("click", noFunction);

    promptText.innerText = text;
    prompt.classList.remove("hidden");

    function yesFunction() {
        prompt.classList.add("hidden");
        promptButtonYes.removeEventListener("click", yesFunction);
        promptButtonNo.removeEventListener("click", noFunction);
        function1();
    }
    function noFunction() {
        prompt.classList.add("hidden");
        promptButtonYes.removeEventListener("click", yesFunction);
        promptButtonNo.removeEventListener("click", noFunction);
        function2();   
    }
}
