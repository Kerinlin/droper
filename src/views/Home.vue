<template>
  <div class="home flex flex-col items-center" @drop.prevent="addFile" @dragover.prevent>
    <div class="input-wrapper">
      <label for="getFiles">
        <div v-if="path" class="filename">
          {{ path }}
        </div>
      </label>
      <input id="getFiles" type="file" webkitdirectory directory @change="getFile" />
    </div>
    <n-tooltip trigger="hover">
      <template #trigger>
        <button class="button" @click="start(path)"></button>
      </template>
      点击头上任意区域或者直接拖拽文件到软件内，然后点击我就能开始分类了
    </n-tooltip>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { NTooltip } from 'naive-ui';
let path = ref(null);

// 拖拽文件夹
const addFile = e => {
  console.log(e);
};

const getFile = e => {
  console.log('sss');
  console.log(e);
};
const start = path => {
  console.log(path);
};

onMounted(() => {
  // console.log('AAA');
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
      font-size: 16px;
      line-height: 150px;
      margin: 0 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    input[type='file'] {
      opacity: 0;
      position: absolute;
      z-index: -1;
    }
  }
}
.button {
  margin-top: 18px;
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
