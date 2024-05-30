/*在js裡可以直接取用pinia
之後的databaseName;axios.defaults.baseURL都統一放在pinia的state裡
*/
import { createApp } from 'vue'
import { createPinia } from 'pinia'
createApp().use(createPinia())
import { useStore } from '@/stores/useStore'
const store = useStore();
//在js裡可以直接取用pinia end

// axios 設定
import axios from 'axios'
import qs from "qs";

//axios基本設定 -> 及使用 instance取代axios 實例
// const instance = axios.create({
//   baseURL: store.state.base_url, //統一使用 vuex 的 store 裡的base_url
//   headers: { 
//     // 'Content-Type': 'application/x-www-form-urlencoded',
// 		// 'Content-Type': 'application/json',
// 		'Authorization' : store.state.logined_token
// 	},
//   timeout: 10000
// });

//函數來建立axios實例，每次請求都獲取最新的store狀態
const createInstance = () => {
  const store = useStore();
  return axios.create({
    baseURL: store.state.base_url,
    headers: {
      'Authorization': store.state.logined_token
    },
    timeout: 10000
  });
};

const instance = createInstance();

//執行前及執行前動作導入;例:動畫 //這裡重新宣告一次store,不然改變動畫沒反應
instance.interceptors.request.use(function (config) {
  console.log('loading animaction')
  // Do something before request is sent
  const store = useStore()  
  store.state.loading = true;
  return config;
}, function (error) {
  // Do something with request error
  const store = useStore()
  store.state.loading = false;
  return Promise.reject(error);
});

//執行前及執行後動作導入;例:動畫 //這裡重新宣告一次store,不然改變動畫沒反應
// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  const store = useStore()
  setTimeout(()=>{
    store.state.loading = false;
  },500)
    console.log('response',response);
    return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  const store = useStore()
  store.state.loading = false;

  // alert('errorMsg:' + error)
  console.log('errorMsg',error)

  //本地網路不通時,回傳 "network error"
  if (!navigator.onLine) {
    console.log("網路出了點問題，請重新連線後重整網頁");
    // alert("網路出了點問題，請確認連線後重整網頁");
    store.showToast({
      type: 'error',
      message: '網路出了點問題，請重新連線後重整網頁',
      closeTime: 5,
    })
    return Promise.reject("LOCALNetwork_ERROR");
  }

  //伺服器未正常啟動時
  if (error.code == 'ERR_NETWORK'){
    // alert('伺服器未正常連結');
    store.showToast({
      type: 'error',
      message: '伺服器未正常連結',
      closeTime: 5,
    })
    return Promise.reject("ERR_NETWORK");
  }

  //判斷伺服器回應狀況
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // console.log("你要找的頁面不存在")
        store.showToast({
          type: 'error',
          message: '未授權請求',
          closeTime: 5,
        })
        break
      case 404:
        // console.log("你要找的頁面不存在")
        store.showToast({
          type: 'error',
          message: '請求不存在',
          closeTime: 5,
        })
        break
      case 500:
        // console.log("程式發生問題")
        store.showToast({
          type: 'error',
          message: '程式發生問題',
          closeTime: 5,
        })
        // go to 500 page
        break
      default:
        console.log(error.message)
    }
  } 

  return Promise.reject(error);
});

var api = {
  //get data
  async get(database) {
    console.log('run get')
    const instance = createInstance();
    try {
      const get = await instance.post(`GeneralController/getAll/${store.state.databaseName}/${database}`)
      if (get.data.status != 401){
        return get.data;
      }
    }catch (err){
      console.log('err',err)
    }
  },

  //add data
  async add(database, data) {
    console.log('run add')
    const instance = createInstance();
    try {
      const get = await instance.post(`general/add/${store.state.databaseName}/${database}`, qs.stringify(data))
      return get.data;
    } catch (err) {
      console.log('err', err)
    }
    
  },

  //post data (edit , update)
  async post(database, data) {
    console.log('run post')
    const instance = createInstance();
    try {
      const get = await instance.post(`general/edit/${store.state.databaseName}/${database}`, qs.stringify(data))
      return get.data;
    } catch (err) {
      console.log('err', err)
    }

  },

  //delete data
  async delete(database, data = null) {
    console.log('run delete')
    const instance = createInstance();
    try {
      const get = await instance.post(`general/delv3/${store.state.databaseName}/${database}`, qs.stringify(data))
      return get.data;
    } catch (err) {
      console.log('err', err)
    }

  },

  //特別處理 url自定義
  async options(url, data = null) {
    console.log('run options',data)
    const instance = createInstance();
    try {
      // const get = await instance.post(`${url}`, JSON.stringify(data))
      const get = await instance.post(`${url}`, qs.stringify(data))
      return get.data;
    } catch (err) {
      console.log('err', err)
    }
  },


  //上傳檔案,單檔
  // async upload(database, fd = null) {
  //   console.log('run upload')
  //   try {
  //     const get = await instance.post(`general/upload/${store.state.databaseName}/${database}`, fd)
  //     return get.data;
  //   } catch (err) {
  //     console.log('err', err)
  //   }

  // },

  //上傳檔案,多檔
  async upload(database, fd = null) {
    // console.log('run fileUploadMulti', `general/fileUploadMulti/${store.state.databaseName}/${database}`)
    const instance = createInstance();
    try {
      const get = await instance.post(`general/fileUploadMulti/${store.state.databaseName}/${database}`, fd)
      return get.data;
    } catch (err) {
      console.log('err', err)
    }

  },

  //新增多筆資料
  //addMulti data
  async addMulti(database, data) {
    // console.log('run addMulti')
    const instance = createInstance();
    try {
      const get = await instance.post(`general/addMulti/${store.state.databaseName}/${database}`, qs.stringify(data))
      return get.data;
    } catch (err) {
      console.log('err', err)
    }

  },
}

export default api;