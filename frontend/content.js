// Content script - runs on web pages to detect text selection in real-time

let lastSelection = '';

// Listen for mouse up events (when user finishes selecting)
document.addEventListener('mouseup', () => {
    setTimeout(() => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText && selectedText !== lastSelection) {
            lastSelection = selectedText;
            // Send selection to background script
            chrome.runtime.sendMessage({
                type: 'SELECTION_CHANGED',
                text: selectedText
            }).catch(() => {});
        }
    }, 10);
});

// Also listen for keyboard selection (Shift + Arrow keys)
document.addEventListener('keyup', (e) => {
    if (e.shiftKey) {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText && selectedText !== lastSelection) {
            lastSelection = selectedText;
            chrome.runtime.sendMessage({
                type: 'SELECTION_CHANGED',
                text: selectedText
            }).catch(() => {});
        }
    }
});
