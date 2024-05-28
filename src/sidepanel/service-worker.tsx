import browser from "webextension-polyfill";

// Test if browser is firefox or chrome. getBrowserInfo is only supported by firefox
let browserType = '';
try {
    browser.runtime.getBrowserInfo().then();
    browserType = 'firefox';
} catch {
    browserType = 'chrome';
}

export function setupContextMenu() {
    /**
    browser.contextMenus.create({
        id: 'opencti',
        title: 'OpenCTI',
        contexts: ['selection']
    });**/
}

// For firefox, listen on icon extension to open the extension sidepanel
browser.action.onClicked.addListener(() => {
    browser.sidebarAction.open().then();
});

// menu "OpenCTI" action
browser.contextMenus.onClicked.addListener((data:any, tab: any) => {
    if (data.menuItemId === "opencti") {
        chrome.sidePanel.setOptions({path: 'index.html?' + new URLSearchParams({
            action: "search",
            query: data.selectionText,
        })}).then();
        chrome.sidePanel.open({ windowId: tab.windowId }).then();
    }
});

// Initialize app contextual menu
browser.runtime.onInstalled.addListener(() => {
    setupContextMenu();
});

// Allows users to open the side panel by clicking on the action toolbar icon
if (browserType === 'chrome') {
    chrome.sidePanel
        .setPanelBehavior({ openPanelOnActionClick: true })
        .catch((error) => console.error(error));
}






