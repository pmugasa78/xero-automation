export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  let currentDownloadName: string | null = null;

  // Listen to incoming messages
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchDevelopment") {
      fetch(
        `http://localhost:8080/api/development?name=${encodeURIComponent(
          request.name
        )}`
      )
        .then((res) => res.json())
        .then((data) => sendResponse({ success: true, data }))
        .catch((err) => sendResponse({ success: false, error: err.message }));

      return true; // Keep channel open for async response
    } else if (request.action === "setDownloadName") {
      currentDownloadName = `${request.name}_${request.reportTitle}`;
      console.log("Set currentDownloadName to:", currentDownloadName);
    }
    return false;
  });

  // Listen for new downloads
  chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
    if (!currentDownloadName) {
      // No custom name, proceed as normal
      suggest();
      return;
    }
    const extension = item.filename.split(".").pop();
    // Sanitize currentDownloadName to avoid invalid filename chars
    const safeName = currentDownloadName.replace(/[\/\\?%*:|"<>]/g, "_");
    const newFilename = `${safeName}.${extension}`;
    suggest({ filename: newFilename });

    // Clear currentDownloadName to avoid reusing for next downloads
    currentDownloadName = "";
  });

  // Intercept network
  const targetUrl = "https://reporting.xero.com/!NhLCW/v1/Run/GetData/1016";

  browser.webRequest.onCompleted.addListener(
    function (details) {
      if (details.url === targetUrl) {
        console.log("Caught the specific Xero request!", details);
        // Make a new GET request to the same URL to get the response body
        fetch(details.url)
          .then((response) => {
            // Check if the response is ok
            if (response.ok) {
              // Read the response body as text or JSON
              // For this specific URL, it's likely JSON
              return response.json();
            } else {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          })
          .then((data) => {
            console.log("Response body from the new request:", data);
            // Now you have the response body and can process it
            // e.g., send it to your popup, save it, etc.
          })
          .catch((error) => {
            console.error("Failed to fetch the response body:", error);
          });
      }
      console.log(
        "Request completed:",
        details.url,
        "Status:",
        details.statusCode
      );
    },
    { urls: [targetUrl] }, // Filter: listen to all URLs
    [] // Extra parameters (none for this event)
  );
});
