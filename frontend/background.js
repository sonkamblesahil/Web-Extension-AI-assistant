// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ windowId: tab.windowId });
});

// Set side panel behavior
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Inject content script when side panel opens
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'sidepanel') {
        // Get current tab and inject content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ['content.js']
                }).catch(err => console.log('Script injection error:', err));
            }
        });
    }
});

// Relay messages from content script to side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SELECTION_CHANGED') {
        // Broadcast to all extension pages (side panel)
        chrome.runtime.sendMessage(message).catch(() => {});
    }
});
