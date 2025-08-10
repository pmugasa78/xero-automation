# Anuva Property Asset Management - Bulk Report Downloader

A custom-built Chrome extension for Anuva Property Asset Management to streamline the bulk downloading of reports from the internal system.

### Features

- **Bulk Download:** Download multiple reports at once, saving significant time and manual effort.
- **Automated Workflow:** The extension handles the clicks and navigation, automating a repetitive, multi-step process.
- **Real-time Progress:** A floating overlay displays the status of the downloads, so you always have a clear view of the progress.
- **Error Handling:** The extension gracefully handles common network errors and provides clear feedback on any failed downloads.

### Installation

This extension is intended for internal use and is not available on the Chrome Web Store. To install it, you must use your browser's Developer mode.

1.  **Download or Clone:** Download the project as a ZIP file or clone this repository to your local machine.
    ```sh
    git clone [repository-url]
    ```
2.  **Open Extensions:** Navigate to your browser's extensions page.
    - **Chrome/Edge:** `chrome://extensions`
    - **Firefox:** `about:addons`
3.  **Enable Developer Mode:** Turn on "Developer mode" in the top-right corner of the page.
4.  **Load Unpacked:** Click the "Load unpacked" button and select the correct folder for your browser from within the `dist` directory:
    - **For Chrome:** Select the `chrome` folder.
    - **For Firefox:** Select the `firefox` folder.
    - **For Edge:** Select the `edge` folder.
5.  **Enjoy\!** The extension's icon will now appear in your browser toolbar, ready for use.

### Usage

1.  **Navigate:** Go to the reports page on the internal system where the reports are listed.
2.  **Select:** Use the checkboxes or other selection methods to choose the reports you wish to download in bulk.
3.  **Click:** Click on the extension's icon in the browser toolbar.
4.  **Monitor:** A floating dialog will appear, displaying the progress of each download.
5.  **Done\!** Once the process is complete, a notification will confirm that all selected reports have been downloaded to your default download folder.

### Getting Started (for Developers)

To contribute to or modify this extension, follow these steps:

1.  **Clone the Repo:**
    ```sh
    git clone [repository-url]
    ```
2.  **Install Dependencies:**
    ```sh
    npm install
    ```
3.  **Run Development Build:** This command starts the development server, watches for file changes, and automatically rebuilds the extension into the `.output` folder.
    ```sh
    npm run dev
    ```
4.  **Load in Browser:** Load the unpacked extension in your browser from the correct sub-folder within the `.output` directory (e.g., `.output/chrome`). The `npm run dev` command will keep this folder up-to-date with your changes.

### Technologies Used

- **WXT Framework:** The Vite-based browser extension framework that enables a modern development experience.
- **React:** The UI library used for building the extension's popup and content script overlay.
- **TypeScript:** Used for type safety throughout the codebase.
- **Tailwind CSS:** Used for the clean and simple styling of the floating progress overlay.

### License

This project is licensed under the MIT License.

### Author

- Developed by Pete Mugasa for Anuva Property Asset Management.
