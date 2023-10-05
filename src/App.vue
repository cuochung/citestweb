<script setup>
import { ref ,onMounted } from 'vue'
import api from "@/assets/js/api.js";
const $api = api;

const datas = ref([])

onMounted(()=>{
  $api.get("alertinfo").then(rs=>{
    console.log('getdata:',rs.length)
    datas.value = rs
  })
})

</script>

<template>
  <div>
    <h1>test</h1>
    <hr>
    <pre>
      {{ datas }}
    </pre>
  </div>
</template>
