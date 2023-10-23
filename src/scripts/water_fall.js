import api from "./api.js"
import { FeedInfo, FeedListData } from "./models.js"

export default {
  container: document.getElementById("waterFallContainer"),
  viewMoreBtn: document.getElementById("viewMoreBtn"),
  columnNumber: 1,
  columnWidth: 210,
  gap: 15,
  indexImage: 0,
  total: 20,
  scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
  detectLeft: 0,
  loadFinish: false,
  /**
   * @type {FeedInfo[]}
   */
  feedList: [],
  pageNum: 1,
  pageSize: 10,

  init: async function () {
    let data = await api.queryFeedList(this.pageNum, this.pageSize)
    console.log(data)
    this.total = data.total
    this.feedList = data.list
    this.viewMoreBtn.style.visibility = 'hidden'
  },
  create: async function () {
    this.columnWidth = (this.container.clientWidth - this.gap * 3) / 2

    //   this.columnNumber = Math.floor(this.container.clientWidth / this.columnWidth)
    this.columnNumber = 2

    var start = 0,
      htmlColumn = ""
    for (start; start < this.columnNumber; start += 1) {
      htmlColumn += `<span id="waterFallColumn_${start}" class="column" style="width:${
        this.columnWidth
      }px;"></span>`
    }
    // htmlColumn += `<span id="waterFallDetect" class="column" style="width:${this.columnWidth}px;"></span>`

    this.container.innerHTML += htmlColumn

    let imageList = this.feedList.map((item) => item.banner)
    let result = await this.loadImageDimensions(imageList)
    var column0 = document.getElementById("waterFallColumn_0")
    var column1 = document.getElementById("waterFallColumn_1")
    let i = 0
    while (i < result.length) {
      let html = this.buildItem(this.feedList[i])
      if (column0.clientHeight < column1.clientHeight) {
        column0.innerHTML += html
      } else {
        column1.innerHTML += html
      }
      i++
    }

    this.viewMoreBtn.style.visibility = 'visible'
    document.getElementById('smallSpinner').style.visibility = 'hidden'
    // this.detectLeft = document.getElementById("waterFallDetect").offsetLeft
    return this
  },
  /**
   * 构建列表项 - Feed
   * @param {FeedInfo} feed - feed 数据
   * @returns  html 字符串
   */
  buildItem: function (feed) {
    let suffix = encodeURIComponent(`spellai:///fusion/${feed.feedId}`)
    let url = `https://8p5j.adj.st/fusion/${feed.feedId}?adjust_t=15invrt2&adjust_deeplink=${suffix}`
    let promptText = feed.customPrompt
      .split(",")
      .map((item) => `#${item}`)
      .join(" ")
    return `<a href="${url}" class="pic_a"><img src="${feed.banner}" />
      <div class="userAvatar">
          <img src="${feed.userIcon}" alt="avatar">
          <span>${feed.userName}</span>
      </div>
      <div class="description">${promptText}</div>
      </a>`
  },

  // 浏览器窗口大小变换
  resize: function () {
    this.columnWidth = (this.container.clientWidth - this.gap * 3) / 2
    for (let i = 0; i < this.columnNumber; i++) {
      let columnEle = document.getElementById(`waterFallColumn_${i}`)
      if (!columnEle) continue
      columnEle.style.width = this.columnWidth + "px"
    }

    return this
  },
  /**
   * 加载图片
   * @param {string[]} images - 图片 url
   * @returns {Promise<HTMLImageElement[]>} 返回 image element
   */
  loadImageDimensions: async function (images) {
    /**
     * @type {HTMLImageElement[]}
     */
    const dimensions = []

    await new Promise((resolve) => {
      for (const src of images) {
        const img = new Image()
        img.src = src
        img.onload = function () {
          dimensions.push(img)
          if (dimensions.length === images.length) {
            resolve()
          }
        }
      }
    })

    // 返回所有图片的信息
    return dimensions
  },
}
