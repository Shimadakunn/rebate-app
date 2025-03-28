// Chrome extension content script
console.log("Content script loaded");

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message:", message);
  sendResponse({ received: true });
});
