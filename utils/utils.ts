// Message types
export interface CheckKeyExistsResponse {
  success: boolean;
  exists?: boolean;
  error?: string;
  data?: {
    data: string;
    dateUploaded: string;
  };
}

export interface KeyActionResponse {
  success: boolean;
  error?: string;
}

// Helper function to decode base64
export const decodeBase64 = (base64: string): string => {
  try {
    return atob(base64);
  } catch (error) {
    console.error("Error decoding base64:", error);
    return "Invalid key data";
  }
};

// Helper function to safely handle Chrome message responses with timeout
export const sendChromeMessage = <T, R>(
  message: T,
  callback: (response: R | undefined) => void,
  timeout = 5000 // 5 second timeout
) => {
  let timeoutId: number | undefined;
  let hasResponded = false;

  try {
    // Set timeout to catch unresponsive background script
    timeoutId = window.setTimeout(() => {
      if (!hasResponded) {
        console.error("Message response timed out");
        hasResponded = true;
        callback(undefined);
      }
    }, timeout);

    // Send message to background script
    console.log("Sending message to background script:", message);
    chrome.runtime.sendMessage(message, (response) => {
      // Clear timeout as we got a response
      if (timeoutId) window.clearTimeout(timeoutId);

      // Only process the first response
      if (hasResponded) return;
      hasResponded = true;

      // Check for runtime error
      if (chrome.runtime.lastError) {
        console.error("Chrome runtime error:", chrome.runtime.lastError);
        callback(undefined);
        return;
      }

      console.log("Received response:", response);
      callback(response);
    });
  } catch (error) {
    // Clear timeout if we had an exception
    if (timeoutId) window.clearTimeout(timeoutId);

    console.error("Error sending message to background script:", error);
    if (!hasResponded) {
      hasResponded = true;
      callback(undefined);
    }
  }
};
