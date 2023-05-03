browser.runtime.onMessage.addListener(clipboard);

function clipboard(request) {
    if (request.type === "clipboard" && request.content.trim() !== "" && request.url !== undefined) {
        let key = Date.now().toString();
        let json = JSON.stringify({ 'value': request.content.trim(), 'url': request.url });
        localStorage.setItem(key, json);
    }
}

function updateIcon() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        browser.browserAction.setIcon({path: "clipboard-48-dark.png"});
    } else {
        browser.browserAction.setIcon({path: "clipboard-48.png"});
    }
}

// Update the icon when the user's color scheme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateIcon);

// Update the icon when the extension is installed or updated
browser.runtime.onInstalled.addListener(updateIcon);