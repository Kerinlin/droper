<template>
  <n-message-provider>
    <div class="main-wrapper flex flex-col justify-start">
      <headbar class="header-container" />
      <router-view />
    </div>
  </n-message-provider>
</template>

<script setup>
import { NMessageProvider } from 'naive-ui';
import headbar from './components/headbar.vue';
</script>

<style lang="scss" scoped>
.main-wrapper {
  // background-color: #292c33;
  width: 100%;
  height: 100vh;
  background-image: url('https://i.328888.xyz/2023/03/26/iDMp2Q.png');
  background-size: cover;
  .header-container {
    width: 100%;
  }
}
</style>
