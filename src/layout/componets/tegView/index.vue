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
import MENULIST from "../sidebar/menuList";
// 路由
const router = useRouter();
// vuex
const store = useStore();

const active = ref("");

const getMenuItem = (menuList, menuName, res) => {
  let result = res || {};
  for (const menu of menuList) {
    if (menu.name === menuName) {
      result = menu;
      break;
    }else if (menu.children && menu.children.length > 0) {
      result = getMenuItem(menu.children, menuName, result)
    }
  }

  return result
}

const dynamicTags = computed(() => {
  const list = store.getters["tagsView/visitedViews"];
  const roleId = localStorage.getItem("roleId");
  const tagsLength = list.length;

  if (roleId && (tagsLength === 0 || tagsLength === 1)) {
    const defaultMenu = roleId === '10' || roleId === '20' ? '数据页面' : '首页';
    const matchItem = getMenuItem(MENULIST, defaultMenu);

    if (matchItem) {
      const {name, path, permission} = matchItem;
      const tagView = {
        fullPath: path,
        meta: {title: name, permission},
        name: path.substr(1, path.length),
        path,
        closable: false,
      };

      if (tagsLength === 0) {
        store.dispatch("tagsView/addView", tagView);
      }else if (tagsLength === 1) {
        store.commit("tagsView/SPLICE_VISITED_VIEW", tagView, 0);
      }
    }
  }

  return list;
});
watch(() => router.currentRoute.value.fullPath,
        (value) => {
          const roleId = localStorage.getItem("roleId");
          // 添加信息
          let {fullPath, meta, name, path} = router.currentRoute.value;

          // 不添加结算商品页面tag
          if (path !== "/settleAccount") {
            let viewTag = {
              fullPath,
              meta,
              name,
              path,
              closable: path !== "/home",
            };
            if (path === "/marketingData" && (roleId === "10" || roleId === "20")) {
              viewTag.closable = false;
            }
            store.dispatch("tagsView/addView", viewTag);
            active.value = fullPath;
          }
          // 结算商品页面保留商品目录tag
          else {
            const matchItem = getMenuItem(MENULIST, '商品目录');
            if (matchItem) {
              const {name, path, permission} = matchItem
              store.dispatch("tagsView/addView", {
                fullPath: path,
                meta: {title: name, permission},
                name: path.substr(1, path.length),
                path,
                closable: true,
              });
              active.value = path;
            }
          }

          // 替换‘代理详情’，不出现两个相同的标签
          const firstIndex = dynamicTags.value.findIndex((val) => {
            return val.path == "/agentDetail";
          });
          const lastIndex = dynamicTags.value.findLastIndex((val) => {
            return val.path == "/agentDetail";
          });
          if (firstIndex != -1 && firstIndex !== lastIndex) {
            const query = fullPath && fullPath.split("?")[1];
            const key = query && query.split("=")[0];
            const value = query && query.split("=")[1];
            dynamicTags.value.splice(firstIndex, 1);
            router.push({
              path: path,
              query: query ? {[key]: value} : "",
            });
          }
        },
        { immediate: true, deep:true }
);

// 重定向的路径
const pushOpt = (items, path) => {
  const query = items.fullPath && items.fullPath.split("?")[1];
  const key = query && query.split("=")[0];
  const val = query && query.split("=")[1];
  router.push({
    path: items.path,
    query: query ? { [key]: val } : "",
  });
};

// 关闭tags标签
const handleClose = (index, item) => {
  // console.log(index, item, active.value);
  // 关闭当前激活的标签
  const currPath = active.value.split("?")[0];
  if (currPath == item.path) {
    const route = dynamicTags.value[index - 1];
    // console.log(route);
    pushOpt(route, route.path);
    // router.push({ path: dynamicTags.value[index - 1]["path"] });
  }
  dynamicTags.value.splice(index, 1);
};

const goToPage = (items) => {
  // console.log(items);
  pushOpt(items, items.path);
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