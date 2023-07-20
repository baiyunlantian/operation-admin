<template>
    <div class="tab-nav" style="width: 100%; background:#242D3F;">
        <breadcrumb @toParent="toParent" :getNavPath="getNavPath" :mainNavList="getNavCtrl"></breadcrumb>
    </div>
</template>

<script setup>
  import breadcrumb from '@/components/breadcrumb/breadcrumb';
  import { ref, reactive } from 'vue';
  import { useStore } from 'vuex';
  const store = useStore()
  const getNavPath = ref(store.state.navCtrl.navPath)
  const getNavCtrl = reactive(store.state.navCtrl.navCtrl)
  console.log('store', store.state.navCtrl.navCtrl)

  function toParent() {
  }
</script>

<style scoped lang="scss">
    .tab-nav {
        background-color: #f7f7f7;
    }
</style>