const { ipcRenderer } = require('electron');

document.getElementById('version').innerText = require('./package.json').version;

const checkForUpdatesBtn = document.getElementById('checkForUpdates');
const messageElement = document.getElementById('message');
const nameAnimation = document.getElementById('name-animation');

checkForUpdatesBtn.addEventListener('click', () => {
  ipcRenderer.send('check-for-updates');
  messageElement.innerText = 'Checking for updates...';
});

ipcRenderer.on('update-not-available', () => {
  messageElement.innerText = 'You are using the latest version.';
});

ipcRenderer.on('update-available', () => {
  messageElement.innerText = 'A new update is available. Downloading now...';
});

ipcRenderer.on('update-downloaded', () => {
  messageElement.innerText = 'Update downloaded. It will be installed on restart.';
});

ipcRenderer.on('error', (event, error) => {
  messageElement.innerText = `Error: ${error}`;
});

// Add interactivity to the name animation
nameAnimation.addEventListener('click', () => {
  nameAnimation.style.animation = 'none';
  setTimeout(() => {
    nameAnimation.style.animation = '';
  }, 10);
});

// Check for updates when the app starts
ipcRenderer.send('check-for-updates');