/****************************************************** */
預計加入以下功能
/* CI451版本後台API */
1.加入token授權限制 
2.使用ci451 的語法處理CURD 
3.資料結構放在datalist 裡的就是Json檔
4.處理搜尋都用Json語法處理
5.使用PHPMailer處理Mail功能
6.上傳功能
/****************************************************** */
2024.5.31
1.api.js 再調整,加入 攔截器 設定 -> 這樣在執行axios時,動畫才會有效果
token授權限制:
*登入時判斷token是否存在 -> 不存在就不可取得資料
*按F5重新更新時 -> 判斷token是否過期,目前設定為15分
*正常登入時,token暫存在 store.state.logined_token 裡, localStorage 裡暫存 loginState
2.加入 toast,loading 組件

2024.5.30
api.js 加入 createInstance() 去載入 axios的預設值;
再把 const instance = createInstance(); 放在每個function中,這樣可以確保每次送出時
header及各項設定值都可以是最新的狀態

2024.5.29
開始調整樣本為CI451使用的CURD版本