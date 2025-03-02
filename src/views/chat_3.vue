<template>
  <div>
    <h1>上传文件</h1>
    <el-upload
      action=""
      :http-request="uploadFile"
      :before-upload="beforeUpload"
      :show-file-list="false"
    >
      <el-button type="primary">点击上传</el-button>
    </el-upload>
    <div v-if="uploading">正在上传...</div>
    <div v-if="uploadSuccess">上传成功！</div>
    <div v-if="uploadError" class="error">上传失败：{{ uploadError }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { File } from '../service/coze_SDK';

const file = ref(null);
const uploading = ref(false);
const uploadSuccess = ref(false);
const uploadError = ref(null);

const beforeUpload = (selectedFile) => {
  file.value = selectedFile;
  console.log(file.value)
  // return false; // 阻止默认的上传行为
};

const uploadFile = async () => {
  if (!file.value) {
    ElMessage.error('请选择文件');
    return;
  }

  // 重置状态
  uploading.value = true;
  uploadSuccess.value = false;
  uploadError.value = null;

  try {
    const files = new File();
    const response = await files.upload(file.value);

    uploadSuccess.value = true;
    console.log('返回值', response);
  } catch (error) {
    uploadError.value = '上传失败，请重试';
    console.error('上传失败:', error);
  } finally {
    uploading.value = false;
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
