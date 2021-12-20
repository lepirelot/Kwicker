import createMessagePage from "../Modules/GetMessagesModule"

/**
 * Render the Messages
 */

const Messages = async () => {
    try {
        await createMessagePage();
    } catch (e) {
        console.error(e);
    }
};

export default Messages;