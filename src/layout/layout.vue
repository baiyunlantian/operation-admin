<template>
  <div>
    <sidebar />
    <tegView />
  </div>
  <div class="body">
    <router-view v-slot="{Component}">
      <Transition name="list">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>

    
<script setup>
  import { onMounted } from 'vue';
  import { useStore } from "vuex";
  import sidebar from "./componets/sidebar";
  import tegView from "./componets/tegView";

  const store = useStore();

  onMounted(() => {
    store.dispatch('platformType/getPlatformTypeList')
  })

</script>

<style scoped lang="scss">
  .el-header{
    padding: 0;
  }

  .body{
    padding: 10px 20px 5px 20px;
    flex: 1;
    background-color: #eaedf7;

    >div{
      height: 100%;
    }
  }

  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
    // transform: rotate(90deg)
  }
  // sidebar + tegView = 102px
  .body {
    height: calc(100vh - 102px);
    overflow: auto;
  }
</style>