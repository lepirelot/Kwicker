import {Redirect} from "../Router/Router";
import load_user from "../../utils/load_user";

async function SendPost(e) {
    e.preventDefault();
    const message = document.getElementById("textPost").value;
    if (message.length === 0) return;

    const user = load_user.loadUser();
    const token = user.token;
    const idUser = user.id_user;

    const request = {
        method: "POST",
        body: JSON.stringify(
            {
                id_user: idUser,
                image: null,
                message: message,
                parent_post: null
            }
        ),
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        }
    };

    try {
        const response = await fetch("api/posts/", request);
        if (!response.ok) {
            throw new Error("fetch error : " + response.status + " : " + response.statusText);
        }

    } catch (e) {
        console.error("SendPost::error ", e);
    }
    Redirect(location.pathname);
}

function SendPostHTML(page) {
    page.innerHTML +=  `
            
            <div class="newPost">
                <form id="sendPost">
                    <input type="text" placeholder="Entrez un message" autocomplete="off" id="textPost">
                    <input type="submit" id="buttonPost" value="Post">
                </form>
            </div>
            <div class="container" id="tableTopKiwcks"></div> 
            `
    const form = document.getElementById("sendPost");
    //document.getElementById("sendPost").addEventListener("submit", SendPost);
    document.addEventListener("submit", SendPost);
}


export default SendPostHTML;