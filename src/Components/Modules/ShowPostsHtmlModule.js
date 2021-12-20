// import load_user from "../../utils/load_user";
//
// function showPostsHtml(page, posts){
//     const user = load_user.loadUser();
//     let htmlImage;
//     posts.forEach(post => {
//         // Image handling
//         if(post.image === null)
//             htmlImage = "";
//         else
//             htmlImage = `
//                 <div id="like_button_form" class="col-sm-auto" id="imageDiv" >
//                     <img id="image" src="${post.image}" width="50%">
//                 </div>`;
//
//
//         let removeButton = "";
//         if (user.id_user === post.id_user) {
//             removeButton = `
//                 <div id="remove_button_form" class="col-sm-auto" >
//                     <a class="remove_button" id="remove_button${post.id_post}" width="50%">Remove</a>
//                 </div>
//             `;
//         } else removeButton = "";
//
//         //Create row
//         let postRow = `
//             <div id="post">
//                 <div class="col-sm-auto">
//                     <div class="col-sm-5" id="postAuthor"><a href="/profile?idUser=${post.id_user}">${post.username}</a>
//                     ${removeButton}
//                 </div>
//                      <div class="col-sm-5" id="creationDate">Posté le ${new Date(post.date_creation).toDateString()}
//                      </div>
//                 </div>
//                 <div class="col-sm-auto" id="postText">${post.message}
//                 </div>
//                 ${htmlImage}
//                     <svg class="likeButton"  id="${post.id_post}" aria-hidden="true" focusable="false" data-prefix="far" data-icon="heart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"></path></svg>
//                     <div value="" style="display: inline" id="counter${post.id_post}">${post.number_of_likes}
//                     </div>
//             </div>
//         `;
//         page.innerHTML += postRow;
//
//     });
// }
//
//
// // async function isLiked(post){
// //     let request = {
// //         method: "GET",
// //         headers: {
// //             "Authorization": user.token
// //         }
// //     };
// //     try {
// //         const user = loadUser();
// //         const reponseLikes = await fetch(`/api/likes/exist/` + user.id_user + `/` + post.id_post, request);
// //         if (!reponseLikes.ok) {
// //             throw new Error(
// //                 "fetch error : " + reponseLikes.status + " : " + reponseLikes.statusText
// //             );
// //         }
// //         return reponseLikes.status.toString().slice(-1);
// //     } catch (e) {
// //         console.error(e);
// //     }
// // }
//
// export default showPostsHtml;