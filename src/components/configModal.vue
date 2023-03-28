<template>
  <div class="config-wrapper">
    <n-modal v-model:show="showModal">
      <n-card
        class="modal-wrapper"
        title="设置"
        :bordered="false"
        :closable="true"
        size="medium"
        role="dialog"
        :on-close="() => (showModal = false)"
        aria-modal="true"
      >
        <div class="modal-content">
          <div class="config-item space-between">
            <div class="flex-start">
              <span class="inline-block fw600 whitespace-nowrap mr-10px">配置文件</span>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <p class="w-300px path truncate cursor-pointer" @click="openDir">{{ configPath }}</p>
                </template>
                {{ configPath }}
              </n-tooltip>
            </div>
            <div class="right-wrapper">
              <n-button size="small" strong secondary type="success" @click="importConfig"> 导入 </n-button>
              <n-button size="small" strong secondary type="error" style="margin-left: 5px" @click="openDir">
                导出
              </n-button>
            </div>
          </div>
          <div class="config-item flex flex-col">
            <span class="title">音效路径</span>
            <div class="operation-wrapper flex-start">
              <n-select
                v-model:value="configName"
                class="mr-5px"
                label-field="name"
                value-field="name"
                filterable
                placeholder="请选择配置"
                :options="configList"
                size="small"
                :on-update:value="getSelectedConfig"
              />
              <n-button size="small" strong secondary type="success" @click="addConfig"> 添加 </n-button>
              <n-button size="small" strong secondary type="error" style="margin-left: 5px" @click="deleteConfig">
                删除
              </n-button>
            </div>
          </div>
          <div class="config-item flex-col mt-10px">
            <span class="title">关键字</span>
            <n-dynamic-tags v-model:value="keywords" :render-tag="renderTag" :on-update:value="getAllKeys" />
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, defineExpose, h, onMounted } from 'vue';
import { randomColor } from '@/utils/utils';
import { NModal, NCard, NSelect, NTag, NDynamicTags, NButton, NTooltip } from 'naive-ui';
let showModal = ref(false);
let keywords = ref([]);
let configName = ref(null);
let configPath = ref(null);
let configList = ref([]);
const ipcRenderer = window?.ipcRenderer;
const renderTag = (tag, index) => {
  return h(
    NTag,
    {
      color: {
        color: randomColor(),
        textColor: '#fff',
      },
      closable: true,
      bordered: false,
      round: true,
      onClose: () => {
        keywords.value.splice(index, 1);
        changeConfig();
      },
    },
    {
      default: () => tag,
    }
  );
};

// 获取所有关键字
const getAllKeys = value => {
  keywords.value = value;
  configList.value.forEach(item => {
    if (item.name == configName.value) {
      item.keywords = keywords.value;
    }
  });
  changeConfig();
};

// 修改配置文件
const changeConfig = () => {
  let configData = {
    configPath: configPath.value,
    config: {
      config: configList.value,
    },
  };
  // console.log('配置文件', configData);
  ipcRenderer.send('setConfig', JSON.stringify(configData));
};

const getSelectedConfig = (val, option) => {
  configName.value = val;
  localStorage.setItem('configName', val);
  keywords.value = option.keywords;
};

const addConfig = () => {
  ipcRenderer.send('selectDir');
};

const deleteConfig = () => {
  configList.value.map((item, index) => {
    if (item.name == configName.value) {
      configList.value.splice(index, 1);
    }
  });
  localStorage.removeItem('configName');
  console.log('删除后的配置', configList.value);
  changeConfig();
};

const openDir = () => {
  ipcRenderer.send('openDir', configPath.value);
};

const importConfig = () => {
  ipcRenderer.send('selectFile');
};

const openModal = () => {
  let remotePath = localStorage.getItem('configPath');
  if (remotePath) {
    ipcRenderer?.send('loadConfig', remotePath);
  }
  showModal.value = true;
};

onMounted(() => {
  // 新配置
  ipcRenderer?.on('newConfig', (e, path) => {
    console.log(path);
    localStorage.removeItem('configPath');
    if (path) {
      localStorage.setItem('configPath', path);
      configPath.value = path;
      ipcRenderer?.send('loadConfig', path);
    }
  });

  // 获取配置内容
  ipcRenderer?.on('configDeatil', (e, data) => {   
    let remoteName = localStorage.getItem('configName');
    configList.value = data.data.config;
    configPath.value = data.path;
    // console.log({ remoteName });
    if (!remoteName) {
      localStorage.getItem('configName', configList.value[0]?.name);
      configName.value = configList.value[0]?.name;
      keywords.value = configList.value[0]?.keywords;
    } else {
      configName.value = remoteName;
      configList.value.map(item => {
        if (item.name == remoteName) {
          keywords.value = item.keywords;
        }
      });
    }
  });

  ipcRenderer.on('addConfig', (e, data) => {
    let configItem = {
      name: data.baseName,
      describe: data.baseName,
      keywords: [],
      targetDir: data.fullPath,
    };
    configList.value.push(configItem);
    changeConfig();
  });
});
defineExpose({
  openModal,
});
</script>

<style lang="scss" scoped>
.modal-wrapper {
  width: 550px;
  position: fixed;
  left: 50%;
  top: 45px;
  transform: translateX(-50%);
   -webkit-app-region: no-drag;
  .modal-content {
    font-size: 14px;
    .config-item {
      .title {
        display: inline-block;
        white-space: nowrap;
        font-weight: 600;
        margin-bottom: 6px;
      }
      // .path{
      //   display: inline-block;
      // }
      &::v-deep {
        .n-base-close {
          color: #fff;
        }
      }
    }
  }
  &::v-deep {
    .n-card-header {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
  &::v-deep {
    .n-select {
      .n-base-selection-placeholder__inner {
        font-size: 12px;
      }
    }
    .n-tag {
      font-size: 12px;
    }
  }
}
</style>
