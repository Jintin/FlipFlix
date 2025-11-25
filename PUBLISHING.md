# Publishing FlipFlix to Chrome Web Store

## Prerequisites
- A Google account.
- A developer account on the [Chrome Web Store](https://chrome.google.com/webstore/dev/dashboard) (requires a one-time $5 fee).

## Steps

1.  **Package the Extension**:
    - Run the build script in your terminal:
      ```bash
      ./build.sh
      ```
    - This will create a `flipflix.zip` file in the project directory.

2.  **Upload to Chrome Web Store**:
    - Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/dev/dashboard).
    - Click **+ New Item**.
    - Drag and drop the `flipflix.zip` file.

3.  **Fill in Store Listing**:
    - **Description**: Provide a detailed description of what FlipFlix does.
    - **Category**: Select an appropriate category (e.g., Productivity, Fun).
    - **Language**: Select English (or your primary language).
    - **Screenshots**: Upload at least one screenshot of the extension in action (1280x800 or 640x400).
    - **Promo Tile** (Optional but recommended): 440x280 image.

4.  **Privacy Practices**:
    - Fill out the privacy tab. Since you use `storage` and `activeTab`, you might need to justify why.
    - **Host Permissions**: You are requesting access to `https://www.netflix.com/*`. Explain that this is needed to modify the DOM on Netflix pages to hide content.

5.  **Publish**:
    - Click **Submit for Review**.
    - The review process can take a few days.

## Privacy Practices & Justifications
Copy and paste these into the "Privacy practices" tab:

### Single Purpose Description
> FlipFlix allows users to hide specific movies and TV shows on Netflix to declutter their browsing experience.

### Permission Justifications

**1. activeTab**
> Used to detect when the user is on a Netflix page so the extension popup can display relevant options and interact with the content script to hide/unhide items.

**2. host_permissions (https://www.netflix.com/*)**
> Required to inject the content script into Netflix pages. This script identifies movie/show cards and applies visual changes (hiding/dimming) based on the user's preferences.

**3. storage**
> Used to save the list of titles (IDs) that the user has chosen to hide. This data is stored locally on the user's device and is not shared.

**4. Remote Code**
> **No**, this extension does not use remote code. All logic is contained within the extension package. (If asked to justify, state: "We do not execute any remote code.")

### Data Usage Certification
- You must check the boxes to certify that you comply with the Developer Program Policies.
- Since you are not collecting personal data, you can generally answer "No" to questions about collecting user data, unless you plan to add analytics later.
