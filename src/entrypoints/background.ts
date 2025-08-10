export default defineBackground(() => {
  let currentDownloadName: string | null = null;

  // Listen to incoming messages
  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setDownloadName") {
      currentDownloadName = `${request.name}_${request.reportTitle}`;
      console.log("Set currentDownloadName to:", currentDownloadName);
    }
    return false;
  });

  // Listen for new downloads
  browser.downloads.onDeterminingFilename.addListener((item, suggest) => {
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
});
