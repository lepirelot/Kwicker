import load_user from "../../utils/load_user";

/**
 * Ask the api to add a message into the db.
 * @param body
 */
async function sendMessage(body) {
    const request = {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            Authorization: load_user.getToken(),
            "Content-Type": "application/json"
        }
    };
    const response = await fetch("/api/messages/", request);
    if (!response.ok)
        throw new Error("fetch error : " + response.status + " : " + response.statusText);
}

/**
 * getPosts
 * @param profilePosts
 * @param isHomepage
 * @param isLikesPost
 * @returns {Promise<any>}
 */
async function getPosts(profilePosts = null, isHomepage = false, isLikesPost = false) {
    const user = load_user.loadUser();
    let request = {
        method: "GET",
        headers: {
            "Authorization": user.token
        }
    };

    let responsePosts = await fetch(`/api/posts/allPostWithLikesAndUser/` + profilePosts, request);
    if (isHomepage) {
        request = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": user.token
            },
            body: JSON.stringify(
                {
                    id_user: user.id_user,
                }
            ),
        };

        responsePosts = await fetch(`/api/posts/homepage`, request);
    } else if (isLikesPost) {
        request = {
            "method": "GET",
            headers: {
                Authorization: user.token
            }
        };
        responsePosts = await fetch(`/api/posts/postsLiked/${user.id_user}`, request);
    }

    if (!responsePosts.ok) {
        throw new Error(
            "fetch error : " + responsePosts.status + " : " + responsePosts.statusText
        );
    }
    return await responsePosts.json();
}

/**
 * Request the db to get user informations
 * @param idUser
 * @returns {Promise<any>}
 */
async function getBaseInformationsUser(idUser) {
    try {
        const token = JSON.parse(window.localStorage.getItem("user")).token;
        const request = {
            method: "GET",
            headers: {
                "Authorization": token
            }
        };
        const responseUserInfo = await fetch("/api/users/profile/" + idUser, request);
        if (!responseUserInfo.ok) {
            throw new Error("fetch error : " + responseUserInfo.status + " : " + responseUserInfo.statusText);
        }
        return await responseUserInfo.json();
    } catch (e) {
        console.log(e);
    }
}

/**
 * verify if the post is liked
 * @param post
 * @returns {Promise<void>}
 */
async function isLiked(post) {
    const user = load_user.loadUser();
    if (!post) return;

    let request = {
        method: "GET",
        headers: {
            "Authorization": user.token
        }
    };
    const reponseLikes = await fetch(`/api/likes/exist/` + user.id_user + `/` + post, request);
    if (!reponseLikes.ok) {
        throw new Error(
            "fetch error : " + reponseLikes.status + " : " + reponseLikes.statusText
        );
    }

    if (reponseLikes.status.toString().slice(-1) === "1") {
        document.getElementsByClassName("likeButton").namedItem(post).innerHTML = `<path fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path>`;
    }
}

/**
 * Add a like for the post
 * @param post
 * @returns {Promise<void>}
 */
async function sendLike(post) {
    const user = load_user.loadUser();
    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": user.token
        },
        body: JSON.stringify(
            {
                id_user: user.id_user,
                id_post: post.id
            }
        ),
    };
    try {
        const responsePosts = await fetch(`/api/likes/toggle`, request);
        if (!responsePosts.ok) {
            throw new Error(
                "fetch error : " + responsePosts.status + " : " + responsePosts.statusText
            );
        }

        const likeCounter = document.getElementById("counter" + post.id);
        const likeCounterInt = parseInt(likeCounter.innerHTML);
        if (responsePosts.status === 201) {
            likeCounter.innerHTML = likeCounterInt + 1;
            document.getElementsByClassName("likeButton").namedItem(post.id).innerHTML = `<path fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path>`;
        } else {
            if (location.pathname !== "/liked_posts") {
                likeCounter.innerHTML = likeCounterInt - 1;
            } else {
                likeCounter.parentNode.hidden = true;
            }
            document.getElementsByClassName("likeButton").namedItem(post.id).innerHTML = `<path fill="currentColor" d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"></path>`;
        }

    } catch (e) {
        console.log(e);
    }
}

async function getMessages(id_sender, id_recipient) {
    const request = {
        method: "GET",
        headers: {
            "Authorization": load_user.getToken()
        }
    };
    //Get messages from dm
    const response = await fetch(`/api/messages/getMessages/${id_sender}/${id_recipient}`, request);
    if (!response.ok) {
        throw new Error("fetch error : " + response.status + " : " + response.statusText);
    }
    return await response.json();
}

async function getRecipients(id_sender) {
    const request = {
        method: "GET",
        headers: {
            Authorization: load_user.getToken()
        }
    };
    const response = await fetch(`/api/messages/recipients/${id_sender}`, request);
    if (!response.ok) {
        throw new Error("fetch error : " + response.status + " : " + response.statusText);
    }
    return await response.json();
}

async function getSender(id_recipient) {
    const request = {
        method: "GET",
        headers: {
            Authorization: load_user.getToken()
        }
    };
    const response = await fetch(`/api/messages/sender/${id_recipient}`, request);
    if (!response.ok) {
        throw new Error("fetch error : " + response.status + " : " + response.statusText);
    }
    return await response.json();
}

/**
 * get the latest id_recipient linked to the lastest message sent by  the current user
 * @param id_sender
 * @returns {number}
 */
async function getTheLatestConversation(id_sender) {
    const request = {
        method: "GET",
        headers: {
            Authorization: load_user.getToken()
        }
    };
    const response = await fetch(`/api/messages/lastConversationWith/${id_sender}`, request);
    if(!response.ok) {
        throw new Error("fetch error : " + response.status + " : " + response.statusText);
    }
    return await response.json();
}

/**
 * get the latest id_recipient linked to the lastest message sent by  the current user
 * @param id_sender
 * @returns {number}
 */
async function getConversation(id_user) {
    const request = {
        method: "GET",
        headers: {
            Authorization: load_user.getToken()
        }
    };
    const response = await fetch(`/api/messages/conversationWith/${id_user}`, request);
    if(!response.ok) {
        throw new Error("fetch error : " + response.status + " : " + response.statusText);
    }
    return await response.json();
}

export default {
    sendMessage,
    getPosts,
    getBaseInformationsUser,
    isLiked,
    sendLike,
    getMessages,
    getRecipients,
    getSender,
    getTheLatestConversation,
    getConversation
};