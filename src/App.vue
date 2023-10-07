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
  list.value = { ...item };
  isEditing.value = true;
}
//確認修改
const EditOK = () => {
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
    <h1>codeigniter 4 testing (前台 CURD Finish Sample)</h1>
    <hr>

    <div class="addZone">
      <div class="inputText">
        <label for="">Title</label>
        <input type="text" v-model="list.title">
      </div>
      <div class="inputText">
        <label for="">Content</label>
        <input type="text" v-model="list.content">
      </div>
      <button class="buttonStyle" @click="AddOK()" v-if="!isEditing">確認新增</button>
      <button class="buttonStyle" @click="EditOK()" v-if="isEditing">確認修改</button>
    </div>

    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Content</th>
          <th>InsertTime</th>
          <th>UpdateTime</th>
          <th>Options</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in datas" :key="index">
          <td>{{ item.id }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.content }}</td>
          <td>{{ item.insertTime }}</td>
          <td>{{ item.updateTime }}</td>
          <td>
            <button class="buttonStyle" @click="editProcess(item)">修改</button>
            <button class="buttonStyle" @click="delOK(item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  
</template>

<style scoped>
table {
  border: solid 1px;
  width: 100%;
  font-size: 1.2rem;
}

.buttonStyle {
  font-size: 1.2rem;
}

.addZone {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 1.2rem;
}

.addZone div input {
  margin: 5px;
  font-size: 1.2rem;
}
</style>
