
function notificationModule(type = 'alert-primary', message = 'none') {
    return `<div class="alert ${type} p-2" role="alert">
              ${message}
            </div>`;
}

export default notificationModule;