import browser from "webextension-polyfill";

export function setupContextMenu() {
    browser.contextMenus.create({
        id: 'opencti',
        title: 'OpenCTI',
        contexts: ['selection']
    });
}

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

// menu "OpenCTI" action
chrome.contextMenus.onClicked.addListener((data:any, tab: any) => {
    if (data.menuItemId === "opencti") {
        chrome.sidePanel.setOptions({path: 'index.html?' + new URLSearchParams({
            action: "search",
            query: data.selectionText,
        })}).then();
        chrome.sidePanel.open({ windowId: tab.windowId }).then();
    }
});

// Initialize app contextual menu
chrome.runtime.onInstalled.addListener(() => {
    setupContextMenu();
});

