<template>
  <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
    <div v-if="previewFiles.length === 0">點擊或拖放檔案至此處上傳</div>
    <div v-else>
      <div class="preview-container">
        <div v-for="(file, index) in previewFiles" :key="index" class="preview-item">
          <img v-if="isImage(file)" :src="file.preview" class="preview-image" />
          <div v-else>{{ file.name }}</div>
          <button @click.stop="removeFile(index)" class="delete-button">刪除</button>
        </div>
      </div>
      <button @click.stop="uploadFiles">上傳</button>
    </div>
    <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" multiple />
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "@/assets/js/api.js";
const $api = api;

const fileInput = ref(null);
const previewFiles = ref([]);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    previewFiles.value = createFilePreviews(files);
  }
};

const handleDrop = (event) => {
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    previewFiles.value = createFilePreviews(files);
  }
};

const createFilePreviews = (files) => {
  const previewList = [];
  Array.from(files).forEach((file) => {
    const preview = URL.createObjectURL(file);
    previewList.push({ file, preview, name: file.name });
  });
  return previewList;
};

const removeFile = (index) => {
  previewFiles.value.splice(index, 1);
};

const uploadFiles = async () => {
  const formData = new FormData();
  previewFiles.value.forEach((item) => {
    formData.append("files[]", item.file);
  });

  $api.upload("news", formData).then((rs) => {
    console.log(rs);
    previewFiles.value = []; // 上传成功后清空预览
  });
};

const isImage = (file) => {
  console.log(file)
  return file.file.type.startsWith("image/");
};
</script>

<style>
.upload-area {
  width: 100%;
  min-height: 200px;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  flex-direction: column;
  padding:5px;
}
.upload-area:hover {
  border-color: #000;
}
.preview-container {
  margin: 5px;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.preview-item {
  position: relative;
}
.preview-image {
  border: 1px solid black;
  padding: 5px;
  border-radius: 5px;
  max-height: 150px;
  max-width: 200px;
}
.delete-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}
</style>
