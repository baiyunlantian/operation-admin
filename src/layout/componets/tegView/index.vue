<template>
  <div class="tag_view_container">
    <el-scrollbar ref="scrollContainer" class="scroll-container">
      <div class="tag_view_tags">
        <TransitionGroup name="list">
          <el-tag
            v-for="(items,index) in dynamicTags"
            :key="items.fullPath"
            class="tag_item"
            :closable="items.closable"
            :type="active != items.fullPath?'info':''"
            :disable-transitions="false"
            @click="goToPage(items)"
            @close="handleClose(index)"
          >{{ items.meta.title }}</el-tag>
        </TransitionGroup>
      </div>
    </el-scrollbar>
    <div>{{test}}</div>
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
    store.dispatch("tagsView/addView", {fullPath, meta, name, path});
    active.value = value;
  },
  { immediate: true }
);
// 关闭tags标签
const handleClose = index => {
  dynamicTags.splice(index, 1);
};

const goToPage = items => {
  router.push({
    path: items.fullPath
  });
};
</script>

<style lang="scss" scoped>
.tag_view_container {
    background: #eaedf7;
    padding: 5px 20px;
  .tag_view_tags {
    display: flex;
    .tag_item {
      margin-right: 10px;
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