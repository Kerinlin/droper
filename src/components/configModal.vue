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
        <!-- <div class="modal-content">
          <div class="config-item flex flex-col">
            <span class="title">预设规则</span>
            <n-select
              v-model:value="keyword"
              filterable
              tag
              placeholder="请选择关键字"
              :options="computedList"
              :render-tag="renderTag"
              :max-tag-count="5"
            />
          </div>
          <div class="config-item flex-col">
            <span class="title">关键字</span>
          </div>
        </div> -->
        <template #footer>
          <div class="modal-footer">xxx</div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, defineExpose, h, computed } from 'vue';
import { randomColor } from '@/utils/utils';
import { NModal, NCard, NSelect, NInput, NTag } from 'naive-ui';
import { useStorage } from '@vueuse/core';
const ipcRender = window?.ipcRenderer;
let showModal = ref(false);
let keyword = ref(null);
let keywordOptions = ref([
  {
    label: '音效分类',
    value: 'music',
  },
]);

// const renderTag = ({ option }) => {
//   return h(
//     NTag,
//     {
//       color: option.color,
//       bordered: false,
//       closable: false,
//       onMousedown: e => {
//         e.preventDefault();
//       },
//     },
//     { default: () => option.label }
//   );
// };
// const state = useStorage(
//   'my-store',
//   { hello: 'hi', greeting: 'hello' },
//   localStorage,
//   { mergeDefaults: true } // <--
// );

const getSelectedKeyList = val => {
  console.log(val);
  keyword.value = val;
};

const computedList = computed(() => {
  let newList = [];
  newList = keywordOptions.value.map(item => {
    return {
      label: item.label,
      value: item.value,
      color: { color: randomColor(), textColor: '#fff' },
    };
  });
  return newList;
});
const openModal = () => {
  showModal.value = true;
  ipcRender?.send('loadConfig');
  ipcRender?.on('configDeatil', (e, data) => {
    console.log(data);
  });
};
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
  .modal-content {
    font-size: 12px;
    .config-item {
      .title {
        display: inline-block;
        white-space: nowrap;
        font-weight: 600;
        margin-bottom: 6px;
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
    .n-base-close {
      color: #fff;
    }
  }
}
</style>
