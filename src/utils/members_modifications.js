import Tables from "./tables";
import load_user from "./load_user";

async function setAdmin(id_user) {
    const putRequest = {
        method: "PUT",
        headers: {
            Authorization: load_user.getToken()
        }
    };

    try {
        const response = await fetch(`/api/users/setadmin/${id_user}`, putRequest);

        if(!response.ok)
            throw new Error("fetch error : " + response.status + " : " + response.statusText);
        await Tables.refreshMembersTable();
    } catch (e) {
        console.error(e);
    }
}

async function setNotAdmin(id_user) {
    const putRequest = {
        method: "PUT",
        headers: {
            Authorization: load_user.getToken()
        }
    };
    try {
        const response = await fetch(`/api/users/setnotadmin/${id_user}`, putRequest);
        if(!response.ok)
            throw new Error("fetch error : " + response.status + " : " + response.statusText);
        await Tables.refreshMembersTable();
    } catch (e) {
        console.error(e);
    }
}

async function activateUser(id_user) {
    const putRequest = {
        method: "PUT",
        headers: {
            Authorization: load_user.getToken()
        }
    };
    try {
        const response = await fetch(`/api/users/activate/${id_user}`, putRequest);
        if(!response.ok)
            throw new Error("fetch error : " + response.status + " : " + response.statusText);
        await Tables.refreshMembersTable();
    } catch (e) {
        console.error(e);
    }
}

async function deactivateUser(id_user) {
    const deleteRequest = {
        method: "DELETE",
        headers: {
            Authorization: load_user.getToken()
        }
    };
    try {
        const response = await fetch(`/api/users/${id_user}`, deleteRequest);
        if (!response.ok)
            throw new Error("fetch error : " + response.status + " : " + response.statusText);
        await Tables.refreshMembersTable();
    } catch (e) {
        console.error(e);
    }
}

export default {activateUser, deactivateUser, setAdmin, setNotAdmin};