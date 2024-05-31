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

const createInstance = () => {
  const store = useStore();
  const instance = axios.create({
    baseURL: store.state.base_url,
    headers: {
      'Authorization': store.state.logined_token
    },
    timeout: 10000
  });

  // 添加 request 拦截器
  instance.interceptors.request.use(function (config) {
    store.state.loading = true;
    return config;
  }, function (error) {
    store.state.loading = false;
    return Promise.reject(error);
  });

  // 添加 response 拦截器
  instance.interceptors.response.use(function (response) {
    setTimeout(() => {
      store.state.loading = false;
    }, 500)
    return response;
  }, function (error) {
    store.state.loading = false;
    if (!navigator.onLine) {
      store.showToastMulti({
        type: 'error',
        message: '網路出了點問題，請重新連線後重整網頁',
        closeTime: 5,
      })
      return Promise.reject("LOCALNetwork_ERROR");
    }

    if (error.code == 'ERR_NETWORK') {
      store.showToastMulti({
        type: 'error',
        message: '伺服器未正常連結',
        closeTime: 5,
      })
      return Promise.reject("ERR_NETWORK");
    }

    if (error.response) {
      const errorMessage = {
        401: '未授權請求',
        404: '請求不存在',
        500: '程式發生問題',
      }[error.response.status] || error.message;

      store.showToastMulti({
        type: 'error',
        message: errorMessage,
        closeTime: 5,
      });
    }

    return Promise.reject(error);
  });

  return instance;
};

var api = {
  //get data
  async get(database) {
    console.log('run get')
    const instance = createInstance();
    const store = useStore();

    try {
      const get = await instance.post(`GeneralController/getAll/${store.state.databaseName}/${database}`)
      // console.log(123,get)
      if (get.data.status == 401){
        store.state.logined_token = ''
        localStorage.removeItem('loginState')
        // console.log('401,store.state:', store.state)
        return []
      }else{
        // console.log('200')
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
      const get = await instance.post(`GeneralController/addHandler/${store.state.databaseName}/${database}`, qs.stringify(data))
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
      const get = await instance.post(`GeneralController/editHandler/${store.state.databaseName}/${database}`, qs.stringify(data))
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
      const get = await instance.post(`GeneralController/delHandler/${store.state.databaseName}/${database}`, qs.stringify(data))
      return get.data;
    } catch (err) {
      console.log('err', err)
    }

  },

  //特別處理 url自定義
  async options(url, data = null) {
    console.log('run options')
    const instance = createInstance();
    try {
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
  //     const get = await instance.post(`GeneralController/upload/${store.state.databaseName}/${database}`, fd)
  //     return get.data;
  //   } catch (err) {
  //     console.log('err', err)
  //   }

  // },

  //上傳檔案,多檔
  async upload(database, fd = null) {
    // console.log('run fileUploadMulti', `GeneralController/fileUploadMulti/${store.state.databaseName}/${database}`)
    const instance = createInstance();
    try {
      const get = await instance.post(`GeneralController/fileUploadMulti/${store.state.databaseName}/${database}`, fd)
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
      const get = await instance.post(`GeneralController/addMulti/${store.state.databaseName}/${database}`, qs.stringify(data))
      return get.data;
    } catch (err) {
      console.log('err', err)
    }

  },
}

export default api;