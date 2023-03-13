<template>
  <div class="home flex flex-col items-center" @drop.prevent="addFile" @dragover.prevent>
    <div class="input-wrapper">
      <label for="getFiles">
        <div v-if="logContent" class="filename">
          {{ logContent }}
        </div>
      </label>
    </div>
    <n-tooltip trigger="hover">
      <template #trigger>
        <button class="button" @click="start"></button>
      </template>
      直接拖拽文件到软件内，然后点击我就能开始分类了
    </n-tooltip>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { NTooltip, useMessage } from 'naive-ui';
import { useDropFile, handleXlsx } from './func';

let configList = ref([]);
let logContent = ref(null);
let dropedFiles = ref([]);
const ipcRenderer = window?.ipcRenderer;
const nodePath = window?.nodePath?.path;
const configPath = window?.electronApp?.configPath;
const message = useMessage();
console.log(configPath);

// 拖拽文件夹
const addFile = async e => {
  dropedFiles.value = [...e.dataTransfer.files];
  const file = dropedFiles.value[0];
  if (file.name == '音效关键字.xlsx') {
    const f = e.dataTransfer.files[0];
    const data = await f.arrayBuffer();
    const excelData = handleXlsx(data);
    console.log({ excelData });
    let configData = {
      configPath: configPath,
      config: {
        config: excelData,
      },
    };
    localStorage.removeItem('configPath');
    localStorage.removeItem('configName');
    localStorage.setItem('configPath', configPath);
    localStorage.setItem('configName', excelData[0]?.name);
    ipcRenderer.send('setConfig', JSON.stringify(configData));
    message.success('导入配置成功');
  }
  logContent.value = '🚀🚀🚀 文件准备就绪，随时开动 🚀🚀🚀';
};

const start = () => {
  const { dropedDirPaths, dropedFilePaths } = useDropFile(dropedFiles.value);
  const dirPathArray = dropedDirPaths.value;
  const filePathArray = dropedFilePaths.value;
  if (dirPathArray.length > 0) {
    console.log(dirPathArray.length);
  }

  if (filePathArray.length > 0) {
    console.log(filePathArray.length);
    filePathArray.map(filePath => {
      const { name } = nodePath.parse(filePath);
      console.log(name);
    });
  }
};

onMounted(() => {
  const configPath = localStorage.getItem('configPath');
  if (configPath) {
    ipcRenderer?.send('loadConfig', configPath);
  }
  ipcRenderer?.on('configDeatil', (e, data) => {
    configList.value = data?.data?.config;
  });
});
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: calc(100vh - 45px);
  margin-top: 20px;
  .input-wrapper {
    width: 100%;
    height: 150px;
    position: relative;
    label {
      display: inline-block;
      width: 100%;
      height: 100%;
      cursor: pointer;
      display: block;
      text-align: center;
      color: #fff;
      background-color: transparent;
      border-radius: 4px;
      // border: 2px dashed #e0dfd5;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .filename {
      width: 100%;
      font-size: 14px;
      line-height: 150px;
      margin: 0 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 600;
    }
    input[type='file'] {
      opacity: 0;
      position: absolute;
      z-index: -1;
    }
  }
}
.button {
  margin-top: 70px;
  -webkit-app-region: no-drag;
  height: 85px;
  width: 200px;
  border: 1px dashed transparent;
  outline: none;
  background-color: transparent;
  border-radius: 1px;
  color: #fff;
  font-size: 20px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s ease-out;
  // &:hover {
  //   border-color: rgb(118, 110, 120);
  //   color: rgb(118, 110, 120);
  //   border-radius: 16px 4px;
  // }
}
</style>
