document.addEventListener('DOMContentLoaded', () => {
  const imageUpload = document.getElementById('image-upload');
  const imageCountDisplay = document.getElementById('image-count');
  const modeDisplay = document.getElementById('mode-display');
  const startBtn = document.getElementById('start-btn');

  // Check if we are on the correct page
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    if (!url.includes("meta.ai/media")) {
      document.getElementById('wrong-page-warning').classList.remove('hidden');
      document.getElementById('app-content').classList.add('hidden');
    }
  });

  document.getElementById('go-to-meta').addEventListener('click', () => {
    chrome.tabs.create({ url: "https://www.meta.ai/media" });
  });

  // Smart Mode Detection
  imageUpload.addEventListener('change', (e) => {
    const count = e.target.files.length;
    imageCountDisplay.innerText = count;
    modeDisplay.innerText = count > 0 ? "Image-to-Video" : "Text-to-Video";
  });

  // Start Automation
  startBtn.addEventListener('click', () => {
    const prompts = document.getElementById('prompt-list').value.split('\n\n');
    const files = imageUpload.files;
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "start_automation",
        mode: files.length > 0 ? "image" : "text",
        prompts: prompts,
        // In a real scenario, you'd convert files to base64 or object URLs to pass to the content script
      });
    });
  });
});
