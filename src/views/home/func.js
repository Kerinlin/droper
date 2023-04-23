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
export const handleMoveFile = async (filePath, configList) => {
  const { name, base } = nodePath.parse(filePath);
  const reg = /[`~_!-@#$^&*%()=|{}':;',.<>\\/?~！@#￥……&*（）——|{}'；：""'。，、？\s]/g;
  let lowerName = name.toLowerCase();
  const filename = lowerName.replace(reg, " ");
  // console.log({ filename });
  const regex = /(.*?)【(.*)】/; // 匹配左右括号中的任意字符，非贪婪模式
  const result = filename.match(regex);
  const part1 = result[1]; // 获取匹配到的左括号前面的内容
  const part2 = result[2]; // 获取匹配到的括号中的内容
  console.log(part1); // 输出：xxhdsf 神神叨叨 
  console.log(part2); // 输出：test sscd
  const movedFiles = {};

  for (const item of configList) {
    const filteredKeywords = item?.keywords?.filter(keyword => keyword.trim() !== '');
    if (filteredKeywords?.length > 0) {
      const anyKeywordMatched = filteredKeywords.some(keyword => {
        const subKeywords = keyword.toLowerCase().split(' ');
        return subKeywords.every(subKeyword => {
          const regex = new RegExp(`\\b${subKeyword}\\b`, 'i');
          if (regex.test(filename)) {
            return true;
          }
        });
      });
      if (anyKeywordMatched) {
        console.log('匹配关键字', filteredKeywords.join(','));
        const dir = nodePath.join(item.targetDir, base);
        let moved = (await Promise.all(Object.values(movedFiles).map(async (movedDir) => {
          if (movedDir === dir) {
            console.log(`文件 ${filePath} 已经被移动到目录 ${dir}或者文件名中包含【】，跳过移动操作`);
            return true;
          } else {
            return false;
          }
        }))).some(result => result);

        if (!moved) {
          console.log(`移动文件 ${filePath} 到目录 ${dir}`);
          await move(filePath, dir);
          movedFiles[filePath] = dir;
        }
        break;
      }
    }
  }
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
