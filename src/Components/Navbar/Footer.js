/**
 * Render the Navbar which is styled by using Bootstrap
 * Each item in the Navbar is tightly coupled with the Router configuration :
 * - the URI associated to a page shall be given in the attribute "data-uri" of the Navbar
 * - the router will show the Page associated to this URI when the user click on a nav-link
 */
import twitterLogo from "../../img/twitter.png";
import facebookLogo from "../../img/facebookLogo.jpg";

const Footer = () => {

    const footerWrapper = document.querySelector("#footerWrapper");


    let footer = `
<!--        <a href="https://twitter.com/?lang=fr"><img id="twitter" class="reseau" alt="Twitter logo"></a>-->
<!--        <a href="https://www.instagram.com/?hl=fr"><img id="instagram" class="reseau" alt="Instagram logo"></a>-->
<!--        <a href="https://fr-fr.facebook.com/"><img id="facebook" class="reseau" alt="Facebook logo"></a>-->
<!--        <p class="reseau">Twitter</p><p class="reseau">Instagram</p><p class="reseau">Facebook</p>-->
  `;


    footerWrapper.innerHTML = footer;

















    // const twitter = document.createElement("img");
    // const instagram = document.createElement("img");
    // const facebook = document.createElement("img");
    // const linktwitter = document.createElement("a");
    // const linkinstagram = document.createElement("a");
    // const linkfacebook = document.createElement("a");

    // twitter.src=twitterLogo;
    // instagram.src=instagramLogo;
    // facebook.src=facebookLogo;

    // linktwitter.href="https://twitter.com/?lang=fr";
    // linktwitter.appendChild(twitter);
    // linkinstagram.href="https://www.instagram.com/?hl=fr";
    // linkinstagram.appendChild(instagram);
    // linkfacebook.href="https://fr-fr.facebook.com/";
    // linkfacebook.appendChild(facebook);
    //
    // footerWrapper.appendChild(twitter);
    // footerWrapper.appendChild(instagram);
    // footerWrapper.appendChild(facebook);

    // footerWrapper.innerHTML=`
    //
    //     <p>Bonsoir</p>
    //
    // `;

};

export default Footer;
