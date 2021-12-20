
const Logout = () => {
    window.localStorage.clear();
    window.location.replace(window.location.origin + "/login");
}

export default Logout;