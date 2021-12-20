import {Redirect} from "../Router/Router";
import Navbar from "../Navbar/Navbar";
import anime from "animejs";
import notificationModule from "../Modules/NotificationModule";
import load_user from "../../utils/load_user";

const registerDiv = `
        <div id="registerPage">
                <form id="registerForm" class="loginRegisterContainer">
                    <h3 class="loginText">Kwicker</h3>
                    <div id="errorRegister"></div>
                    <input class="inputForm fields" type="text" id="lastnameRegister" placeholder="Nom">
                    <input class="inputForm fields" type="text" id="forenameRegister" placeholder="Prénom">
                    <input class="inputForm fields" type="text" id="usernameRegister" placeholder="Nom d'utilisateur">
                    <input class="inputForm fields" type="email" id="emailRegister" placeholder="Adresse mail">
                    <input class="inputForm fields" type="password" id="passwordRegister" placeholder="Mot de passe">
                    <input class="inputForm fields" type="password" id="passwordConfirmationRegister" placeholder="Confirmez votre mot de passe">
                    <input class="inputForm submitButton" type="submit" value="S'inscrire" id="registerButton">
                    <a class="loginText" type="button" id="goToLogin">J'ai déjà un compte</a>
                </form>
        </div>
    `;


/**
 * Render the NewPage :
 * Just an example to demonstrate how to use the router to "redirect" to a new page
 */
function RegisterPage() {
    const pageDiv = document.querySelector("#page");
    pageDiv.innerHTML = registerDiv;
    // Créer d'abord l'élément dans le innerHTML puis le querySelector pour séléctionner
    // l'élément qui vient d'être créer
    const form = document.getElementById("registerForm");
    let goToLogin = document.getElementById("goToLogin");
    goToLogin.addEventListener("click", e => {
        e.preventDefault();
        Redirect("/login");
    });
    form.addEventListener("submit", register);

}

async function register(e) {
    e.preventDefault();
    const errorLogin = document.getElementById("errorRegister");
    const password = document.getElementById("passwordRegister").value;
    const passwordConfirmation = document.getElementById("passwordConfirmationRegister").value;
    errorLogin.innerHTML = "";
    let user;

    try {
        if (password !== passwordConfirmation) {
            errorLogin.innerHTML = notificationModule("alert-danger", "Passwords doesn't match");
            throw new Error("Passwords don't match");
        }
        user = {
            lastname: document.getElementById("lastnameRegister").value,
            forename: document.getElementById("forenameRegister").value,
            username: document.getElementById("usernameRegister").value,
            email: document.getElementById("emailRegister").value,
            password: password,
        }

        //Si erreur dans le formulaire alors fait trembler le formulaire en catchant l'exception lancée
        if (!user.lastname) {
            errorLogin.innerHTML = notificationModule("alert-danger", "Enter a lastname");
            return;
        } else if (!user.forename) {
            errorLogin.innerHTML = notificationModule("alert-danger", "Enter a forename");
            return;
        } else if (!user.username) {
            errorLogin.innerHTML = notificationModule("alert-danger", "Enter a username");
            return;
        } else if (!user.email) {
            errorLogin.innerHTML = notificationModule("alert-danger", "Enter a email");
            return;
        } else if (!user.password) {
            errorLogin.innerHTML = notificationModule("alert-danger", "Enter a password");
            return;
        }
    } catch (e) {
        console.error("LoginPage::error ", e);
        const xMax = 16;
        anime({
            targets: 'form',
            easing: 'easeInOutSine',
            duration: 550,
            translateX: [{value: xMax * -1,}, {value: xMax,}, {value: xMax / -2,}, {value: xMax / 2,}, {value: 0}],
            scale: [{value: 1.05}, {value: 1, delay: 250}],
        });
    }
    const requestRegister = {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        const responseRegister = await fetch("api/users/register", requestRegister);
        if (!responseRegister.ok) {
            errorLogin.innerHTML = notificationModule("alert-danger", "Register problem");
            throw new Error("fetch error : " + responseRegister.status + " : " + responseRegister.statusText);
        }

        const user = await responseRegister.json();
        window.localStorage.setItem("user", JSON.stringify(user));

        const requestMessage = {
            method: "POST",
            body: JSON.stringify({
                id_sender: 1,
                id_recipient: user.id_user,
                message: "Bonjour et bienvenue sur Kwicker, le réseau social qui garde votre vie privée!"
            }),
            headers: {
                Authorization: load_user.getToken(),
                "Content-Type": "application/json"
            }
        };
        const responseMessage = await fetch("/api/messages/", requestMessage);
        if (!responseMessage.ok) {
            errorLogin.innerHTML = notificationModule("alert-danger", "Register problem");
            throw new Error("fetch error : " + responseMessage.status + " : " + responseMessage.statusText);
        }
        Navbar();
        Redirect("/");
    } catch (e) {
        console.error("LoginPage::error ", e);
    }
}

export default RegisterPage;
