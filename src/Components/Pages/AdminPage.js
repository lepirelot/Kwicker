import Tables from "../../utils/tables";

const adminPagehtml = `
    <div id="adminPage">
        <div class="btn-group d-flex justify-content-center m-5" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-primary adminHandlingButton" id="postsGestionButton">Posts Gestion</button>
            <button type="button" class="btn btn-primary adminHandlingButton" id="membersGestionButton">Members Gestion</button>
        </div>
        <div id="adminTable"></div>
    </div>
`;

const AdminPage = () => {
    const page = document.getElementById("page");
    page.innerHTML = adminPagehtml;
    const postGestionButton = document.getElementById("postsGestionButton");
    const membersGestionButton = document.getElementById("membersGestionButton");
    postGestionButton.addEventListener("click", showPostsGestion);
    membersGestionButton.addEventListener("click", showMembersGestion);

}

const postsGestionHtml = `
    <h3>Posts Gestion</h3>
        <table id="postsGestionTable" class="table-bordered">
            <tr>
<!--                <th>Post's Id</th>-->
                <th>User's Id</th>
                <th>Image</th>
                <th class="messageColumnAdmin">Message</th>
<!--                <th>Parent Post's Id</th>-->
                <th>Removed</th>
                <th>Creation Date</th>
                <th>Likes</th>
                <th>Suppression</th>
            </tr>
            <tbody id="postsGestionTbody">

            </tbody>
        </table>
`;

async function showPostsGestion() {
    const adminTable = document.getElementById("adminTable");
    adminTable.innerHTML = postsGestionHtml;
    try {
        await Tables.refreshPostsTable();
    } catch (e) {
        console.log(e.message);
    }
}

const membersGestionHtml = `
    <h3>Members Gestion</h3>

        <table id="membersGestionTable" class="table-bordered">
            <tr>
<!--                <th>User's Id</th>-->
                <th>Forename/Lastname</th>
<!--                <th>Lastname</th>-->
                <th>Email</th>
                <th>Username</th>
<!--                <th>Image</th>-->
                <th>Active</th>
                <th>Admin</th>
<!--                <th>Biography</th>-->
                <th>Creation Date</th>
                <th></th>
            </tr>
            <tbody id="membersGestionTbody">
            </tbody>
        </table>
`;

async function showMembersGestion() {
    const adminTable = document.getElementById("adminTable");
    adminTable.innerHTML = membersGestionHtml;

    try {
        await Tables.refreshMembersTable();
    } catch (e) {
        console.log(e.message);
    }
}

export default AdminPage;