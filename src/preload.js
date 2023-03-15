const { contextBridge: bridge, ipcRenderer, app } = require('electron');
const fs = require('fs');
const fse = require('fs-extra');
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
  move: (filePath, targetPath, callback) => {
    fse.move(filePath, targetPath, { overwrite: true }, callback);
  },
  readFiles: (dirPath, callback) => {
    fs.readdir(dirPath, callback);
  },
});
// bridge.exposeInMainWorld('electronApp', {
//   configPath: path.dirname(app.getPath('exe')),
// });
