import load_user from "../../utils/load_user";
import notificationModule from "../Modules/NotificationModule";

const SettingsPage = async () => {

    // Init
    const pageDiv = document.querySelector("#page");
    pageDiv.innerHTML = ``;

    // Get base user informations
    const actualUser = load_user.loadUser();
    const user = await getBaseInformationsUser(actualUser.id_user);
    let biography = user.biography;
    if (biography === null) {
        biography = "";
    }
    pageDiv.innerHTML += `
            <div class="mainContent" id="contentProfilePage">
                <div id="">
                    <div id="banner">
                        <p style="text-align: center; font-size: 30px; color: #cdc7e2;">Settings</p>
                        <div id="errorSettings"></div>
                    </div>
                    <div id="userContainer">
                    <form>
                      <div class="row">
                        <div class="col">
                          <label for="fornamechange">Firstname</label>
                          <input type="text" id="fornamechange" class="form-control change-form" value="${user.forename}">
                        </div>
                        <div class="col">
                          <label for="fornamechange">Lastname</label>
                          <input type="text" id="lastnamechange" class="form-control change-form" value="${user.lastname}">
                        </div>
                      </div>
                      <div class="row">
                        <div class="col">
                            <label for="fornamechange">Biography</label>
                            <textarea placeholder="Your biography" maxlength="300" id="biographychangeform" type="form-control" rows="3" class="form-control change-form">${biography}</textarea>
                        </div>
                      </div>
                      <div class="text-center">
                        <button id="submitChangeModify" type="submit" class="btn btn-primary mb-3 mt-5" id="tablePost" >Confirm changes</button>
                      </div>
                    </form>
                    </div>
                </div>
                <div class="container" id="tablePost"></div>
            </div>
        `;

    document.getElementById("submitChangeModify").addEventListener("click", function(e) {
        e.preventDefault()
        const lastname = document.getElementById("lastnamechange");
        const forename = document.getElementById("fornamechange");
        const biography = document.getElementById("biographychangeform");
        const errorSettings = document.getElementById("errorSettings");
        errorSettings.innerHTML = "";

        let error = true;

        if (lastname.value !== user.lastname) {
            putLastName(lastname.value, actualUser.id_user);
            error = false;
        }

        if (forename.value !== user.forename) {
            putForeName(forename.value, actualUser.id_user);
            error = false;
        }

        let bio = biography.value;
        if (bio === "") bio = null;
        if (bio !== user.biography) {
            putBiography(biography.value, actualUser.id_user);
            user.biography = bio;
            error = false;
        }
        if (error) {
            errorSettings.innerHTML = notificationModule("alert-danger mb-0", "You have to change an element")
        } else {
            errorSettings.innerHTML = notificationModule("alert-primary mb-0", "Modification taken into account")
        }
    });
}


async function getBaseInformationsUser(idUser) {
    try {
        const token = load_user.getToken();
        const request = {
            method: "GET",
            headers: {
                "Authorization": token
            }
        };
        const responseUserInfo = await fetch("/api/users/profile/" + idUser, request);
        if (!responseUserInfo.ok) {
            throw new Error(
                "fetch error : " + responseUserInfo.status + " : " + responseUserInfo.statusText
            );
        }
        return await responseUserInfo.json();
    } catch (e) {
        console.log(e)
    }
}

async function putLastName(lastname, idUser) {
    try {
        const token = load_user.getToken();
        const request = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(
                {
                    lastname: lastname,
                }
            ),
        };
        const responseUserInfo = await fetch("/api/users/lastname/" + idUser, request);
        if (!responseUserInfo.ok) {
            throw new Error(
                "fetch error : " + responseUserInfo.status + " : " + responseUserInfo.statusText
            );
        }
        return await responseUserInfo.json();
    } catch (e) {
        console.log(e)
    }
}

async function putForeName(forename, idUser) {
    try {
        const token = load_user.getToken();
        const request = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(
                {
                    forename: forename,
                }
            ),
        };
        const responseUserInfo = await fetch("/api/users/forename/" + idUser, request);
        if (!responseUserInfo.ok) {
            throw new Error(
                "fetch error : " + responseUserInfo.status + " : " + responseUserInfo.statusText
            );
        }
        return await responseUserInfo.json();
    } catch (e) {
        console.log(e)
    }
}

async function putBiography(biography, idUser) {
    try {
        const token = load_user.getToken();
        const request = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(
                {
                    biography: biography,
                }
            ),
        };
        const responseUserInfo = await fetch("/api/users/biography/" + idUser, request);
        if (!responseUserInfo.ok) {
            throw new Error(
                "fetch error : " + responseUserInfo.status + " : " + responseUserInfo.statusText
            );
        }
        return await responseUserInfo.json();
    } catch (e) {
        console.log(e)
    }
}

export default SettingsPage;