const { contextBridge: bridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
bridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, fun) => ipcRenderer.on(channel, fun),
  selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),
});

bridge.exposeInMainWorld('nodePath', {
  path,
});

bridge.exposeInMainWorld('fs', {
  isDir: path => fs.statSync(path).isDirectory(),
});
bridge.exposeInMainWorld('electronApp', {
  configPath: path.join(__dirname, 'config1.yml'),
});
