import ApiModule from "./ApiModule";
import load_user from "../../utils/load_user";

let interval;
let id_contact;
let conversations;
let search;

let messagePageHtml = `
    <div class="messagePageContainer" >    
        <div class="row" >
            <div class="col-md-2" id="userConvs" >
                <ol class="contacts">
                </ol>
            </div>
            <div class="col-md-9" id="openedConv">
                <div class="headConv">
                    <h3 class="senderHeadConv">Sélectionne un contact pour afficher la conversation</h3>
                </div>
                <div class="messages"> 
                    <ol class="chat">
                    </ol>
                </div>
            </div>
        </div>
    </div>
`;

async function createMessagePage() {
    const page = document.querySelector("#page");
    conversations = await ApiModule.getConversations(load_user.loadUser().id_user);
    if (!conversations)
        page.innerHTML = "<h1>Pas de conversations</h1>";
    else
        page.innerHTML = messagePageHtml;
    search = window.location.search;
    await createContactsBar();
    if(search){
        findId(search)
        const contact = await ApiModule.getBaseInformationsUser(id_contact);
        await initializeConversation(contact.username);
    }
}

function findId(str){
    id_contact = "";
    for(let i = str.length-1; i > -1; i--){
        if(str.charAt(i) === "=")
            break;
        if(!id_contact)
            id_contact = str.charAt(i);
        else
            id_contact += str.charAt(i);
    }
    if(id_contact.length > 1)
        id_contact = id_contact.split("").reverse().join("");
}

async function initializeConversation(username) {
    showSelectedConversation(id_contact, username);
    await showMessages();
    const sendMessageButton = document.getElementById("sendMessageButton");
    sendMessageButton.addEventListener("click", createSendMessageFeature);
}

/**
 * Create the contact bar on the left
 * @returns {Promise<string>}
 */
async function createContactsBar() {
    //Create contacts bar
    let contactsBar = document.querySelector(".contacts");
    if (Object.keys(conversations).length === 1) {
        await showContactsInContactBar(conversations[0], contactsBar);
    }
    else
        for (let conversation of conversations) {
            await showContactsInContactBar(conversation, contactsBar);
        }
    const contacts = document.querySelectorAll(".contactLink");
    for (let contact of contacts)
        contact.addEventListener("click", async (e) => {
            e.preventDefault();
            id_contact = contact.id;
            await initializeConversation(contact.innerText);
        });
}

async function showContactsInContactBar(conversation, contactsBar) {
    if(conversation.id_sender === load_user.loadUser().id_user &&
        !verifyContactsBarContains(conversation.id_recipient)
    )
        contactsBar.innerHTML += await getContactBarHtml(conversation.id_recipient);
    else if(conversation.id_recipient === load_user.loadUser().id_user &&
        !verifyContactsBarContains(conversation.id_sender)
    )
        contactsBar.innerHTML += await getContactBarHtml(conversation.id_sender);
}

function verifyContactsBarContains(id_contact) {
    const contacts = document.querySelectorAll(".contactLink");
    for(let contact of contacts)
        if (contact.id == id_contact)
            return true;
    return false;
}

async function getContactBarHtml(idUser) {
    const contact = await ApiModule.getBaseInformationsUser(idUser);
    return `
            <div class="contactLink" id=${contact.id_user}>
                <li>
                    <a href="" id="userName">${contact.username}</a>
                </li>
            </div>`;
}

async function showMessages(){
    if(interval)
        clearInterval(interval);
    const messages = await ApiModule.getMessages(load_user.loadUser().id_user, id_contact);
    if(messages) {
        let chats = document.querySelector(".chat");
        chats.innerHTML = await createMessagesHtml(messages);
        const messagesHTML = document.querySelector(".messages");
        messagesHTML.scrollTop = messagesHTML.scrollHeight;
    }
    interval = setInterval(showMessages, 5000);
}

async function createMessagesHtml(messages) {
    // Create the html for the messages
    let messagesHtml = "";
    for (let message of messages) {
        let date = new Date(message.date_creation);
        let dateString = `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()} at ${date.getUTCHours()}:`;
        dateString += `${date.getUTCMinutes()}`;

        if (message.id_sender === load_user.loadUser().id_user) {
            messagesHtml += `<div align="right">
                                   <li class="other">
                                        <div align="left" class="msg">
                                            <h3 class="userName">Moi</h3>`;
        } else {
            let otherUsername = document.querySelector(".senderHeadConv").innerText;
            messagesHtml += `<div align="left">
                                    <li class="self">
                                        <div align="left" class="msg">
                                            <h3 class="userName">${otherUsername}</h3>`;
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
 * Show the selected user to the top center
 * @param id_user
 * @param username
 */
function showSelectedConversation(id_user, username) {
    const senderHeadConv = document.querySelector(".senderHeadConv");
    senderHeadConv.id = id_user;
    senderHeadConv.innerText = username;
    if(!document.querySelector(".containerInput"))
        showSendMessageForm();
}

function showSendMessageForm() {
    document.getElementById("openedConv")
        .innerHTML +=`
            <div class="containerInput">
                <textarea id="textarea" type="text" placeholder="Write a message here" minlength="1"> </textarea>
                <button class="submit-msg-btn">
                    <svg class="icon" id="sendMessageButton" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="paper-plane" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"></path></svg>
                </button>   
            </div>
    `;
}

/**
 * Create the feature to send a message when clicking on send image
 */
async function createSendMessageFeature (e) {
    e.preventDefault();
    let textArea = document.getElementById("textarea");
    let body = {
        id_sender: load_user.loadUser().id_user,
        id_recipient: id_contact,
        message: textArea.value
    };
    textArea.value = "";
    await ApiModule.sendMessage(body);
    await showMessages();
}

export default createMessagePage;