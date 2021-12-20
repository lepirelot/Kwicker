import ApiModule from "./ApiModule";
import load_user from "../../utils/load_user";
var conversation;
/**
 * Create the message page
 * @param page
 */

let messagePageHtml = `
                <div class="messagePageContainer" >
            
            <div class="row" >
                <div class="col-md-2" id="userConvs" >
                    <ol class="contacts"> 
                    </ol>
                </div>
                <div class="col-md-9" id="openedConv">
                    <div class="headConv"><h3 class="senderHeadConv"></h3> </div>
                    <div class="messages"> 
                        <ol class="chat">
                        </ol>
                    </div>
                    <div class="containerInput">
                        <textarea id="textarea" type="text" placeholder="Write a message here" minlength="1"> </textarea>
                        <button class="submit-msg-btn">
                            <svg class="icon" id="sendMessageButton" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="paper-plane" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"></path></svg>
                        </button>   
                    </div>
                </div>
            </div>
        </div>
        `;


async function createMessagePage() {
    let page = document.querySelector("#page");
    let userId = load_user.loadUser().id_user;
    try {
        //Load all informations
        conversation = await ApiModule.getTheLatestConversation(userId);
        let user = await ApiModule.getBaseInformationsUser(userId);

        let recipient = await ApiModule.getBaseInformationsUser(conversation.id_recipient);
        let other = await ApiModule.getBaseInformationsUser(conversation.id_recipient);

        let sender = await ApiModule.getBaseInformationsUser(conversation.id_sender);

        //To determinate if the user is the sender or recipient
        if(userId === conversation.id_recipient) {
            var contacts = await ApiModule.getSender(recipient.id_user);
        }
        else
            var contacts = await ApiModule.getRecipients(sender.id_user);

        page.innerHTML = messagePageHtml;

        //Insert the username of sender into the html
        if(sender.id_user === user.id_user){
            document.querySelector(".senderHeadConv").innerHTML = recipient.username;
        } else {
            document.querySelector(".senderHeadConv").innerHTML = sender.username;
        }

        await loadInformations();
        //Periodic function to reload informations and content
        setInterval(async function (){
            let recipient = await ApiModule.getBaseInformationsUser(conversation.id_recipient);
            if(load_user.loadUser().id_user === recipient.id_user)
                contacts = await ApiModule.getSender(recipient.id_user);
            else
                contacts = await ApiModule.getRecipients(user.id_user);
            let messages = await ApiModule.getMessages(sender.id_user, recipient.id_user);

            await refreshMessages(user, messages)
            await refreshContactBar(contacts);
        },5000)

        //Create the send message feature
        createSendMessageFeature(user, other);
    } catch (e) {
        console.error(e);
    }
}

async function loadInformations() {
    let recipient = await ApiModule.getBaseInformationsUser(conversation.id_recipient);
    let sender = await ApiModule.getBaseInformationsUser(conversation.id_sender);
    let messages = await ApiModule.getMessages(sender.id_user, recipient.id_user);
    let user = await ApiModule.getBaseInformationsUser(load_user.loadUser().id_user);

    //To determinate if the user is the sender or recipient
    if(load_user.loadUser().id_user === conversation.id_recipient) {
        var contacts = await ApiModule.getSender(recipient.id_user);
    }
    else
        var contacts = await ApiModule.getRecipients(sender.id_user);
    //Show messages and contacts for the first time on reload
    await refreshMessages(user, messages)
    await refreshContactBar(contacts)
}

async function refreshMessages(user, messages) {
    let chats = document.querySelector(".chat");
    chats.innerHTML = await createMessagesHtml(user, messages);
}


async function createMessagesHtml(user, messages) {
    // Create the html for the messages
    let messagesHtml = "";
    for (let message of messages) {
        let date = new Date(message.date_creation);
        let dateString = `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()} at ${date.getUTCHours()}:`;
        dateString += `${date.getUTCMinutes()}`;

        if (message.id_sender === user.id_user) {
            messagesHtml += `<div align="right">
                                   <li class="other">
                                        <div align="left" class="msg">
                                            <p class="userName">${user.username}</p>`;
        } else {
            let other = await ApiModule.getSender(user.id_user);
            other = await ApiModule.getBaseInformationsUser(other[0].id_sender);
            messagesHtml += `<div align="left">
                                    <li class="self">
                                        <div align="left" class="msg">
                                            <p class="userName">${other.username}</p>`;
        }

        messagesHtml +=`
                    <p>${message.message}</p>
                    <p>${dateString}</p>
                </div>
            </li>
        </div>`
    }
    return messagesHtml;
}

/**
 * Create the contact bar on the left
 * @param contacts
 * @returns {Promise<string>}
 */
async function createContactBarHtml(contacts) {
    //Create contacts bar
    let contactHtml = "";
    for (let contact of contacts) {
        if(contact.id_sender)
            contact = await ApiModule.getBaseInformationsUser(contact.id_sender);
        else
            contact = await ApiModule.getBaseInformationsUser(contact.id_recipient);
        contactHtml += `
                <div class="contactLink" id=${contact.id_user}>
                    <li>
                        <a href="" class="userName">${contact.username}  </a>
                    </li>
                </div>`

    }
    return contactHtml;
}

/**
 * Refresh the contacts bar
 * @param contacts
 * @returns {Promise<void>}
 */
async function refreshContactBar(contacts) {
    let contactsHtml = document.querySelector(".contacts");
    contactsHtml.innerHTML = await createContactBarHtml(contacts);
    document.querySelectorAll(".contactLink").forEach((link) => {
        link.addEventListener("click", async (e) => {
            e.preventDefault();
            conversation = await ApiModule.getConversation(link.id);
            await loadInformations();
        });
    });

}

/**
 * Create the feature to send a message when clicking on send image
 */
function createSendMessageFeature (user , other) {
    let sendMessageButton = document.getElementById("sendMessageButton");
    sendMessageButton.addEventListener("click", async (e) => {
        let textArea = document.getElementById("textarea");
        let body = {
            id_sender: user.id_user,
            id_recipient: other.id_user,
            message: textArea.value
        };
        textArea.value = "";
        await ApiModule.sendMessage(body);
        let messages = await ApiModule.getMessages(user.id_user, other.id_user);
        await refreshMessages(user, messages);
    });
}

export default createMessagePage;
