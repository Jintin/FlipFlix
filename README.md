# FlipFlix

**FlipFlix** is a Chrome Extension that allows you to hide movies and TV shows on Netflix that you've already watched or aren't interested in. It provides a seamless, integrated experience with smooth animations and intuitive controls.

## Features

*   **Hide Content**: Hover over any movie or show card to reveal a **"Hide"** button. Click it to dim the content.
*   **Flip Animation**: Enjoy a satisfying flip animation whenever you hide or unhide a title.
*   **Smart Visibility**: Hidden content is dimmed (brightness 0.5) to stay out of focus. Hovering over it restores color (but keeps it dim) so you can identify it without it being distracting.
*   **Expansion Shield**: Prevents the card from expanding (the "Bob" card effect) when you hover over a hidden item, keeping your interface calm.
*   **Integrated Controls**: The "Hide" and "Unhide" buttons are integrated directly into Netflix's UI, including the expanded card view.
*   **Sync Storage**: Your list of hidden titles syncs across all your Chrome devices.
*   **Management Popup**: Click the extension icon to view a list of all hidden titles and easily unhide them.

## Installation

1.  Clone or download this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable **Developer mode** by toggling the switch in the top-right corner.
4.  Click the **Load unpacked** button.
5.  Select the directory where you saved the FlipFlix files (the folder containing `manifest.json`).
6.  FlipFlix is now active on Netflix!

## Usage

1.  **Hiding**: Browse Netflix as usual. When you see a title you want to hide, hover over it and click the **Red "Hide"** button in the top-right corner (or in the button row on expanded cards).
2.  **Unhiding**: Hover over a hidden (dimmed) card. You will see a **Black "Unhide"** button. Click it to restore the title.
3.  **Managing**: Click the FlipFlix icon in your browser toolbar to see a text list of all hidden items. You can unhide them from there as well.

## Privacy

FlipFlix stores your hidden titles using Chrome's Sync Storage. This data stays within your Google account and is not sent to any external servers.
