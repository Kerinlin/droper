const { contextBridge: bridge, ipcRenderer } = require('electron');
const fs = require('fs');

bridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, fun) => ipcRenderer.on(channel, fun),
  selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),
});

bridge.exposeInMainWorld('node', {
  fs,
});
