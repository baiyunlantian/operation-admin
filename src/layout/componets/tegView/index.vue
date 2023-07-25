<template>
  <div class="tag_view_container">
    <el-scrollbar ref="scrollContainer" class="scroll-container">
      <div class="tag_view_tags">
        <TransitionGroup name="list">
          <!-- :closable="items.closable" -->
          <el-tag
            v-for="(items,index) in dynamicTags"
            :key="items.fullPath"
            class="tag_item"
            :closable="!(items.meta&&items.meta['tagsDisabled'])"
            :type="active != items.fullPath?'info':''"
            :disable-transitions="false"
            @click="goToPage(items)"
            @close="handleClose(items,index)"
            effect="dark"
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
// 初始化页面
const initTags = list => {
  list.forEach((items, index) => {
    if (items.meta && items.meta["tagsDisabled"]) {
      let { meta, name, path } = items;
      store.dispatch("tagsView/addView", { fullPath: path, meta, name, path });
    }
    if (items.children) {
      initTags(items.children);
    }
  });
};
initTags(router.options.routes);

const dynamicTags = computed(() => {
  return store.getters["tagsView/visitedViews"];
});

// 关闭tags标签
const handleClose = (items, index) => {
  // 跳转上一个页面
  if (active.value == items.fullPath) {
    router.push({
      path: dynamicTags.value[index - 1].fullPath
    });
  }
  store.dispatch("tagsView/delView", items).then(res => {});
};
// 监听路由的变化添加标签
watch(
  () => router.currentRoute.value.fullPath,
  value => {
    // 添加信息
    let { fullPath, meta, name, path } = router.currentRoute.value;
    store.dispatch("tagsView/addView", { fullPath, meta, name, path });
    active.value = value;
  },
  { immediate: true }
);

// 页面跳转
const goToPage = items => {
  router.push({
    path: items.fullPath
  });
};
</script>

<style lang="scss" scoped>
.tag_view_container {
  background: #313c53;
  margin: 0 20px;
  padding: 10px 20px;
  border-radius: 10px 10px 0 0;
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
  transform: translateX(30px);
  // transform: rotate(90deg)
}
.el-tag {
  cursor: pointer;
}
</style>