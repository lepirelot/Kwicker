/**
 * Render the Messages
 */
import createMessagePage from "../../Modules/GetMessagesModule";


const NewMessages = async () => {
    try {
        await createMessagePage();
    } catch (e) {
        console.error(e);
    }
};

export default NewMessages;