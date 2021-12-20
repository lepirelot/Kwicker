import SendPostHTML from "../Modules/InsertPostModule";
import GetPostsModule from "../Modules/GetPostsModule";

/**
 * Render the HomePage
 */

const HomePage = async () => {
    // Init
    const pageDiv = document.querySelector("#page");
    pageDiv.innerHTML = ``;

    // Insert new post bar
    SendPostHTML(pageDiv);

    // pageDiv.innerHTML += `<h4 class="alert-danger">Posts from kwickers you follow</h4>`;
    // Get posts sorted by date
    await GetPostsModule(pageDiv, null, true);
};

export default HomePage;
