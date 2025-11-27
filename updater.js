const { dialog, app } = require('electron');
const { autoUpdater } = require('electron-updater');


// Configure auto-updater
autoUpdater.autoDownload = false; // We'll trigger download manually after user confirms
autoUpdater.autoInstallOnAppQuit = true; // Install when app closes
autoUpdater.disableWebInstaller = true; // We're not using web installer

// Placeholder GitHub repo URL - replace with your actual repo
const CURRENT_VERSION = '1.0.2'; // Update this with each release

function setupAutoUpdater(mainWindow) {
    // Check for updates on startup
    console.log('[UPDATER] Checking for updates...');
    autoUpdater.checkForUpdates();

    // When update is available
    autoUpdater.on('update-available', (info) => {
        console.log('[UPDATER] Update available:', info.version);
        dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Update Available',
            message: `A new version (${info.version}) is available!`,
            detail: `Current version: ${app.getVersion()}\nNew version: ${info.version}\n\nThe update will be downloaded automatically. You'll be notified when it's ready to install.`,
            buttons: ['Download Now', 'Later'],
            defaultId: 0
        }).then((result) => {
            if (result.response === 0) {
                // Start downloading
                console.log('[UPDATER] Starting download...');
                autoUpdater.downloadUpdate();
                
                // Show download progress
                let progressWin = null;
                autoUpdater.on('download-progress', (progressObj) => {
                    const message = `Downloading update...\n${Math.round(progressObj.percent)}% complete\n${(progressObj.transferred / 1024 / 1024).toFixed(2)} MB / ${(progressObj.total / 1024 / 1024).toFixed(2)} MB`;
                    console.log('[UPDATER]', message);
                    
                    // Update main window title or send to renderer
                    if (mainWindow) {
                        mainWindow.setTitle(`Random Pokemon Generator - ${message}`);
                    }
                });
            } else {
                console.log('[UPDATER] User chose to download later');
            }
        });
    });

    // When update is downloaded and ready
    autoUpdater.on('update-downloaded', (info) => {
        console.log('[UPDATER] Update downloaded successfully!');
        dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Update Ready',
            message: 'Update downloaded successfully!',
            detail: `Version ${info.version} has been downloaded and is ready to install.\n\nThe app will restart to apply the update.`,
            buttons: ['Restart Now', 'Later'],
            defaultId: 0
        }).then((result) => {
            if (result.response === 0) {
                // Quit and install update
                autoUpdater.quitAndInstall(false, true);
            }
        });
        
        // Reset window title
        if (mainWindow) {
            mainWindow.setTitle('Random Pokemon Generator');
        }
    });

    // Handle errors
    autoUpdater.on('error', (error) => {
        console.error('[UPDATER] Error:', error);
        if (mainWindow) {
            mainWindow.setTitle('Random Pokemon Generator');
        }
    });

    // No update available
    autoUpdater.on('update-not-available', () => {
        console.log('[UPDATER] App is up to date!');
    });
}

// Legacy manual check (fallback if electron-updater not configured)
function checkForUpdates(mainWindow) {
    // This is now just a wrapper that calls the auto-updater
    if (autoUpdater) {
        setupAutoUpdater(mainWindow);
    }
}

module.exports = { checkForUpdates, setupAutoUpdater, CURRENT_VERSION };
