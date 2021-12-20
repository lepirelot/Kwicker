import load_user from "../../utils/load_user";
import {Redirect} from "../Router/Router";

const UsersPage = async () => {
    const pageDiv = document.getElementById("page");
    pageDiv.innerHTML = "";

    const searchBar = document.querySelector("#navbarWrapper").getElementsByTagName("input")[0];
    searchBar.addEventListener("keyup", async () => {
        if (searchBar.value === "")
            return;
        const tab = await getAllUsersSimilarTo(searchBar.value.toLowerCase());
        pageDiv.innerHTML = `
                    <h3 id="resultSearchTitle">Résultats de recherche pour ${searchBar.value}</h3>
                    <ul id="userSearchResultList">
            `;
        if (tab) {
            tab.forEach((row) => {
                //onclick="location.href='/profile?idUser=${row.id_user}'"
                pageDiv.innerHTML += `
            <li onclick="location.href='/profile?idUser=${row.id_user}'" type="button" class="resultUserSearchWrapper" id="usersearchresult${row.id_user}">
                <a class="resultUserSearch">
                    <svg class="icon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-circle"  role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg>
                    ${row.forename} ${row.lastname} (${row.username})
                </a>
            </li>`;
            });
        }
        pageDiv.innerHTML += `
                    </ul>
            `;

        // for (let item of document.getElementsByClassName("resultUserSearchWrapper")) {
        //     item.addEventListener('click', function(e) {
        //         Redirect('/profile?idUser=' + item.id.replace("usersearchresult", ""));
        //     })
        // }
    });
}

async function getAllUsersSimilarTo(search) {
    try {
        const token = load_user.getToken();
        const request = {
            method: "GET",
            headers: {
                "Authorization": token
            }
        };
        const responseUserInfo = await fetch("/api/users/search/" + search, request);
        if (!responseUserInfo.ok) {
            return null;
        }
        return await responseUserInfo.json();
    } catch (e) {
        return null;
    }
}

export default UsersPage;