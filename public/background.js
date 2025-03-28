// Chrome extension background script for handling Fireblocks key file operations

// Log that the service worker is starting
console.log("Background service worker starting...");

// Initialize message handling
const initMessageHandling = () => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message);

    // Create a promise for the async operation
    let promise;

    switch (message.action) {
      case "uploadKey":
        promise = handleKeyFileUpload(message.fileData);
        break;
      case "deleteKey":
        promise = deleteKeyFile();
        break;
      case "checkKeyExists":
        promise = checkKeyFileExists();
        break;
      default:
        sendResponse({ success: false, error: "Unknown action" });
        return false;
    }

    // Handle the promise
    if (promise) {
      promise
        .then((result) => {
          console.log(`${message.action} result:`, result);
          sendResponse(result);
        })
        .catch((error) => {
          console.error(`${message.action} error:`, error);
          sendResponse({
            success: false,
            error: error.message || "Operation failed",
          });
        });

      // Return true to indicate we'll send a response asynchronously
      return true;
    }

    return false;
  });
};

// Handle uploading and storing the key file
async function handleKeyFileUpload(fileData) {
  if (!fileData) {
    throw new Error("No file data provided");
  }

  return new Promise((resolve, reject) => {
    const data = {
      fireblocks_key: {
        data: fileData,
        dateUploaded: new Date().toISOString(),
      },
    };

    chrome.storage.local.set(data, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve({ success: true });
      }
    });
  });
}

// Delete the stored key file
async function deleteKeyFile() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove("fireblocks_key", () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve({ success: true });
      }
    });
  });
}

// Check if key file exists
async function checkKeyFileExists() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("fireblocks_key", (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve({
          success: true,
          exists: !!result.fireblocks_key,
          data: result.fireblocks_key,
        });
      }
    });
  });
}

// Initialize the background script
const init = async () => {
  try {
    // Initialize message handling
    initMessageHandling();

    // Do initial key check
    const keyStatus = await checkKeyFileExists();
    console.log("Initial key status:", keyStatus);

    // Log successful initialization
    console.log("Background service worker initialized successfully");
  } catch (error) {
    console.error("Error initializing background service worker:", error);
  }
};

// Start initialization
init();
