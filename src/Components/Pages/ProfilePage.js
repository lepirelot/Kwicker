import GetPostsModule from "../Modules/GetPostsModule";
import load_user from "../../utils/load_user";
import {Redirect} from "../Router/Router";

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
                <div id="">
                    <div id="banner"></div>
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
    const sendMessage = document.getElementById("sendMessageButton");
    sendMessage.hidden = true;
    // Add follow button if other profile
    if (user.id_user !== userConnected.id_user) {
        sendMessage.hidden = false;
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
                Redirect('/messages?idUser=' + idCurrentUser);
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