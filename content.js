// Helper: Wait for an element to appear in the DOM
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        resolve(el);
      }
    }, 500);
    setTimeout(() => { clearInterval(interval); reject("Element timeout"); }, timeout);
  });
}

// Helper: Simulate "Real" typing for React/Next.js apps
function simulateTyping(element, text) {
  const lastValue = element.value;
  element.value = text;
  const event = new Event('input', { bubbles: true });
  // React 16+ tracker hack
  const tracker = element._valueTracker;
  if (tracker) tracker.setValue(lastValue);
  element.dispatchEvent(event);
}

async function runAutomation(mode, prompts, waitTime, startIndex) {
  const promptList = prompts.slice(startIndex);
  
  for (let i = 0; i < promptList.length; i++) {
    try {
      console.log(`Processing item ${i + startIndex + 1}...`);

      // 1. Find the prompt box
      const promptBox = await waitForElement('textarea[placeholder*="Ask"], textarea[id*="input"]');
      simulateTyping(promptBox, promptList[i]);

      // 2. Click Generate (The "Send" or "Create" arrow)
      const sendBtn = document.querySelector('button[type="submit"], button[aria-label*="Send"]');
      if (sendBtn) sendBtn.click();

      // 3. Wait for the video to generate 
      // (Meta AI usually shows a loading state or a specific video container)
      await new Promise(r => setTimeout(r, waitTime * 1000));

      // 4. Auto-Download check
      const videos = document.querySelectorAll('video');
      if (videos.length > 0) {
        const latestVideo = videos[videos.length - 1].src;
        if (latestVideo && latestVideo.startsWith('http')) {
          chrome.runtime.sendMessage({ action: "download", url: latestVideo });
        }
      }

    } catch (err) {
      console.error("Auto Meta Error:", err);
      break; 
    }
  }
  alert("Auto Meta: Batch processing complete!");
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "start") {
    runAutomation(msg.mode, msg.prompts, msg.wait, msg.startAt);
  }
});
