// 图片前缀路径
const imagePrefix = "/images/";
export const getAssetURL = (img) => {
  return new URL(imagePrefix + `${img}`, import.meta.url).href;
};

export const getBgURL = (img) => {
  return `url(${imagePrefix}${img}.png)`;
};
