const { ipcMain, app } = require('electron');
const YAML = require('yamljs');
const path = require('path');
const handleIpcMessage = win => {
  ipcMain.on('minimize', () => {
    console.log('接收到最小化指令');
    win.minimize();
  });
  ipcMain.on('closeWindow', () => {
    console.log('接收到关闭指令');
    app.exit();
  });
  ipcMain.on('loadConfig', () => {
    console.log('读取配置项');
    const nativeObject = YAML.load(path.resolve(__dirname, 'config.yml'));
    win.webContents.send('configDeatil', nativeObject);
  });
};

module.exports = {
  handleIpcMessage,
};
