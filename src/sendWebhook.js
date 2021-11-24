
function getFieldElements() {
    let embedFields = [];

    const fields = document.getElementsByClassName("field-element");
    if (!fields) return;

    for (let field of fields) {
        field = [...field.childNodes];
        field = field.filter(currentElement => {
            // returns true if element is NOT in array
            const arrayOfTextNodes = ["#text", "BR", "BUTTON", "LABEL", "svg"];
            return !arrayOfTextNodes.includes(currentElement.nodeName);
            // remove "!" so it returns true if it's in the array
        });

        let field_name = field[0].value;
        let field_value = field[1].value;

        // turn nodeList into array and filter it
        field[2] = [...field[2].childNodes];
        field[2] = field[2].filter(currentElement => {
            // returns true if element is NOT in array
            const arrayOfTextNodes = ["INPUT"];
            return arrayOfTextNodes.includes(currentElement.nodeName);
            // remove "!" so it returns true if it's in the array
        });
        let inline = field[2][0].checked;

        embedFields.push({ name: field_name, value: field_value, inline: inline });
        
    }

    return embedFields;
}

document.getElementById("sendWebhook").addEventListener("click", sendWebhook);

async function sendWebhook(){
    const webhook = document.getElementById("webhook").value;
    const contentText = document.getElementById("content").value;
    const embedEnabled = document.getElementById("embed-element").classList.contains("hidden");

    let result = await checkWebhook(webhook);
    if (!result) {
        alert("Webhook is not valid!");
        return;
    };

    let msg = {
        "content": contentText,
    }
    
    if (!embedEnabled) {
        const embed = generateEmbed();
        msg.embeds = [embed];
    }

    console.log(msg);

    let res = await fetch(webhook, {
        "method":"POST",
        "headers": {
            "content-Type": "application/json"
        },
        "body": JSON.stringify(msg) 
    });

    if (res.status === 204) {
        displayNotification("Webhook sent!");
    } else if (res.status === 429) {
        displayNotification("Too many requests! " + res.status);
    } else if (res.status === 500) {
        displayNotification("Internal server error!" + res.status);
    } else if (res.status === 400) {
        displayNotification("Invalid request!" + res.status);
    } else {
        displayNotification("Unknown error! error:" + res.status);
    }
}

function checkWebhook(webhookUrl) {
    return new Promise(resolve => {
        const urlRegex = /https:\/\/discord.com\/api\/webhooks\/[0-9]+\/[0-9a-zA-Z._.-]+/
        if (!urlRegex.test(webhookUrl)) resolve(false);

        const request = new XMLHttpRequest();
        request.open("GET", webhookUrl);

        request.onload = function() {
            if (request.status === 200) {
                resolve(true);
            } else {
                resolve(false);
            }
        }

        request.send();
    });
    
}

function generateEmbed() {
    const username = document.getElementById("username").value;
    const user_url = document.getElementById("user-url").value;
    const user_icon = document.getElementById("user-icon").value;

    const title = document.getElementById("title").value;
    const titleUrl = document.getElementById("titleUrl").value;
    const description = document.getElementById("description").value;
    const color = document.getElementById("color").value;

    const thumbnailUrl = document.getElementById("thumbnailUrl").value;
    const imageUrl = document.getElementById("imageUrl").value;

    const footerText = document.getElementById("footerText").value;
    const footerIconUrl = document.getElementById("footerIconUrl").value;

    const timeStamp = document.getElementById("timestamp").checked;

    // all fields needed
    // ---------------------------------------------//

    const embed = {}
    
    if (color) embed.color = parseInt(color, 16);

    if (title) embed.title = title;
    if (titleUrl && title) embed.url = titleUrl;
    if (description) embed.description = description;
    
    if (username) embed.author = {
        name: username,
        url: user_url,
        icon_url: user_icon
    }

    if (thumbnailUrl) embed.thumbnail = { url: thumbnailUrl };

    // get fields and put it into an array which will then be put in the embed
    const fields = getFieldElements();
    if (fields) {
        let fieldEmbeds = [];
        fields.forEach(field => {
            // if both fields are empty skip this itteration
            if (!field.name && !field.value) return;

            fieldEmbeds.push({
                name: field.name.replace("", "\u200B"),
                value: field.value.replace("", "\u200B"),
                inline: field.inline
            });

        });
        embed.fields = fieldEmbeds;
    }

    if (imageUrl) embed.image = { url: imageUrl };
    
    if (timeStamp) embed.timestamp = new Date();

    if (footerText) embed.footer = { 
        text: footerText,
        icon_url: footerIconUrl
    };

    return embed;
}

// a function to display a notification with custom text for 1 seconds and then remove it
function displayNotification(text) {
    const notification = document.getElementsByClassName("notification")[0];
    const notificationText = document.getElementsByClassName("notification-text")[0];
    notificationText.innerText = text;
    notification.classList.remove("hidden");
    setTimeout(() => {
        notification.classList.add("hidden");
    }, 1000);
}
