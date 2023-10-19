import { ModelData } from "./models.js"
import waterFall from "./water_fall.js"
import api from "./api.js"

class Main {
  constructor() {
    this.init()
    this.initEventListener()
  }
  async init() {
    const url = new URL(window.location.href)

    // 创建 URLSearchParams 对象
    const searchParams = url.searchParams

    // 获取参数值
    this.feedId = searchParams.get("feedId")
    console.log("feedId", this.feedId)

    // 拉取服务器数据
    let [feedInfo, _] = await Promise.all([api.queryFeedInfo(this.feedId), waterFall.init()])
    // console.log("Feed 数据", feedInfo)
    document.getElementById("bigSpinner").style.display = "none"
    document.getElementById("container").style.display = "block"
    // waterFall.create().scroll()
    waterFall.create()

    // 初始设置元素宽度
    this.setElementWidth(".create-btn", 0.95, 10)
    // 设置 banner 图片
    document.querySelector(".banner").setAttribute("src", feedInfo.hdBanner || feedInfo.banner)
    // 设置用户头像
    let userIcon = document.querySelector(".user-info img")
    if (feedInfo.userIcon) {
      userIcon.setAttribute("src", feedInfo.userIcon)
    } else {
      userIcon.style.width = "0px"
    }
    // 设置用户名
    document.querySelector(".user-info span").innerHTML = feedInfo.userName
    // 设置点赞信息
    document.querySelector(".like span").innerHTML = this.formatNumber(feedInfo.likes)
    // 设置 custom prompt
    document.querySelector(".prompt-list-before").innerHTML = feedInfo.customPrompt
    this.setModelList(feedInfo.models)
  }

  /** 初始化事件监听 */
  initEventListener() {
    // 在窗口大小改变时调用函数来更新元素宽度
    window.addEventListener("resize", () => {
      this.setElementWidth(".create-btn",0.95,10)
      waterFall.resize()
    })
    document.querySelector("#createBtn").addEventListener("click", () => {
      this.openUrl(this.feedId)
    })
    document.querySelector("#downloadBtn").addEventListener("click", () => {
      window.open('https://app.adjust.com/15invrt2')
    })
    // 监听 viewMore 按钮点击事件
    document.querySelector("#viewMoreBtn").addEventListener("click", () => {
      this.openUrl(this.feedId)
    })
  }

  /**
   * 设置模型列表数据
   * @param {ModelData[]} modelList - 模型数据列表
   */
  setModelList(modelList) {
    let listNode = document.querySelector(".prompt-list")
    let html = ""
    for (let model of modelList) {
      let temp = model.categoryColor.replace("#", "")
      let convertColor = "#" + temp.substring(2) + temp.substring(0, 2)
      let str = `<div class="model-item">
      <img src="./images/img-real.png" alt="" />
      <div class="prompt-category" style="background-color: ${convertColor};">${model.categoryName}</div>
      <div class="prompt-name">${model.modelName}</div>
    </div>`
      html += str
    }
    listNode.innerHTML = html
  }

  /**
   * 格式化数字，超过 1000 的将数字转换为 k 格式
   * @param {number} num 数字
   * @returns 字符串
   */
  formatNumber(num) {
    if (num >= 1000) {
      // 如果大于等于 1000，将数字转换为 k 格式
      return (num / 1000).toFixed(1) + "k"
    } else {
      // 否则保持原始数字格式
      return num.toString()
    }
  }

  /**
   *  设置元素的宽度适配屏幕大小
   * @param {string} eleName - 元素的类名或者 ID
   * @param {number} widthRatio - 屏幕宽度小于 10.8rem 时，元素宽度取屏幕宽度的百分比
   * @param {number} width2 - 屏幕宽度大于 10.8rem 时，元素宽度取值
   */
  setElementWidth(eleName, widthRatio,width2) {
    const screenWidth = window.innerWidth
    const element = document.querySelector(eleName)

    if (screenWidth <= 10.8 * parseFloat(getComputedStyle(document.documentElement).fontSize)) {
      // 当屏幕宽度小于等于 10.8rem 时，设置元素宽度为屏幕宽度的0.95倍
      element.style.width = screenWidth * widthRatio + "px"
    } else {
      // 当屏幕宽度大于 10.8rem 时，设置元素宽度为10rem
      element.style.width = width2 +"rem"
    }
  }
  /**
   * 跳转链接
   * @param {string} feedId - feedId
   */
  openUrl(feedId) {
    let url = "https://app.adjust.com/15invrt2?deep_link=spellai:///fusion/" + feedId
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      url += "&deeplink_js=1"
    }
    console.log("ua", navigator.userAgent)
    window.open(url)
  }
}

new Main()
