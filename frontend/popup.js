// API Configuration
const API_BASE_URL = 'http://localhost:8081/api/research';

// DOM Elements
const contentInput = document.getElementById('content');
const summarizeBtn = document.getElementById('summarizeBtn');
const suggestBtn = document.getElementById('suggestBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const resultSection = document.getElementById('resultSection');
const resultTitle = document.getElementById('resultTitle');
const resultContent = document.getElementById('resultContent');
const copyBtn = document.getElementById('copyBtn');
const statusBar = document.getElementById('statusBar');

// Connect to background script
const port = chrome.runtime.connect({ name: 'sidepanel' });

// Event Listeners
summarizeBtn.addEventListener('click', () => processContent('summarize'));
suggestBtn.addEventListener('click', () => processContent('suggest'));
copyBtn.addEventListener('click', copyResult);

// Listen for real-time selection changes from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SELECTION_CHANGED' && message.text) {
        contentInput.value = message.text;
    }
});

// Also fetch initial selection when panel opens
document.addEventListener('DOMContentLoaded', fetchSelectedText);

// Fetch selected text from current tab
async function fetchSelectedText() {
    try {
        // Get the current active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Execute script to get selected text
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
                // Get the selected text from the page
                const selectedText = window.getSelection().toString();
                return selectedText;
            }
        });
        
        if (results && results[0] && results[0].result) {
            contentInput.value = results[0].result;
        }
    } catch (err) {
        console.error('Error fetching selection:', err);
    }
}

// Process content with the backend API
async function processContent(operation) {
    const content = contentInput.value.trim();
    
    if (!content) {
        showError('Please enter some content or fetch the current page.');
        return;
    }
    
    // Show loading state
    showLoading(true);
    hideError();
    hideResult();
    
    try {
        const response = await fetch(`${API_BASE_URL}/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
                operation: operation
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.text();
        
        // Display result
        showResult(operation, result);
        showStatus(`✓ ${operation === 'summarize' ? 'Summary' : 'Suggestions'} generated successfully!`);
        
    } catch (err) {
        console.error('API Error:', err);
        if (err.message.includes('Failed to fetch')) {
            showError('Could not connect to the server. Make sure the backend is running on localhost:8080');
        } else {
            showError(`Error: ${err.message}`);
        }
    } finally {
        showLoading(false);
    }
}

// Copy result to clipboard
async function copyResult() {
    try {
        await navigator.clipboard.writeText(resultContent.textContent);
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = '📋 Copy';
        }, 2000);
    } catch (err) {
        console.error('Copy failed:', err);
        showError('Failed to copy to clipboard');
    }
}

// UI Helper Functions
function showLoading(show) {
    loading.classList.toggle('active', show);
    summarizeBtn.disabled = show;
    suggestBtn.disabled = show;
}

function showError(message) {
    error.textContent = message;
    error.classList.add('active');
}

function hideError() {
    error.classList.remove('active');
}

function showResult(operation, content) {
    resultTitle.textContent = operation === 'summarize' ? '📝 Summary' : '💡 Suggestions';
    resultContent.textContent = content;
    resultSection.classList.add('active');
}

function hideResult() {
    resultSection.classList.remove('active');
}

function showStatus(message) {
    statusBar.textContent = message;
    statusBar.classList.add('active');
    setTimeout(() => {
        statusBar.classList.remove('active');
    }, 3000);
}
