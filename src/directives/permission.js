export const permission = {
  // mounted是指令的一个生命周期
  mounted(el, binding) {
    // value 获取用户使用自定义指令绑定的内容
    const { value } = binding;
    // 获取用户所有的权限按钮
    const roleIdentity = computed(() => {
      return store.getters["user/info"].roleId;
    });
    // 判断用户使用自定义指令，是否使用正确了
    if (roleIdentity != value) {
      el.style.display = "none";
    } else {
      throw new Error("need roles!");
    }
  },
};
