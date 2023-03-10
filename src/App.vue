<template>
  <div class="main-wrapper flex flex-col justify-start">
    <headbar class="header-container" />
    <router-view />
  </div>
</template>

<script setup>
import headbar from './components/headbar.vue';
</script>

<style lang="scss" scoped>
.main-wrapper {
  // background-color: #292c33;
  width: 100%;
  height: 100vh;
  background: url('@/assets/backgroundImage.png');
  background-repeat: no-repeat;
  background-size: cover;
  .header-container {
    width: 100%;
  }
}
</style>
