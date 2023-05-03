function copySelection() {
    let selectedText = window.getSelection().toString().trim();

    if (selectedText) {
        document.execCommand("Copy");
    }
    browser.runtime.sendMessage({
        "type": "clipboard",
        "content": window.getSelection().toString().trim(),
        "url": window.location.href
    });
}

document.addEventListener("mouseup", copySelection);