const clearButton = document.getElementById("clear-button");
const copyButton = document.getElementById("copy-button");
const copyWithUrlButton = document.getElementById("copy-with-url-button");

if (! storageAvailable("localStorage")) {
    document.getElementById("selected-text").innerText += 'local storage not available';
}

let clipBoard;
let clips;

navigator.clipboard
    .readText()
    .then(
        (clipText) => {
            clipBoard = clipText.trim();
            initPopup();
        }
    );

function initPopup() {
    clips = readFromLocalStorage();
    showClips(clips);
}

function readFromLocalStorage() {
    let clips = [];

    for(let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let json = localStorage.getItem(key);
        let item = JSON.parse(json);
        item.key = key;
        clips.push(item);
    }

    return clips.sort((a, b) => {
        return a.key - b.key;
    });
}

function showClips(clips) {
    clips.forEach((clip) => {
        addClip(clip.value, clip.key, clip.url);
    });
}

function addClip(value, key, url) {
    let clip = document.createElement("div");
    clip.className = "clip";
    clip.innerText = value;
    if(clipBoard === value) {
        clip.className += " current";
    }
    clip.dataset.id = key;
    let source = document.createElement("span");
    source.className = "url";
    source.innerText = url;
    clip.appendChild(source);
    clip.addEventListener("click", selectClip);
    document.getElementById("clips").prepend(clip);
}

function selectClip(e) {
    let clickedDiv = e.target;
    if(e.target.classList.contains("url")) {
        clickedDiv = e.target.parentNode;
    }

    let key = clickedDiv.dataset.id;
    let json = localStorage.getItem(key);
    let item = JSON.parse(json);
    clipBoard = item.value;
    navigator.clipboard.writeText(clipBoard);

    let currentClip = document.querySelector(".current");
    if (currentClip) {
        currentClip.classList.remove("current");
    }
    clickedDiv.classList.add("current");
}


function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            // everything except Firefox
            (e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === "QuotaExceededError" ||
                // Firefox
                e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
        );
    }
}

clearButton.addEventListener("click", () => {
    localStorage.clear();
    document.getElementById("clips").innerHTML = "";
});
clearButton.addEventListener("click", animateClick);

copyButton.addEventListener("click", () => {
    let text = '';
    clips.forEach((clip) => {
        text += clip.value + '\n' + '\n';
    });
    navigator.clipboard.writeText(text);
});
copyButton.addEventListener("click", animateClick);

copyWithUrlButton.addEventListener("click", () => {
    let text = '';
    clips.forEach((clip) => {
        text += clip.value + '\n' + clip.url + '\n' + '\n';
    });
    navigator.clipboard.writeText(text);
});
copyWithUrlButton.addEventListener("click", animateClick);

function animateClick(e) {
    e.target.classList.add('clicked');
    setTimeout(() => {
        e.target.classList.remove('clicked');
    }, 50);
}
