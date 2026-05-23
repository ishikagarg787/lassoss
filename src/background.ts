chrome.action.onClicked.addListener(
  async (tab) => {
    if (!tab.id) return;

    chrome.tabs.sendMessage(
      tab.id,
      {
        type: "START_LASSO",
      }
    );
  }
);

chrome.runtime.onMessage.addListener(
  (
    message: any,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    if (message.type === "CAPTURE_TAB") {
      chrome.tabs.captureVisibleTab(
        { format: "png" },

        (dataUrl) => {
          sendResponse({
            success: true,
            dataUrl,
          });
        }
      );

      return true;
    }
  }
);