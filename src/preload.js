const { contextBridge: bridge, ipcRenderer, app } = require('electron');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
async function moveFile(filePath, targetPath) {
  try {
    await fse.move(filePath, targetPath, { overwrite: true });
    return true;
  } catch (error) {
    console.log(error);
  }
}
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
  move: moveFile,
  readFiles: (dirPath, callback) => {
    fs.readdir(dirPath, callback);
  },
});
// bridge.exposeInMainWorld('electronApp', {
//   configPath: path.dirname(app.getPath('exe')),
// });
