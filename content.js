chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start_automation") {
    startProcessing(request.mode, request.prompts);
  }
});

async function startProcessing(mode, prompts) {
  console.log(`Starting Auto Meta in ${mode} mode...`);
  
  for (let i = 0; i < prompts.length; i++) {
    let currentPrompt = prompts[i];
    
    // 1. Upload Image (If Image-to-Video mode)
    if (mode === "image") {
      // Logic to target the file input element on Meta AI and upload the image
      // const fileInput = document.querySelector('input[type="file"]');
    }

    // 2. Type Prompt
    const promptBox = document.querySelector('textarea[placeholder*="prompt"]'); // UPDATE SELECTOR
    if (promptBox) {
      promptBox.value = currentPrompt;
      // Trigger React input events so the site registers the typing
      promptBox.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // 3. Click Generate Button
    const generateBtn = document.querySelector('button[aria-label="Generate"]'); // UPDATE SELECTOR
    if (generateBtn) {
      generateBtn.click();
    }

    // 4. Wait for processing (15-30 seconds depending on settings)
    await sleep(20000); 

    // 5. Trigger Auto-Download (Check for new video element)
    downloadLatestVideo();
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadLatestVideo() {
    // Find the generated video URL on the page and send it to the background script
    const videoElement = document.querySelector('video'); // UPDATE SELECTOR
    if (videoElement && videoElement.src) {
        chrome.runtime.sendMessage({ action: "download", url: videoElement.src });
    }
}
