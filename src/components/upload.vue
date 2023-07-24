<template>
  <div>
    <!-- :on-preview="handlePictureCardPreview" -->
    <el-upload
      v-model:fileList="fileList"
      class="upload-demo"
      action="#"
      :http-request="httpUploadCos"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      list-type="picture-card"
      :limit="limit"
      multiple
    >
      <el-icon>
        <Plus />
      </el-icon>
      <!-- 文件操作 -->
      <template #file="{ file }">
        <slot name="file" :file="file"></slot>
      </template>
    </el-upload>
  </div>
</template>
<script setup>
import { ref, defineProps, watch, reactive, defineEmits } from "vue";
import { cosUploadImage } from "@/utils/cosUpload.js";
import { ElLoading, ElMessage } from "element-plus";

const emits = defineEmits(["update:fileList"]);
// 请求前需要获取token信息 需要授权cos
const headers = reactive({
  TmpSecretId:
    "AKIDXAwByUdqoUR9MVeK3qklSudk18QvuaGU_g6RJVzq86KO_C0rBDdBj5TCYltKFv4m",
  TmpSecretKey: "TTZQIVwPyYsFbJRaj4Fe5InayIU77OUa+etXAay9Uag=",
  DomainName: "https://test-image-1318483234.cos.ap-guangzhou.myqcloud.com/",
  SecurityToken:
    "K9aiVnZ9QDZyTe0BhVRuM6VLpXFqNnPa1539f36e5fb88339141d48dd353283e6oh3GMQPWK_HUvfSebBvWT0ovAOoJqyFCGazBNxKF5ak9IMh3TPx1prLMvR1eR58EA6pavXaGoGHN7TLYcZf4Qj1hNWQbnjW9INfGbKMMucDImPEqDFVnmlc0ASwFf1eSZlrqn2JVtghc1OMDUobBA98snwvcTRWYvBqep5R4OkwLa1stjNO8-0WjxiT3KLp7vTcQNUqA6kZURaKx30RkVrEBDczeR3R159oVya0Bpd6p_-k_oJ2uDmFGmgUz8jtzbxmcm-OKRk4uqfPZqBzLgwBbnolVCCJIsRITqSLdy5lIoOgAuI_ajp9JVDoga0upLjtICrNWKO4r5l9ooLQ3za06oL3xfHSvIG9tjeM0EnxcNrKDSBjNDxcBLbnt5F0pckzu7kY2tDuixUVy46ei5_ScHvzFEXnu_mKuyWz6jXe6xa5LSINUhasBZ0y8VmwB9-k8FG-jeTBxx8x-D7DquwAv9Y9C8E3gCReHwe6hSfkOT2PMZ9DcfpIRWLDKQnnqVA7d-kAyjA9QDR_O84GwUMGiMqqoloG1BNlGJA_4XGvmZG8EQCZxT01_6QQIRRYC_TP3u9fxpWO7prNYENokAS_dHbgSluTlUmhcNrqJK9GXZUXqOHCYkWqnfG0kRnwNVpF1NvwpfYhasYbS4CzSaapi_ozBWQqoUE_s-HE-hgPes9tmf7Gd3PSOOUMWoDHTJaA8TTN9uLofNxqZzHIJmavENhg-X2cZjCcJ-bdvsbIM0Bbr59ERv3yQNcx7CCL-QJH4bG1U1oOth35WgqcYWJltzSc81zpytO0h0a-GSYSbVIBwpvvMuqR-gLVQ67KzCCGHaSXXpFTHsoCIxxV4zLSOQAK-uIk2ygD8xmmbUulbNIEVcI8TAFN6uiLYV_K5Lv6TWOyvwm2XmgNciQbKHrqRBn0vBiJbolagRlyLciE24HzwokyL3YGVwlbgO9x6cy7S5O14MY2Pbpbkg28QT-BYzGQ2tdR8nkmTeldUowBiWKxHrpMWgyeuvC-l-pbIhUupsQ823WkP4TxnfwXMsS7hQigKHMiK4uJHCJmKAOCou_SfCSJEI5evltqe7gVoF9Cw4vojlxhC2cst87TyD_bLiwKkZ5iuqxnZeEVhTJVoSuuYo9Jz16ABXaxOGBxNAs5k88-gBJwqvTrYvEv8Qu6PiklBjeUj3IOoR2Kj3E9ytjny47sPifaaoptsUtAIV-Sf0jzDh8AH9pDuN9rpJ2JPvg3vbRJ-BJGOdIsuKh2IFLSBHo9Er9jHR3oBsIi0-jJfBIPOxia23IsbWXAvSJpS5wouWXhMOWLQGoeF0Xb2R5YYWFVIa0ptuH3MA2I4TGVhTwB9gii2RDFoiUNLff04NNCBFHNACRqKHLM7igqMuOX_4Bq63a9Hn3h7XNx2pCIbNGeM2Zc0N5ZTyb27Iye9gLUiLZ3SbV9SS14uor5JRJ81xPOvQpBcPKYHqodbEkdIB4q1_uvpGmNWiFOILIMLeCbEO5-EncQaxx6g_n5m4YHTHyLTjbprr5_OiHWbHH_e-kSWBjlycaW29vZSHT2fPSaLdwuvML6oRQ1oVlANAxbJIklfuUYW1UvXopkMTk-70iTb4W_2zhCsaZyq3Q9xAFCWE3iMPqTMP-Exog4",
  ExpiredTime: "2023-07-24"
});
const bodys = reactive({
  cosBucket: "test-image-1318483234",
  cosRegion: "ap-guangzhou",
  fileName: "2023/07/24/ee89e7b1003646f094a4a7d7e3e07258.png"
});

const props = defineProps({
  // 初始化图片数组
  fileList: {
    type: Array,
    default: () => []
  },
  // 图片提交数量
  limit: {
    type: Number,
    default: 0
  },
  // 删除钩子
  handleRemove: {
    type: Function,
    default: () => {}
  },
  // 上传前的钩子
  beforeUpload: {
    type: Function,
    default: () => {}
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
const httpUploadCos = file => {
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

// element内置方法
const handleRemove = file => {
  props.handleRemove(file);
};

const handleDownload = file => {
  console.log(file);
};
</script>