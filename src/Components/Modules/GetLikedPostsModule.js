// import showPostsHtml from "./ShowPostsHtmlModule";
// import load_user from "../../utils/load_user";
//
// async function getLikedPosts (page) {
//     const user = load_user.loadUser();
//     const request = {
//         "method": "GET",
//         headers: {
//             Authorization: user.token
//         }
//     };
//
//     try {
//         const response = await fetch(`/api/posts/postsLiked/${user.id_user}`, request);
//         if(!response.ok)
//             throw new Error("fetch error : " + response.status + " : " + response.statusText);
//         const posts = await response.json();
//         if (posts.length === 0)
//             return;
//         showPostsHtml(page, posts);
//     } catch (e){
//         console.error(e);
//     }
// }
//
// export default getLikedPosts;