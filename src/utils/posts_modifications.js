import Tables from "./tables";
import load_user from "./load_user";

async function activatePost(id_post) {
    const putRequest = {
        "method": "PUT",
        headers: {
            Authorization: load_user.getToken()
        }
    };
    try {
        const response = await fetch(`/api/posts/activate/${id_post}`, putRequest);
        if(!response.ok)
            throw new Error("fetch error : " + response.status + " : " + response.statusText);
        await Tables.refreshPostsTable();
    } catch (e) {
        console.error(e);
    }
}

async function removeAdminPost(id_post){
    const deleteRequest = {
        method: "DELETE",
        headers: {
            Authorization: load_user.getToken()
        }
    };
    try {
        const response = await fetch(`/api/posts/admin/${id_post}`, deleteRequest);
        if (!response.ok)
            throw new Error("fetch error : " + response.status + " : " + response.statusText);
        if(window.location.pathname === "/admin_page")
            await Tables.refreshPostsTable();
    } catch (e) {
        console.error(e);
    }
}
async function removePost(id_post){
    const deleteRequest = {
        method: "DELETE",
        headers: {
            Authorization: load_user.getToken()
        }
    };
    try {
        const response = await fetch(`/api/posts/${id_post}`, deleteRequest);
        if (!response.ok)
            throw new Error("fetch error : " + response.status + " : " + response.statusText);
        if(window.location.pathname === "/admin_page")
            await Tables.refreshPostsTable();
    } catch (e) {
        console.error(e);
    }
}

export default {activatePost, removeAdminPost, removePost};