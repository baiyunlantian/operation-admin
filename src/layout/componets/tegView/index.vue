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
  const list = store.getters["tagsView/visitedViews"];
  const roleId = store.getters["user/roleId"];
  // console.log('computed dynamicTags start', roleId)
  // console.log('roleId', roleId)
  // console.log('list', list)
  // console.log('computed dynamicTags end', roleId)
  if (!roleId && roleId !== 0) {
    store.commit("tagsView/DEL_ALL_VISITED_VIEWS");
  }

  if (list.length === 0 && roleId >= 0) {
    // console.log('42')
    if (roleId == 10 || roleId === 20) {
      // console.log('44')
      store.dispatch("tagsView/addView", {
        fullPath: "/marketingData",
        meta: { title: "数据模块" },
        name: "marketingData",
        path: "/marketingData",
        closable: false,
      });
    } else if (roleId === 0 || roleId === 1) {
      // console.log('52 首页')
      store.dispatch("tagsView/addView", {
        fullPath: "/home",
        meta: { title: "首页" },
        name: "home",
        path: "/home",
        closable: false,
      });
    }
  } else if (list.length === 1 && roleId >= 0) {
    // console.log('61')
    if (roleId === 10 || roleId === 20) {
      // console.log('63')
      store.commit(
        "tagsView/ADD_VISITED_VIEW_IN_INDEX",
        {
          fullPath: "/marketingData",
          meta: { title: "数据模块" },
          name: "marketingData",
          path: "/marketingData",
          closable: false,
        },
        0
      );
    } else if (roleId === 0 || roleId === 1) {
      // console.log('67 首页')
      store.commit(
        "tagsView/ADD_VISITED_VIEW_IN_INDEX",
        {
          fullPath: "/home",
          meta: { title: "首页" },
          name: "home",
          path: "/home",
          closable: false,
        },
        0
      );
    }
  }

  return list;
});
watch(
  [
    () => router.currentRoute.value.fullPath,
    () => store.getters["user/roleId"],
  ],
  ([value, newRoleId]) => {
    const _roleId = localStorage.getItem("roleId");
    let roleId = _roleId ? _roleId : newRoleId;
    // 添加信息
    let { fullPath, meta, name, path } = router.currentRoute.value;
    // dynamicTags.value.forEach((val, index) => {
    //   if (val.path == "/agentDetail") {
    //     dynamicTags.value.splice(index, 1);
    //   }
    // });

    // console.log('watch start')
    // console.log('watch roleId', roleId)
    // console.log('watch path', path)
    // console.log('watch visitedViews', dynamicTags.value)
    // console.log('watch end')

    if (!roleId && roleId !== 0) {
      store.commit("tagsView/DEL_ALL_VISITED_VIEWS");
    } else {
      // 不添加结算商品页面tag
      if (path !== "/settleAccount") {
        let viewTag = {
          fullPath,
          meta,
          name,
          path,
          closable: path !== "/home",
        };
        if (path === "/marketingData" && (roleId == 10 || roleId == 20)) {
          viewTag.closable = false;
        }
        store.dispatch("tagsView/addView", viewTag);
        active.value = fullPath;
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
        query: query ? { [key]: value } : "",
      });
    }
    // dynamicTags.value.forEach((val, index) => {
    //   const agentDetailArr = [];
    //   if (val.path == "/agentDetail") {
    //     count++;
    //     agentDetailArr.push({ i: index });
    //     if (count > 1) {
    //       const query = fullPath && fullPath.split("?")[1];
    //       const key = query && query.split("=")[0];
    //       const value = query && query.split("=")[1];
    //       router.push({
    //         path: val.path,
    //         query: query ? { [key]: value } : "",
    //       });
    //       console.log(index);
    //       dynamicTags.value.splice(agentDetailArr[0].i, 1);
    //     }
    //   }
    // });
  },
  { immediate: true }
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