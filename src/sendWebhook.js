import { displayNotification } from "./includes.js";

document.getElementById("sendWebhook").addEventListener("click", sendWebhook);

async function sendWebhook(){
    const webhook = document.getElementById("webhook").value;
    const contentText = document.getElementById("content").value;
    const embedEnabled = document.getElementById("embed-element").classList.contains("hidden");

    let result = await checkWebhook(webhook);
    if (!result) {
        displayNotification("Webhook is not valid!");
        return;
    };

    let msg = {
        "content": contentText,
    }
    
    if (!embedEnabled) {
        const embed = generateEmbed();
        msg.embeds = [embed];
    }


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
        displayNotification("Internal server error! " + res.status);
    } else if (res.status === 400) {
        displayNotification("Invalid request! " + res.status);
    } else {
        displayNotification("Unknown error! error: " + res.status);
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
    if ($('.field-element') && $('.field-element').length > 0) {
        const fields = $('.field-element')

        const fieldEmbeds = [];
        fields.each(function() {
            const fieldName = $(this).find('#field-name').val().replace("", "\u200B");
            const fieldValue = $(this).find('#field-value').val().replace("", "\u200B");
            const fieldInline = $(this).find('#field-inline').is(':checked');
            const field = {
                name: fieldName,
                value: fieldValue,
                inline: fieldInline,
            };
            fieldEmbeds.push(field);
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
