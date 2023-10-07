import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('counter', () => {
  const state = {
    verMsg: '2023.10.6.1',  //系統版本
    databaseName: "news",  //登入廠商代號及讀取的資料庫名
    // base_url: "https://www.pddtvgame.com/portfolioapi", //線上專用指定去讀圖片或其他東西的位置
    // base_url: "http://127.0.0.1/portfolioapi", //線上專用指定去讀圖片或其他東西的位置
    base_url: "http://127.0.0.1/citest", //線上專用指定去讀圖片或其他東西的位置

    loading: false,  //axios動畫開關狀況
    // audioSwitch: true, //音效開關

    cData: null,
    pData: null,
  }

  //全域toast功能
  const toastSet = reactive({
    active: false,
    closeTime: 5,
    message: '預設值123',
    type: 'primary'
  })

  const timeOut = ref()  ////清除setTimeout用變數
  const startTime = ref() //暫存取得執行時的時間點
  const elapsedTime = ref() //已經執行了的時間
  const stopAnimation = ref(false) //暫停動畫是否執行中
  const balanceTime = ref() //動畫剩餘時間

  //setData 為傳入的設定
  const showToast = (setData) => {
    toastSet.message = setData.message  //設定訊息內容

    if (setData.closeTime) {  //設定顯示時間 預設為5s
      toastSet.closeTime = setData.closeTime
    } else {
      toastSet.closeTime = 5
    }

    if (setData.type) { //設定類別
      toastSet.type = setData.type
    } else {
      toastSet.type = 'primary'
    }

    toastSet.active = true; //toast開啟

    startTime.value = Date.now();
    balanceTime.value = toastSet.closeTime * 1000;
    timeOut.value = setTimeout(() => { //設定幾秒後開閉
      closeToast()
    }, toastSet.closeTime * 1000)
  }
  const closeToast = () => {  //toast 闗閉
    toastSet.active = false;
    clearTimeout(timeOut.value); //清除setTimeout
  }
  const startTimeout = () => {
    startTime.value = Date.now();
    balanceTime.value -= elapsedTime.value
    stopAnimation.value = false; //滑鼠移出時,重新可以執行停住動畫

    timeOut.value = setTimeout(() => { // store timeout in a variable
      closeToast()
    }, balanceTime.value)
  }
  const stopTimeout = () => { //暫停動畫
    if (stopAnimation.value == false) {
      elapsedTime.value = Date.now() - startTime.value;
      // console.log(`setTimeout 已經執行了 ${elapsedTime.value} 毫秒`);
      clearTimeout(timeOut.value) // clear the timeout when hovering over the component
      stopAnimation.value = true
    }
  }
  //全域toast功能end

  return { state, toastSet, showToast, closeToast, startTimeout, stopTimeout }
})
