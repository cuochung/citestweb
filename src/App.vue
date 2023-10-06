<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import api from "@/assets/js/api.js";
const $api = api;

const datas = ref([])
const list = ref({})
const sheetName = "news" //設定存取的 sheetName 名稱
const isEditing = ref(false); //設定是否為修改狀態

onMounted(() => {
  getAll()
})

const getAll = () => {
  $api.get(sheetName).then(rs => {
    console.log('getdata:', rs.length)
    datas.value = rs
  })
}

//確認新增
const AddOK = () => {
  $api.add(sheetName, list.value).then(rs => {
    console.log('add rs', rs)
    if (rs.state == 1) {
      getAll()
    }
  })
}

//editProcess
const editProcess = (item) => {
  list.value = {...item};
  isEditing.value = true;
}
//確認修改
const EditOK = () =>{
  list.value.updateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

  $api.post(sheetName, list.value).then(rs => {
    console.log('edit rs', rs)
    if (rs.state == 1) {
      getAll()
      list.value = {};
      isEditing.value = false;
    }
    
  })
}

//確認刪除
const delOK = (item) => {
  $api.delete(sheetName, item).then(rs => {
    console.log('del rs', rs)
    if (rs.state == 1) {
      getAll()
    }

  })
}

</script>

<template>
  <div>
    <h1>test</h1>
    <hr>
    <div class="formZone">
      <div class="inputZone">
        <label for="">Title</label>
        <input type="text" v-model="list.title">
      </div>
      <div class="inputZone">
        <label for="">Content</label>
        <input type="text" v-model="list.content">
      </div>
      <button @click="AddOK()" v-if="!isEditing">確認新增</button>
      <button @click="EditOK()" v-if="isEditing">確認修改</button>
    </div>
    <hr>
    Total Datas: {{ datas.length }}
    <div v-for="item, index in datas" :key="index" class="dataStyle">
      <button class="editBtn" @click="editProcess(item)">修改</button>
      <button class="delBtn" @click="delOK(item)">刪除</button>
      {{ item.id }} - {{ item.title }} - {{ item.content }} - {{ item.createTime }} - {{ item.updateTime }}
    </div>
    
      
    
  </div>
</template>

<style scoped>
.formZone {
  display: flex;
}

.inputZone {
  font-size: 1.2rem;
}

.dataStyle {
  background-color: grey;
  color: white;
  margin-top: 2px;
  border-radius: 5px;
  font-size: 1.2rem;
  padding: 5px;
}

button {
  cursor: pointer;
}
</style>