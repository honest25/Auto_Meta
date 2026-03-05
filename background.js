chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "download" && request.url) {
    const timestamp = new Date().getTime();
    chrome.downloads.download({
      url: request.url,
      filename: `MetaAI_Video_${timestamp}.mp4`,
      conflictAction: "uniquify"
    });
  }
});
