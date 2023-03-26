import { ref } from 'vue';
import { toRefs } from '@vueuse/core';
const isDir = window?.fs?.isDir;
const move = window?.fs?.move;
const readFiles = window?.fs?.readFiles;
const nodePath = window?.nodePath?.path;
import { read, utils } from 'xlsx';
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

// 检索关键字并移动文件
export const handleMoveFile = (filePath, configList) => {
  return new Promise((resolve, reject) => {
    try {
      const { name, base } = nodePath.parse(filePath);
      const filename = name.toLowerCase();
      configList.map(async item => {
        const filteredKeywords = item?.keywords?.filter(keyword => keyword.trim() !== '');
        if (filteredKeywords?.length > 0) {
          let len = filteredKeywords.length;
          for (let i = 0; i < len; i++) {
            const keyword = filteredKeywords[i];
            if (filename.includes(keyword)) {
              console.log('匹配关键字', keyword);
              const targetPath = nodePath.join(item.targetDir, base);
              console.log(`路径: ${filePath} => ${targetPath}`);
              await move(filePath, targetPath);
            }
          }
        }
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

// 处理目录文件
export const handleDirPath = dirPath => {
  return new Promise((resolve, reject) => {
    readFiles(dirPath, (err, files) => {
      if (err) {
        console.log('获取文件失败');
        reject(err);
      }
      files = files.filter(file => file !== '.DS_Store');
      const handledFiles = files.map(file => {
        const fullPath = nodePath.join(dirPath, file);
        return fullPath;
      });
      resolve(handledFiles);
    });
  });
};

// 处理文件，如果是目录就递归，如果是文件就执行移动操作
export const handleFiles = (files, configList) => {
  return new Promise((resolve, reject) => {
    files.map(async filePath => {
      try {
        const isDirPath = isDir(filePath);
        if (isDirPath) {
          const files = await handleDirPath(filePath);
          handleFiles(files, configList);
        } else {
          await handleMoveFile(filePath, configList);
          resolve(true);
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  });

  // console.log();
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
