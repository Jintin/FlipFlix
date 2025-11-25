// Popup Logic

const HIDDEN_STORAGE_KEY = 'netflix_hidden_titles';

function renderList(hiddenTitles) {
    const list = document.getElementById('hidden-list');
    const emptyMsg = document.getElementById('empty-msg');

    list.innerHTML = '';

    if (!hiddenTitles || hiddenTitles.length === 0) {
        emptyMsg.style.display = 'block';
        return;
    }

    emptyMsg.style.display = 'none';

    hiddenTitles.forEach(title => {
        const li = document.createElement('li');
        li.className = 'hidden-item';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'item-title';
        titleSpan.innerText = title;

        const btn = document.createElement('button');
        btn.className = 'unhide-btn';
        btn.innerText = 'Unhide';
        btn.onclick = () => {
            removeHiddenTitle(title);
        };

        li.appendChild(titleSpan);
        li.appendChild(btn);
        list.appendChild(li);
    });
}

function removeHiddenTitle(titleToRemove) {
    chrome.storage.sync.get([HIDDEN_STORAGE_KEY], (result) => {
        let hiddenTitles = result[HIDDEN_STORAGE_KEY] || [];
        hiddenTitles = hiddenTitles.filter(title => title !== titleToRemove);

        chrome.storage.sync.set({ [HIDDEN_STORAGE_KEY]: hiddenTitles }, () => {
            renderList(hiddenTitles);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get([HIDDEN_STORAGE_KEY], (result) => {
        renderList(result[HIDDEN_STORAGE_KEY]);
    });
});
