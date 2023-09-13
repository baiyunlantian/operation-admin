export const permission = {
  // mounted是指令的一个生命周期
  mounted(el, binding) {
    // value 获取用户使用自定义指令绑定的内容
    const { value } = binding;
    // 获取roleId
    const roleId = Number(localStorage.getItem('roleId')) || 0;
    // 判断用户使用自定义指令，是否使用正确了
    if (Array.isArray(value)) {
      if (value.length === 0 || (value.length > 0 && value.includes(roleId))) return el;
      else el.style.display = "none";
    }else {
      console.error(`directives permission value is not a Array!`);
      el.style.display = "none";
    }
  },
};
