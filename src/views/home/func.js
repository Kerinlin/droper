import { ref } from 'vue';
import { toRefs } from '@vueuse/core';
const isDir = window?.fs?.isDir;
import { read, utils } from 'xlsx';

// const nodePath = window?.nodePath?.path;
// 处理拖拽文件
export const useDropFile = files => {
  let fileObj = {
    // 拖拽进来的文件夹路径数组
    dropedDirPaths: [],
    // 拖拽进来的文件数组
    dropedFilePaths: [],
  };
  if (files.length > 0) {
    files.map(item => {
      isDir(item.path) ? fileObj.dropedDirPaths.push(item.path) : fileObj.dropedFilePaths.push(item.path);
    });
  }
  return {
    ...toRefs(ref(fileObj)),
  };
};

// 处理表格
export const handleXlsx = data => {
  const workbook = read(data);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = utils.sheet_to_json(worksheet);
  const handledJsonData = jsonData.map(item => {
    if (!item.keywords) {
      item.keywords = [];
    }
    if (item?.keywords?.length > 0) {
      item.keywords = item.keywords?.split(',');
    }
    return item;
  });
  return handledJsonData;
};

export const handleConfigRule = list => {
  console.log(list);
};
