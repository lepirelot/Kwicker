import HomePage from "../Pages/HomePage";
import NewPage from "../Pages/NewPage";
import RegisterPage from "../Pages/RegisterPage"
import ProfilePage from "../Pages/ProfilePage";
import TopKwicks from "../Pages/TopKwicks";
import UserLikesPage from "../Pages/UserLikesPage";
import LoginPage from "../Pages/LoginPage";
import AdminPage from "../Pages/AdminPage";
import Logout from "../Pages/Logout";
import UsersPage from "../Pages/UsersPage";
import Messages from "../Pages/MessagesPage";
import SettingsPage from "../Pages/SettingsPage";
import load_user from "../../utils/load_user";

// Configure your routes here
const routes = {
  "/": HomePage,
  "/new": NewPage,
  "/register": RegisterPage,
  "/profile" : ProfilePage,
  "/top_kwicks" : TopKwicks,
  "/liked_posts": UserLikesPage,
  "/login": LoginPage,
  "/admin_page": AdminPage,
  "/logout": Logout,
  "/users": UsersPage,
  "/settings": SettingsPage,
  "/messages": Messages
};

/**
 * Deal with call and auto-render of Functional Components following click events
 * on Navbar, Load / Refresh operations, Browser history operation (back or next) or redirections.
 * A Functional Component is responsible to auto-render itself : Pages, Header...
 */

const Router = () => {
  /* Manage click on the Navbar */
  let navbarWrapper = document.querySelector("#navbarWrapper");
  navbarWrapper.addEventListener("click", (e) => {
    // To get a data attribute through the dataset object, get the property by the part of the attribute name after data- (note that dashes are converted to camelCase).
    let uri = e.target.dataset.uri;

    // Active navbar item
    const list = navbarWrapper.getElementsByTagName("a");
    for (const item of list) {
      if ((item.getAttribute("data-uri") === uri)) {
        item.setAttribute("class", "active");
      } else {
        item.classList.remove("active");
      }
    }

    if (uri) {
      e.preventDefault();
      const user = load_user.loadUser();
      if(user && !user.is_admin && uri === "/admin_page")
        uri = "/";
      /* use Web History API to add current page URL to the user's navigation history 
       & set right URL in the browser (instead of "#") */
      window.history.pushState({}, uri, window.location.origin + uri);
      /* render the requested component
      NB : for the components that include JS, we want to assure that the JS included 
      is not runned when the JS file is charged by the browser
      therefore, those components have to be either a function or a class*/
      const componentToRender = routes[uri.split("?")[0]];
      if (routes[uri.split("?")[0]]) {
        componentToRender();
      } else {
        throw Error("The " + uri + " ressource does not exist");
      }
    }
  });

  /* Route the right component when the page is loaded / refreshed */
  window.addEventListener("load", (e) => {
    const user = load_user.loadUser();
    if(user && !user.is_admin && window.location.pathname === "/admin_page")
      window.location.pathname = "/";

    let componentToRender = routes[window.location.pathname];
    if (!componentToRender) {
      // throw Error(
      //     "The " + window.location.pathname + " ressource does not exist."
      // );
      componentToRender = routes["/"]
    }

    componentToRender();
  });

  // Route the right component when the user use the browsing history
  window.addEventListener("popstate", () => {
    const user = load_user.loadUser();
    if(user && !user.is_admin && window.location.pathname === "/admin_page")
      window.location.pathname = "/";

    const componentToRender = routes[window.location.pathname];
    componentToRender();
  });
};

/**
 * Call and auto-render of Functional Components associated to the given URL
 * @param {*} uri - Provides an URL that is associated to a functional component in the
 * routes array of the Router
 */

const Redirect = (uri) => {
  // use Web History API to add current page URL to the user's navigation history & set right URL in the browser (instead of "#")
  // const user = JSON.parse(window.localStorage.getItem("user"));
  // if(user && !user.is_admin && uri === "/admin_page")
  //   uri = "/";
  window.history.pushState({}, uri, window.location.origin + uri);
  // render the requested component
  const page = uri.split("?")[0];
  const componentToRender = routes[page];
  if (routes[page]) {
    componentToRender();
  } else {
    throw Error("The " + uri + " ressource does not exist");
  }
};

export { Router, Redirect };
