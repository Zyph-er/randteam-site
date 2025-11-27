const { app, BrowserWindow } = require('electron');
const path = require('path');
const { setupAutoUpdater } = require('./updater');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
        },
        icon: path.join(__dirname, 'appicon.jpg'),
        title: 'Random Pokemon Generator',
        backgroundColor: '#1a1a1a',
        show: false // Don't show until ready
    });

    // Load the index.html file
    mainWindow.loadFile('index.html');

    // Show window when ready to prevent visual flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        
        // Setup auto-updater after window is shown
        setTimeout(() => {
            setupAutoUpdater(mainWindow);
        }, 2000); // Wait 2 seconds before checking
    });

    // Open DevTools in development mode
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Create window when app is ready
app.whenReady().then(() => {
    createWindow();

    // On macOS, re-create window when dock icon is clicked
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle app errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
