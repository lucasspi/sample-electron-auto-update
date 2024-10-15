// Conditionally load dotenv
try {
  require('dotenv').config();
} catch (err) {
  console.log('dotenv not found, skipping load');
}

const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

const APP_NAME = 'ElectronUpdateTest';
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

function logInstallInfo() {
  console.log('Application path:', app.getAppPath());
  console.log('Executable path:', process.execPath);
  console.log('App data path:', app.getPath('appData'));
  console.log('User data path:', app.getPath('userData'));
}

app.on('ready', () => {
  logInstallInfo();
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('check-for-updates', () => {
  autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.on('restart-app', () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
  mainWindow.webContents.send('checking-for-update');
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available.', info);
  mainWindow.webContents.send('update-available');
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available.', info);
  mainWindow.webContents.send('update-not-available');
});

autoUpdater.on('error', (err) => {
  console.error('Error in auto-updater. ', err);
  mainWindow.webContents.send('error', err.toString());
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message);
  mainWindow.webContents.send('download-progress', progressObj);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded', info);
  mainWindow.webContents.send('update-downloaded');
});