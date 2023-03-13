const { ipcMain, app, shell, dialog } = require('electron');
const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs');
const handleIpcMessage = win => {
  ipcMain.on('minimize', () => {
    console.log('接收到最小化指令');
    win.minimize();
  });
  ipcMain.on('closeWindow', () => {
    console.log('接收到关闭指令');
    app.exit();
  });

  // 打开文件夹
  ipcMain.on('openDir', (e, data) => {
    shell.showItemInFolder(data);
  });

  // 读取发送配置到渲染进程
  ipcMain.on('loadConfig', (e, configPath) => {
    console.log('读取配置项');
    let contents = fs.readFileSync(configPath, 'utf8');
    let data = yaml.load(contents);
    let configData = {
      path: configPath,
      data: data,
    };
    e.reply('configDeatil', configData);
  });

  // 写入配置
  ipcMain.on('setConfig', async (e, data) => {
    console.log('写入配置项', data);
    const configData = JSON.parse(data);
    let config = yaml.dump(configData.config);
    e.reply('newConfig', configData.configPath);
    fs.writeFileSync(configData.configPath, config, 'utf8');
  });

  // 选择文件导入
  ipcMain.on('selectFile', e => {
    dialog
      .showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'YML files', extensions: ['yml'] }],
      })
      .then(result => {
        console.log(result.filePaths);
        e.reply('newConfig', result.filePaths[0]);
      })
      .catch(err => {
        console.log(err);
      });
  });

  // 选择文件夹
  ipcMain.on('selectDir', e => {
    dialog
      .showOpenDialog({ properties: ['openDirectory'] })
      .then(result => {
        // console.log(result.canceled);
        // console.log(result.filePaths);
        if (!result.canceled) {
          let data = {
            baseName: path.basename(result.filePaths[0]),
            fullPath: result.filePaths[0],
          };
          e.reply('addConfig', data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  });
};

module.exports = {
  handleIpcMessage,
};
