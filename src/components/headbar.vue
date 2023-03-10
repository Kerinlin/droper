<template>
  <div class="header-wrapper">
    <div class="right-menu">
      <div class="icon-wrapper">
        <n-icon size="20" class="head-icon mr-10px" @click="openConfig">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M896 576V448h-103.04c-6.976-32-19.84-62.72-37.12-89.6l73.024-72.96-90.24-90.24L665.6 268.16c-26.88-17.28-57.6-30.08-89.6-37.12V128H448v103.04c-32 7.04-62.72 19.84-89.6 37.12L285.44 195.2 195.2 285.44 268.16 358.4c-17.28 26.88-30.08 57.6-37.12 89.6H128v128h103.04c7.04 32 19.84 62.72 37.12 89.6l-72.96 72.96 90.24 90.24 72.96-72.96c26.88 17.28 57.6 30.08 89.6 37.12V896h128v-103.04c32-6.976 62.72-19.84 89.6-37.12l72.96 73.024 90.24-90.24-73.024-73.6c17.344-26.944 30.144-57.024 37.204-89.024H896z m-227.2 1.92c-17.344 40.32-49.92 72.96-90.24 90.88h-0.64L576 666.24v3.2a165.568 165.568 0 0 1-128 0v-3.2l-1.92 2.56h-0.64c-40.32-17.28-72.96-49.92-90.24-90.24L357.76 576h-3.2a165.568 165.568 0 0 1 0-128h3.2l-2.56-1.92v-0.64c17.28-40.32 49.92-72.96 90.24-90.24l2.56 2.56v-3.2a165.568 165.568 0 0 1 128 0v3.2l2.56-2.56c40.32 17.28 72.96 49.92 90.24 90.24v0.64l-2.56 1.92h3.2a165.568 165.568 0 0 1 0 128h-2.56l1.92 1.92z"
            ></path>
          </svg>
        </n-icon>
        <n-icon size="20" class="head-icon mr-10px" @click="minimize">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M923 571H130.7c-27.6 0-50-22.4-50-50s22.4-50 50-50H923c27.6 0 50 22.4 50 50s-22.4 50-50 50z"
            ></path>
          </svg>
        </n-icon>
        <n-icon size="20" class="head-icon" @click="close">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5635">
            <path
              d="M576 512l277.333333 277.333333-64 64-277.333333-277.333333L234.666667 853.333333 170.666667 789.333333l277.333333-277.333333L170.666667 234.666667 234.666667 170.666667l277.333333 277.333333L789.333333 170.666667 853.333333 234.666667 576 512z"
            ></path>
          </svg>
        </n-icon>
      </div>
    </div>
    <configModal ref="configModalIns"></configModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { NIcon } from 'naive-ui';
import configModal from './configModal.vue';
const ipcRenderer = window?.ipcRenderer;
const configModalIns = ref(null);

const openConfig = () => {
  configModalIns.value.openModal();
};

const minimize = () => {
  ipcRenderer?.send('minimize');
};

const close = () => {
  ipcRenderer?.send('closeWindow');
};
</script>

<style lang="scss" scoped>
.header-wrapper {
  width: 100%;
  height: 45px;
  .right-menu {
    position: relative;
    .icon-wrapper {
      position: absolute;
      right: 10px;
      top: 5px;
      .head-icon {
        cursor: pointer;
        color: #fff;
        &:hover {
          color: #5b84ad;
          svg {
            fill: currentColor;
          }
        }
      }
    }
  }
}
</style>
