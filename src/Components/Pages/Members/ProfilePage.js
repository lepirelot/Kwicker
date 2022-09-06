import GetPostsModule from "../../Modules/GetPostsModule";
import load_user from "../../../utils/load_user";
import {Redirect} from "../../Router/Router";

const ProfilePage = async () => {
    if (!location.search.startsWith("?idUser=")) location.pathname = "/";

    // Init
    const pageDiv = document.querySelector("#page");
    pageDiv.innerHTML = ``;

    // Get base user informations
    const idCurrentUser = new URLSearchParams(window.location.search).get("idUser");
    const user = await getBaseInformationsUser(idCurrentUser);
    const userConnected = load_user.loadUser();

    let biographyDisplay = user.biography;
    if (!user.biography) biographyDisplay = "";

    pageDiv.innerHTML += `
            <div class="mainContent" id="contentProfilePage">
                <div>
                    <div id="banner"><!-- Camera icon-->
                        <div id="camera_icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" class="bi bi-camera" viewBox="0 0 16 16">
                                <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"/>
                                <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                            </svg>
                        </div>
                    </div>
                    <div id="userContainer">
                        <div class="col-sm-10" id="userName">${user.forename} ${user.lastname} 
                            <div id="followSign"></div>
                            <div type="button" id="followButton"></div>
                            <div type="button" id="sendMessageButton">Envoyer un message</div>
                        </div>
                        <div class="col-sm-10" id="biography">Biography : ${biographyDisplay}</div>
                        <div class="col-sm-10" id="creationDate">Created his account on ${new Date(user.date_creation).toDateString()}</div>
                        <div id="sendMessageDiv"></div>
                    </div>
                </div>
                <div class="container" id="tablePost"></div>
            </div>
        `;
    if (biographyDisplay === "") document.getElementById("biography").hidden = true;


    const followSign = document.getElementById("followSign");
    const followButton = document.getElementById("followButton");
    const sendMessageButton = document.getElementById("sendMessageButton");
    sendMessageButton.hidden = true;
    // Add follow button if other profile
    if (user.id_user !== userConnected.id_user) {
        sendMessageButton.hidden = false;
        followSign.hidden = true;
        if ((await existFollow(userConnected.id_user, idCurrentUser, userConnected.token)).status === 201) {
            followSign.hidden = false;
            followSign.innerHTML += "vous suit";
        } else {
            followSign.hidden = true;
        }

        if ((await existFollow(idCurrentUser, userConnected.id_user, userConnected.token)).status === 201) {
            followButton.innerHTML = "Suivi";
        } else {
            followButton.innerHTML = "Suivre";
        }

        //
        document.addEventListener("click", async function (e) {
            if (e.target.id === "followButton") {
                const responseFollow = await toggleFollowUser(idCurrentUser, userConnected);
                if (responseFollow.status === 201) {
                    e.target.innerHTML = "Suivi"
                } else if (responseFollow.status === 200) {
                    e.target.innerHTML = "Suivre"
                }
            } else if (e.target.id === "sendMessageButton") {
                Redirect('/messages?User='+ idCurrentUser);
            }
        });
    } else {
        followButton.hidden = true;
        followSign.hidden = true;
    }

    // Get posts sorted by date
    await GetPostsModule(pageDiv, idCurrentUser);
}

async function existFollow(idUserFollowed, idUserFollower, token) {
    try {
        const request = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(
                {
                    id_user_followed: idUserFollowed,
                    id_user_follower: idUserFollower
                }
            ),
        };
        const responseFollowInfo = await fetch("/api/follows/exists", request);
        if (!responseFollowInfo.ok) {
            throw new Error(
                "fetch error : " + responseFollowInfo.status + " : " + responseFollowInfo.statusText
            );
        }
        return await responseFollowInfo;
    } catch (e) {
        console.log(e)
    }
}

async function toggleFollowUser(idUserFollowed, userFollower) {
    try {
        const request = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": userFollower.token
            },
            body: JSON.stringify(
                {
                    id_user_followed: idUserFollowed,
                    id_user_follower: userFollower.id_user
                }
            ),
        };
        const responseFollowInfo = await fetch("/api/follows/toggle", request);
        if (!responseFollowInfo.ok) {
            throw new Error(
                "fetch error : " + responseFollowInfo.status + " : " + responseFollowInfo.statusText
            );
        }
        return await responseFollowInfo;
    } catch (e) {
        console.log(e)
    }
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

export default ProfilePage;