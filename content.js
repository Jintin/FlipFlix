// Netflix Block Content Script

const HIDDEN_STORAGE_KEY = 'netflix_hidden_titles';
let hiddenTitles = [];

// --- Storage Utilities ---

function loadHiddenTitles() {
    chrome.storage.sync.get([HIDDEN_STORAGE_KEY], (result) => {
        if (result[HIDDEN_STORAGE_KEY]) {
            hiddenTitles = result[HIDDEN_STORAGE_KEY];
            applyHiding();
        }
    });
}

function saveHiddenTitle(title) {
    if (!hiddenTitles.includes(title)) {
        hiddenTitles.push(title);
        chrome.storage.sync.set({ [HIDDEN_STORAGE_KEY]: hiddenTitles }, () => {
            applyHiding();
        });
    }
}

// --- DOM Manipulation ---

function animateFlip(card, actionCallback) {
    // 1. Flip Out
    card.classList.add('netflix-block-flipping');

    setTimeout(() => {
        // 2. Perform Action (Change State)
        actionCallback();

        // 3. Flip In
        setTimeout(() => {
            card.classList.remove('netflix-block-flipping');
        }, 50); // Small delay to ensure state change is processed
    }, 150); // Match CSS transition duration
}

function getTitleFromCard(card) {
    // Strategy: Look for aria-label on the link or image alt text
    // This is the most brittle part and may need adjustment based on Netflix's current DOM
    const link = card.querySelector('a[aria-label]');
    if (link) return link.getAttribute('aria-label');

    const img = card.querySelector('img[alt]');
    if (img) return img.getAttribute('alt');

    // Bob card specific
    const bobTitle = card.querySelector('.bob-title, [data-uia="bob-title"]');
    if (bobTitle) return bobTitle.innerText;

    // Fallback for some layouts
    const fallbackLink = card.querySelector('.fallback-text');
    if (fallbackLink) return fallbackLink.innerText;

    return null;
}

function removeHiddenTitle(title) {
    if (hiddenTitles.includes(title)) {
        hiddenTitles = hiddenTitles.filter(t => t !== title);
        chrome.storage.sync.set({ [HIDDEN_STORAGE_KEY]: hiddenTitles }, () => {
            applyHiding();
        });
    }
}

function injectControls(card) {
    if (card.dataset.netflixBlockInjected) return;

    const title = getTitleFromCard(card);
    if (!title) {
        // console.log('FlipFlix: No title found for card', card);
        return;
    }

    // Hide Button
    const hideBtn = document.createElement('button');
    hideBtn.className = 'netflix-block-btn';
    hideBtn.innerText = 'Hide';
    hideBtn.title = `Hide "${title}"`;
    hideBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        animateFlip(card, () => saveHiddenTitle(title));
    };

    // Check if this is a Bob card and try to find the button container
    // Common selectors for the button row in the expanded card
    const buttonContainer = card.querySelector('.bob-buttons-wrapper, .bob-actions-wrapper, .ptr-track-container');

    // Unhide Button
    const unhideBtn = document.createElement('button');
    unhideBtn.className = 'netflix-block-unhide-btn';
    unhideBtn.innerText = 'Unhide';
    unhideBtn.title = `Unhide "${title}"`;
    unhideBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        animateFlip(card, () => removeHiddenTitle(title));
    };

    if (buttonContainer) {
        // Inject into the button row for better integration
        hideBtn.classList.add('netflix-block-btn-integrated');
        unhideBtn.classList.add('netflix-block-btn-integrated');
        buttonContainer.appendChild(hideBtn);
        buttonContainer.appendChild(unhideBtn);
    } else {
        // Fallback to absolute positioning
        card.appendChild(hideBtn);
        card.appendChild(unhideBtn);
    }

    // Event Shield
    // Blocks mouse events from reaching Netflix's listeners to prevent card expansion
    const shield = document.createElement('div');
    shield.className = 'netflix-block-shield';

    // Stop propagation of hover events
    ['mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'mousemove'].forEach(eventType => {
        shield.addEventListener(eventType, (e) => {
            e.stopPropagation();
            // e.preventDefault(); // Optional: might block clicking? Let's allow clicking for now if user wants to play.
        });
    });

    card.appendChild(shield);

    card.dataset.netflixBlockInjected = 'true';
}

function applyHiding() {
    const selector = '[data-uia="slider-item"], [data-uia="title-card"], .slider-item, .title-card-container, .bob-card, [data-uia="bob-card"], [data-uia="bob-container"]';
    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
        const title = getTitleFromCard(card);
        if (title) {
            if (hiddenTitles.includes(title)) {
                card.classList.add('netflix-block-hidden');
            } else {
                card.classList.remove('netflix-block-hidden');
            }
        }
    });
}

function scanAndInject() {
    // Expanded cards often have specific containers.
    // We try to inject into the main container or the background container.
    const selector = '[data-uia="slider-item"], [data-uia="title-card"], .slider-item, .title-card-container, .bob-card, [data-uia="bob-card"], [data-uia="bob-container"]';
    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
        injectControls(card);
    });
    applyHiding();
}

// --- Observer ---

const observer = new MutationObserver((mutations) => {
    let shouldScan = false;
    for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
            shouldScan = true;
            break;
        }
    }
    if (shouldScan) {
        scanAndInject();
    }
});

// --- Mouseover Fallback ---
// Sometimes MutationObserver misses the bob card or it's created in a way we don't catch easily.
// We check on mouseover to be sure.
document.addEventListener('mouseover', (e) => {
    const target = e.target;
    // Check if we are hovering over a potential card or bob-card
    if (target.closest) {
        const card = target.closest('.bob-card, [data-uia="bob-card"], [data-uia="bob-container"], .slider-item, [data-uia="slider-item"]');
        if (card) {
            injectControls(card);
        }
    }
}, { passive: true });

// --- Polling for Bob Cards ---
// React often re-renders the bob card content, wiping our button.
// We poll specifically for the active bob card to re-inject if needed.
setInterval(() => {
    const bobCards = document.querySelectorAll('.bob-card, [data-uia="bob-card"], [data-uia="bob-container"]');
    bobCards.forEach(card => {
        // Force re-injection check
        if (!card.querySelector('.netflix-block-btn')) {
            card.dataset.netflixBlockInjected = ''; // Reset flag
            injectControls(card);
        }
    });
}, 100);

// --- Initialization ---

function init() {
    loadHiddenTitles();
    scanAndInject();

    // Always observe body to catch overlays/bob cards attached directly to body
    observer.observe(document.body, { childList: true, subtree: true });
}

// Listen for storage changes (e.g. from popup)
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes[HIDDEN_STORAGE_KEY]) {
        hiddenTitles = changes[HIDDEN_STORAGE_KEY].newValue || [];
        applyHiding();
    }
});

// Wait for page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
