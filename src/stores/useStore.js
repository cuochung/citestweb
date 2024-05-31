import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('counter', () => {
  const state = reactive(
    {
      verMsg: 'CURD Sample',  //系統版本
      // databaseName: "news",  //登入廠商代號及讀取的資料庫名
      databaseName: "news",  //登入廠商代號及讀取的資料庫名
      // base_url: "https://www.pddtvgame.com/portfolioapi", //線上專用指定去讀圖片或其他東西的位置
      // base_url: "http://127.0.0.1/portfolioapi", //線上專用指定去讀圖片或其他東西的位置
      // base_url: "http://127.0.0.1/citest", //線上專用指定去讀圖片或其他東西的位置
      base_url: "http://127.0.0.1/ci451api", //線上專用指定去讀圖片或其他東西的位置

      logined_token: '',
      // logined_token: '3f6adc880c7ac2c5046d71cdf2dd932b8d06501cce0ccf28a9f7fe4452997f7abb94a95e760c979010da55f22fcd3f644516a7b8c3125c501a6d38089241574e33',

      loading: false,  //axios動畫開關狀況
      // audioSwitch: true, //音效開關

      cData: null,
      pData: null,
    }
  )

  //全域toast multi功能;基本上只把要toast的暫存在pinia裡,其他都由PDDToastMultiV2Pinia去控制顯示結果,
  const toasts = ref([])
  const showToastMulti = (newToast) => {
    let finalToast = {
      ...newToast,
      timeStamp: Date.now(), //設定時間,用在顯示動畫的key使用,也可以拿來計算動畫剩餘時間
      active: true, //動畫是否執行
      closeTime: newToast.closeTime ? newToast.closeTime : 5
    }
    toasts.value.push(finalToast)

    setTimeout(() => {
      closeShowToastMulti(finalToast.timeStamp)
    }, finalToast.closeTime * 1000)
  }
  //關閉toast內容 for multi ver.
  const closeShowToastMulti = (timeStamp) => {
    toasts.value.some((i, index) => {
      let str = JSON.stringify(i)
      if (str.includes(String(timeStamp)) && i.active) {
        toasts.value.splice(index, 1)
      }
    })
  }
  //全域toast multi功能 end

  return { 
    state,
    toasts, showToastMulti, closeShowToastMulti,  //multi toast用的到
   }
})
