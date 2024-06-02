<script setup>
import PDDToastMultiV2Pinia from "@/components/PDDComponents/PDDToastMultiV2Pinia.vue";
import PDDUpload from "@/components/PDDComponents/PDDUpload.vue";
import Loading from "@/components/loading.vue"; //自己設計的讀取畫面;透過v-if 控制開關

import { ref, onMounted } from "vue";
import dayjs from "dayjs";
import api from "@/assets/js/api.js";
const $api = api;
import { useStore } from "@/stores/useStore";
const store = useStore();

const datas = ref([]);
const loginList = ref({});
const dataList = ref({});
const sheetName = "news"; //設定存取的 sheetName 名稱
const isEditing = ref(false); //設定是否為修改狀態

onMounted(async () => {
  await checkLoginState();
  await getAll();
});

//判斷登入狀態
const checkLoginState = async () => {
  let loginState = localStorage.getItem("loginState");
  if (loginState) {
    console.log("loginState exist");
    loginState = JSON.parse(loginState);
    store.state.logined_token = loginState.token;
  }
};

//寄件 by phpmailer
const sendMailByPHPMailer = () => {
  $api.options("GeneralController/sendMail/news").then((rs) => {
    console.log("sendMail Result", rs);
    if (rs.status == 401) {
      store.showToastMulti({
        type: "error",
        message: "寄件失敗!未登入無法寄件",
        closeTime: 5,
      });
    } else {
      store.showToastMulti({
        type: "success",
        message: "信件已發出",
        closeTime: 5,
      });
    }
  });
};

//寄件 by gmail
const sendMailByGmail = () => {
  $api.options("GeneralController/sendMailByGmail/news").then((rs) => {
    console.log("sendMail Result", rs);
    if (rs.status == 401) {
      store.showToastMulti({
        type: "error",
        message: "寄件失敗!未登入無法寄件",
        closeTime: 5,
      });
    } else {
      store.showToastMulti({
        type: "success",
        message: "信件已發出",
        closeTime: 5,
      });
    }
  });
};

//登出
const logout = () => {
  $api.options("AuthController/logout/news").then((rs) => {
    console.log("loginHandler Result:", rs);
    // if (rs.state){
    store.state.logined_token = "";
    localStorage.removeItem("loginState");
    getAll();

    store.showToastMulti({
      type: "success",
      message: "已登出",
      closeTime: 5,
    });
    // }
  });
};

//登入判斷
const loginHandler = () => {
  $api
    .options("AuthController/loginHandler/news", loginList.value)
    .then((rs) => {
      // console.log('loginHandler Result:',rs)
      if (rs.state) {
        //設定 token
        store.state.logined_token = rs.token;
        let loginState = {
          project: "apitest",
          token: rs.token,
        };
        localStorage.setItem("loginState", JSON.stringify(loginState));
        console.log("token", store.state.logined_token);
        getAll();

        store.showToastMulti({
          type: "success",
          message: "成功登入",
          closeTime: 5,
        });
      } else {
        store.showToastMulti({
          type: "error",
          message: "登入失敗",
          closeTime: 5,
        });
        console.log("login fail", rs);
      }
    });
};

//取得所有資料
const getAll = async () => {
  // console.log(store.state.logined_token)

  $api.get(sheetName).then((rs) => {
    // console.log('getAll Result:',sheetName, rs)
    datas.value = rs;
  });
};

//確認新增
const AddOK = () => {
  $api.add(sheetName, dataList.value).then((rs) => {
    console.log("add rs", rs);
    if (rs.state == 1) {
      getAll();
    }
  });
};

//editProcess
const editProcess = (item) => {
  dataList.value = { ...item };
  isEditing.value = true;
};
//確認修改
const EditOK = () => {
  dataList.value.updateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

  $api.post(sheetName, dataList.value).then((rs) => {
    console.log("edit rs", rs);
    if (rs.state == 1) {
      getAll();
      dataList.value = {};
      isEditing.value = false;
    }
  });
};

//確認刪除
const delOK = (item) => {
  $api.delete(sheetName, item).then((rs) => {
    console.log("del rs", rs);
    if (rs.state == 1) {
      getAll();
    }
  });
};
</script>

<template>
  <Loading v-if="store.state.loading" />
  <!-- 讀取畫面 自已設計的loading -->
  <PDDToastMultiV2Pinia />
  <!-- 讀取畫面 自已設計的 toast -->

  token: [{{ store.state.logined_token }}] - loading: [{{
    store.state.loading
  }}]
  <div>
    <div class="flex justify-between items-center">
      <h1>codeigniter 4 (v4.5.1) 前端樣本 (CURD,Login,Token)</h1>

      <div
        class="login_section flex h-20 gap-5 items-center"
        v-if="!store.state.logined_token.length"
      >
        <div class="flex flex-col gap-2">
          <div>帳號:<input type="text" v-model="loginList.account" /></div>
          <div>密碼:<input type="text" v-model="loginList.password" /></div>
        </div>
        <button class="h-60%" @click="loginHandler()">Login</button>
      </div>
      <div v-else>
        <button @click="logout()">登出</button>
      </div>
    </div>
    <hr />

    <div class="addZone">
      <div class="inputText">
        <label for="">Title</label>
        <input type="text" v-model="dataList.title" />
      </div>
      <div class="inputText">
        <label for="">Content</label>
        <input type="text" v-model="dataList.content" />
      </div>
      <button class="buttonStyle" @click="AddOK()" v-if="!isEditing">
        確認新增
      </button>
      <button class="buttonStyle" @click="EditOK()" v-if="isEditing">
        確認修改
      </button>
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
          <td>{{ item.snkey }}</td>
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

    <h2>寄件功能</h2>
    <div class="sendMail flex gap-2">
      <button @click="sendMailByPHPMailer()" class="h-12">
        寄件測試 by PHPMailer
      </button>
      <button @click="sendMailByGmail()" class="h-12">寄件測試 By Gmail</button>
    </div>

    <hr>
    <h2>上傳功能</h2>
    <PDDUpload />
    
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
