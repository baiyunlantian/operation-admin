<template>
  <div class="tag_view_container bg-fff">
    <el-scrollbar ref="scrollContainer" class="scroll-container">
      <div class="tag_view_tags">
        <TransitionGroup name="list">
          <el-tag
            v-for="(items, index) in dynamicTags"
            :key="items.fullPath"
            class="tag_item u-cursor"
            :closable="items.closable"
            :type="active != items.fullPath ? 'info' : ''"
            :disable-transitions="false"
            @click="goToPage(items)"
            @close="handleClose(index, items)"
            >{{ items.meta.title }}</el-tag
          >
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
  (value) => {
    // 添加信息
    let { fullPath, meta, name, path } = router.currentRoute.value;

    // 不添加结算商品页面tag
    if (path !== "/settleAccount") {
      store.dispatch("tagsView/addView", {
        fullPath,
        meta,
        name,
        path,
        closable: path !== "/home",
      });
      active.value = value;
    }
    // 结算商品页面刷新时保留商品目录tag
    else {
      store.dispatch("tagsView/addView", {
        fullPath: "/product",
        meta: { title: "商品目录", permission: [10, 20, 0, 1] },
        name: "product",
        path: "/product",
        closable: true,
      });
      active.value = "/product";
    }
  },
  { immediate: true }
);
// 关闭tags标签
const handleClose = (index, item) => {
  console.log(index, item, active.value);
  // 关闭当前激活的标签
  const currPath = active.value.split("?")[0];
  if (currPath == item.path) {
    router.push({ path: dynamicTags.value[index - 1]["path"] });
  }
  dynamicTags.value.splice(index, 1);
};

const goToPage = (items) => {
  console.log(items);
  const query = items.fullPath && items.fullPath.split("?")[1];
  const key = query && query.split("=")[0];
  const val = query && query.split("=")[1];
  router.push({
    path: items.path,
    query: query ? { [key]: val } : "",
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