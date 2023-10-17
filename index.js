import { FeedInfo, FeedListData } from "./models.js"
import waterFall from "./water_fall.js"

let api = {
  baseUrl: "https://sptv2.aimirror.fun/", //'https://sptv2.aimirror.fun/',
  // 请求 Feed 详情
  queryFeedInfo: function () {
    let feedId = "652ca6fc9132da4a11e2b7bb"
    return fetch(`${api.baseUrl}spell/feed/info?feed_id=${feedId}`)
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        console.log(error)
      })
  },
  /**
   * 获取该 Feed 的模型列表
   * @param {string[]} modelCodes - 模型编码列表
   */
  queryModels: function (modelCodes) {
    let params = modelCodes.reduce((prevValue, curValue, curIndex) => {
      let result = prevValue + curValue
      if (curIndex !== modelCodes.length - 1) {
        result += "&model_codes="
      }
      return result
    }, "model_codes=")
    fetch(`${api.baseUrl}spell/model/details?${params}`, {
      headers: {
        env: "DEV",
      },
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        console.log("模型列表", data)
      })
  },
  // 请求 Feed 列表
  queryFeedList: function () {
    let pageNum = 1
    let pageSize = 10
    let showNsfw = true
    let sessionId = "1857fe37-2b68-45d9-9ec3-bf9fb25dc7f6"
    return fetch(
      `${this.baseUrl}spell/feed/query/v2?page_num=${pageNum}&page_size=${pageSize}&show_nsfw=${showNsfw}&session_id=${sessionId}`,
    )
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        console.log(error)
      })
  },
}
api.queryFeedInfo().then((data) => {
  let feedInfo = FeedInfo.fromJson(data)
  console.log("Feed 数据", feedInfo)
})
api.queryFeedList().then((data) => {
  let feedListData = FeedListData.fromJson(data)
  console.log(feedListData)
  // 瀑布流布局
  waterFall.init(feedListData)
})

function setElementWidth(eleName) {
  const screenWidth = window.innerWidth
  const element = document.querySelector(eleName)

  if (screenWidth < 10.8 * parseFloat(getComputedStyle(document.documentElement).fontSize)) {
    // 当屏幕宽度小于10.8rem时，设置元素宽度为屏幕宽度的0.95倍
    element.style.width = screenWidth * 0.95 + "px"
  } else {
    // 当屏幕宽度大于等于10.8rem时，设置元素宽度为10.8rem
    element.style.width = "10rem"
  }
}

// 在窗口大小改变时调用函数来更新元素宽度
window.addEventListener("resize", () => {
  setElementWidth(".create-btn")
  waterFall.resize()
})
// 初始设置元素宽度
setElementWidth(".create-btn")
