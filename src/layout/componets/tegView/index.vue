<template>
  <div class="tag_view_container bg-fff">
    <el-scrollbar ref="scrollContainer" class="scroll-container">
      <div class="tag_view_tags">
        <TransitionGroup name="list">
          <el-tag
            v-for="(items,index) in dynamicTags"
            :key="items.fullPath"
            class="tag_item u-cursor"
            :closable="items.closable"
            :type="active != items.fullPath?'info':''"
            :disable-transitions="false"
            @click="goToPage(items)"
            @close="handleClose(index, items)"
          >{{ items.meta.title }}</el-tag>
        </TransitionGroup>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
// 路由
const router = useRouter();
// vuex
const store = useStore();

const active = ref("");

const dynamicTags = computed(() => {
  return store.getters["tagsView/visitedViews"];
});
watch(
  () => router.currentRoute.value.fullPath,
  value => {
    // 添加信息
    let { fullPath, meta, name, path } = router.currentRoute.value;
    store.dispatch("tagsView/addView", {fullPath, meta, name, path, closable:path !== '/home'});
    active.value = value;
  },
  { immediate: true }
);
// 关闭tags标签
const handleClose = (index, item) => {
  // 关闭当前激活的标签
  if (active.value == item.path) {
    router.push({path:dynamicTags.value[index - 1]['path']})
  }
  dynamicTags.value.splice(index, 1);
};

const goToPage = items => {
  router.push({
    path: items.fullPath
  });
};
</script>

<style lang="scss" scoped>
.tag_view_container {
    padding: 8px 20px;
  .tag_view_tags {
    display: flex;
    .tag_item {
      margin-right: 10px;
      height: 35px;
      min-width: 60px;
    }
  }
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>