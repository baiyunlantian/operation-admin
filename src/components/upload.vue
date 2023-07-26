<template>
  <div>
    <!-- :on-preview="handlePictureCardPreview" -->
    <el-upload
      v-model:fileList="fileList"
      class="upload-demo"
      :class="{hide: uploadHide}"
      action="#"
      :http-request="httpUploadCos"
      :list-type="listType"
      :limit="limit"
      v-bind="$attrs"
    >
      <slot>
        <el-icon>
          <Plus />
        </el-icon>
      </slot>
      <!-- 文件操作 -->
      <template #file="{ file }">
        <slot name="file" :file="file"></slot>
      </template>
    </el-upload>
  </div>
</template>
<script setup>
import { ref, defineProps, watch, computed, reactive, defineEmits } from "vue";
import { getAuthorization } from "@/api/cosUpload.js";
import { cosUploadImage } from "@/utils/cosUpload.js";
import { ElLoading, ElMessage } from "element-plus";

const emits = defineEmits(["update:fileList"]);
// 上传类型图片为1
const typeObj = reactive({
  png: "1",
  jpeg: "1"
});

const props = defineProps({
  // 初始化图片数组
  fileList: {
    type: Array,
    default: () => []
  },
  limit: {
    type: Number,
    default: 0
  },
  listType: {
    type: String,
    default: "picture-card"
  },
  onSuccess: {
    type: Function,
    default: () => {}
  },
  onError: {
    type: Function,
    default: () => {}
  }
});

const timer = ref("");

const uploadMessageTips = () => {
  if (timer.value) {
    clearTimeout(timer.value);
  }
  timer.value = setTimeout(() => {
    ElMessage.error("上传失败");
  }, 1000);
};

const fileList = ref(props.fileList);

const uploadHide = computed(() => {
  if (props.limit != 0) {
    return fileList.value.length >= props.limit;
  }
  return false;
});

// 上传前的钩子
const beforeUpload = file => {
  let isUpload = true;
  isUpload = props.beforeUpload(file);
  // 判断是否为undefined undefined 默认true,否则为false
  if (isUpload !== undefined && !isUpload) {
    return isUpload;
  }
  // 前置判断条件

  // 需要请求接口获取cos参数
};

// 文件上传
const httpUploadCos = async file => {
  // cos名称
  let headers = {
    TmpSecretId: "",
    TmpSecretKey: "",
    DomainName: "",
    SecurityToken: "",
    ExpiredTime: "1580000900"
  };
  // 桶类型
  let bodys = {
    cosBucket: "",
    cosRegion: "",
    fileName: ""
  };
  // 获取文件类型
  let type = file.file.type.split("/")[1];

  /*==================================cos桶参数处理================================================= */
  let resData = await getAuthorization({
    type: typeObj[type],
    fileSuffix: type,
    fileCount: 1
  });

  // cos校验
  headers.TmpSecretId = resData.data.tmpSecretId;
  headers.TmpSecretKey = resData.data.tmpSecretKey;
  headers.DomainName = resData.data.domainName;
  headers.SecurityToken = resData.data.securityToken;
  // headers.ExpiredTime = resData.data.expiredTime;
  // cos桶地址数量拼接
  bodys.cosBucket = resData.data.bucketName;
  bodys.cosRegion = resData.data.region;
  // 单个文件上传
  bodys.fileName = `${resData.data.filePath}/${resData.data.fileNames[0]}`;
  /*==================================cos桶参数处理================================================= */

  let uid = file.file.uid;
  file.onProgress({ percent: 0 });
  // 实现数值回传
  cosUploadImage(
    headers,
    bodys.cosBucket,
    bodys.cosRegion,
    bodys.fileName,
    file.file,
    (err, data) => {
      if (err) {
        // 关闭进度条
        file.onError();
        // 筛选列表
        fileList.value = fileList.value.filter(items => items.uid != uid);
        // 提示弹框
        uploadMessageTips();
        // 错误回调
        props.onError(file);
        // 同步父组件
        emits("update:fileList", fileList.value);
      } else {
        console.log(data);
        // 关闭进度条
        file.onSuccess();
        // 替换url
        fileList.value = fileList.value.map(items => {
          // 需要替换成功url
          if (items.uid == uid) {
            items.url = `${headers.DomainName}/${data.Key}`;
          }
          /**
           * 需要设定数据规范 || 暂时未定
           */
          return { ...items };
        });
        // 成功回调
        props.onSuccess(file);
        // 同步到父组件
        emits("update:fileList", fileList.value);
      }
    }
  );
};

// 图片放大
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handlePictureCardPreview = uploadFile => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};

const handleDownload = file => {
  console.log(file);
};
</script>

<style lang="scss" scoped>
.hide{
  :deep .el-upload--picture-card{
    display: none;
  }
}
</style>