import {Redirect} from "../Components/Router/Router";

function loadUser () {
    return JSON.parse(window.localStorage.getItem("user"));
}

function getToken() {
    return loadUser().token;
}

function loadProfile(item) {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        Redirect('/profile?idUser=' + item.id.replace("postusersender", ""));
    });
}

export default {loadUser, getToken, loadProfile};