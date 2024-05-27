import {ActionType, MessageTypes} from "./types";
import {getPageContent, highlightDOM} from "./getPageContent";

// Function called when a new message is received
const messagesFromReactAppListener = (
    msg: ActionType,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: ActionType["response"]) => void) => {

    if (msg.type === MessageTypes.GET_CONTENT){
        sendResponse(getPageContent());
    }
    if (msg.type === MessageTypes.HIGHLIGHT){
        console.log(msg.param);
        sendResponse(highlightDOM(msg.param));
    }
}


/**
 * Fired when a message is sent from either an extension process or a content script.
 */

chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
