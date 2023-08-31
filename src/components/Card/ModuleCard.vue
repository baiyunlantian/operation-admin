<template>
  <div class="module-card">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.module-card {
  padding: 24px;
  background-color: #fff;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-bottom: 16px;
}
</style>
