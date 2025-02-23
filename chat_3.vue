<template>
  <div>
    <h1>上传文件</h1>
    <input type="file" @change="handleFileChange" />
    <button @click="uploadFile" :disabled="!file">上传</button>
    <div v-if="uploading">正在上传...</div>
    <div v-if="uploadSuccess">上传成功！</div>
    <div v-if="uploadError" class="error">上传失败：{{ uploadError }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { File } from '../service/coze_SDK';  

const file = ref(null);
const uploading = ref(false);
const uploadSuccess = ref(false);
const uploadError = ref(null);

const handleFileChange = (event) => {
  file.value = event.target.files[0]; // 获取选择的第一个文件
};

const uploadFile = async () => {
  if (!file.value) {
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
