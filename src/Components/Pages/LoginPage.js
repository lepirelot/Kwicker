import Navbar from "../Navbar/Navbar";
import {Redirect} from "../Router/Router";
import anime from "animejs";
import notificationModule from "../Modules/NotificationModule";

const loginDiv = `
        <div id="loginPage">
            <h1 style="color: red">This website is still in developpement, it's not secure for your privacy at this time.</h1>
            <div id="loginContainer">
                <form id="loginForm" class="loginRegisterContainer">
                    <h1 class="loginText">Kwicker</h1>
                    <div id="errorLogin"></div>
                    <input class="inputForm fields" type="text" id="usernameLogin" placeholder="Pseudo">
                    <input class="inputForm fields" type="password" id="passwordLogin" placeholder="Mot de passe">
                    <input class="inputForm submitButton" type="submit" value="Se connecter">
                    <a class="loginText" id="goToRegister" type="button">Je n'ai pas encore de compte</a>
                </form>
            </div>
        </div>
    `;

/**
 * Render the NewPage :
 * Just an example to demonstrate how to use the router to "redirect" to a new page
 */
function LoginPage() {
    const pageDiv = document.querySelector("#page");
    pageDiv.innerHTML = loginDiv;
    const form = document.getElementById("loginForm");
    form.addEventListener("submit", login);
    goToRegister.addEventListener("click", e => {
        e.preventDefault();
        Redirect("/register");
    });
}

async function login(e) {
    e.preventDefault();
    const username = document.getElementById("usernameLogin").value;
    const password = document.getElementById("passwordLogin").value;
    const errorLogin = document.getElementById("errorLogin");
    errorLogin.innerHTML = "";

    //Verify the user entered all informations to log in and show an error message if not
    console.log(notificationModule("alert-danger", "Enter a username"))
    try {
        if (!username) {
            errorLogin.innerHTML = notificationModule("alert-danger", "Enter a username");
            throw new Error("No username");
        } else if (!password) {
            errorLogin.innerHTML = notificationModule("alert-danger", "Enter a password");
            throw new Error("No password");
        }


        const request = {
            method: "POST",
            body: JSON.stringify(
                {
                    username: username,
                    password: password
                }
            ),
            headers: {
                "Content-Type": "application/json"
            }
        };
        const response = await fetch("api/users/login", request);
        if (!response.ok) {
            if (response.status === 403)
                errorLogin.innerHTML = notificationModule("alert-danger", "Wrong password");
            else if (response.status === 404)
                errorLogin.innerHTML = notificationModule("alert-danger", "Wrong username");
            else
                errorLogin.innerHTML = notificationModule("alert-danger", "Connection issue");
            throw new Error("fetch error : " + response.status + " : " + response.statusText);
        } else {
            errorLogin.innerHTML = "";
        }

        const user = await response.json();
        window.localStorage.setItem("user", JSON.stringify(user));
        Navbar();
        Redirect("/");
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
}

export default LoginPage;