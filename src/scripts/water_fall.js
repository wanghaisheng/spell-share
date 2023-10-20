import api from "./api.js"
import { FeedInfo, FeedListData } from "./models.js"

export default {
  container: document.getElementById("waterFallContainer"),
  viewMoreBtn: document.getElementById("viewMoreBtn"),
  spinner: document.getElementById("smallSpinner"),
  columnNumber: 1,
  columnWidth: 210,
  gap: 15,
  indexImage: 0,
  total: 20,
  scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
  detectLeft: 0,
  loadFinish: false,
  /**
   *  目前使用一次性加载所有feed 的方式，可以不需要这个变量
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
  },
  create: function () {
    this.columnWidth = (this.container.clientWidth - this.gap * 3) / 2

    //   this.columnNumber = Math.floor(this.container.clientWidth / this.columnWidth)
    this.columnNumber = 2

    var start = 0,
      htmlColumn = "",
      self = this
    for (start; start < this.columnNumber; start += 1) {
      htmlColumn += `<span id="waterFallColumn_${start}" class="column" style="width:${
        this.columnWidth
      }px;">${(function () {
        var html = "",
          i = 0
        for (i = 0; i < self.feedList.length / 2; i += 1) {
          self.indexImage = start + self.columnNumber * i
          let feed = self.feedList[self.indexImage]
          html += self.buildItem(feed, self.openUrl)
        }
        return html
      })()}</span>`
    }
    // htmlColumn += `<span id="waterFallDetect" class="column" style="width:${this.columnWidth}px;"></span>`

    this.container.innerHTML += htmlColumn

    // this.detectLeft = document.getElementById("waterFallDetect").offsetLeft
    return this
  },
  /**
   * 构建列表项 - Feed
   * @param {FeedInfo} feed - feed 数据
   * @returns  html 字符串
   */
  buildItem: function (feed) {
    let url = "https://app.adjust.com/15invrt2?deep_link=spellai:///fusion/" + feed.feedId
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        url += "&deeplink_js=1"
    }
    let promptText = feed.customPrompt
      .split(",")
      .map((item) => `#${item}`)
      .join(" ")
    return `<a href="${url}" target="_blank" class="pic_a"><img src="${feed.banner}" />
      <div class="userAvatar">
          <img src="${feed.userIcon}" alt="avatar">
          <span>${feed.userName}</span>
      </div>
      <div class="description">${promptText}</div>
      </a>`
  },

  // 是否滚动载入的检测
  appendDetect: function () {
    var start = 0
    for (start; start < this.columnNumber; start++) {
      var eleColumn = document.getElementById("waterFallColumn_" + start)
      if (eleColumn && !this.loadFinish) {
        //   console.log("----------------------------------")
        //   console.log("eleColumn offsetTop", eleColumn.offsetTop)
        //   console.log("eleColumn Height", eleColumn.clientHeight)
        //   console.log("this.scrollTop", this.scrollTop)
        //   console.log("window.innerHeight", window.innerHeight, document.documentElement.clientHeight)
        if (
          eleColumn.offsetTop + eleColumn.clientHeight <
          this.scrollTop + (window.innerHeight || document.documentElement.clientHeight)
        ) {
          //   console.log(
          //     "判断条件",
          //     eleColumn.offsetTop + eleColumn.clientHeight,
          //     this.scrollTop + (window.innerHeight || document.documentElement.clientHeight),
          //   )
          //   console.log("添加图片")
          //   console.log("==================================")
          this.append(eleColumn)
        }
      }
    }

    return this
  },

  // 滚动载入
  append: function (column) {
    if (this.loadFinish) return
    this.indexImage += 1
    column.innerHTML += this.buildItem(this.feedList[this.indexImage])

    if (this.indexImage >= this.feedList.length - 1) {
      console.log("图片加载光光了！")
      this.loadFinish = true
    }

    return this
  },

  // 滚动加载
  scroll: function () {
    var self = this
    window.onscroll = function () {
      // 为提高性能，滚动前后距离大于100像素再处理
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      //   console.log('当前滚动位置',scrollTop)
      //   console.log('上次滚动位置',self.scrollTop)
      //   console.log('滚动距离',Math.abs(scrollTop - self.scrollTop))
      if (!self.loadFinish && Math.abs(scrollTop - self.scrollTop) > 100) {
        self.scrollTop = scrollTop
        self.appendDetect()
      }
    }
    return this
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
  /** 加载更多 */
  onLoad: async function () {
    if (this.feedList.length >= this.total) return
    this.viewMoreBtn.style.visibility = "hidden"
    this.spinner.style.visibility = "visible"
    this.pageNum++
    let data = await api.queryFeedList(this.pageNum, this.pageSize)
    // this.spinner.style.visibility = "hidden"
    // if (this.feedList.length < this.total) {
    //   this.viewMoreBtn.style.visibility = "visible"
    // }
    // this.feedList = this.feedList.concat(data.list)
    // console.log("onLoad", this.feedList)
    // this.loadFinish = false
    // this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    // this.appendDetect()

    /** 一次性加载所有 feed START */
    let imageList = data.list.map((item) => item.banner)
    this.loadImageDimensions(imageList)
      .then((result) => {
        // console.log("所有图片加载完成", result[0].outerHTML)
        var column0 = document.getElementById("waterFallColumn_0")
        var column1 = document.getElementById("waterFallColumn_1")
        let i = 0
        while (i < result.length) {
          let promptText = data.list[i].customPrompt
            .split(",")
            .map((item) => `#${item}`)
            .join(" ")
          let html = `<a href="###" class="pic_a">${result[i].outerHTML}
            <div class="userAvatar">
                <img src="${data.list[i].userIcon}" alt="avatar">
                <span>${data.list[i].userName}</span>
            </div>
            <div class="description">${promptText}</div>
            </a>`
          if (column0.clientHeight < column1.clientHeight) {
            column0.innerHTML += html
          } else {
            column1.innerHTML += html
          }
          i++
        }
        // 隐藏 spinner，显示 view more
        this.spinner.style.visibility = "hidden"
        if (this.feedList.length < this.total) {
          this.viewMoreBtn.style.visibility = "visible"
        }
        // console.log("onLoad", this.feedList)
      })
      .catch((error) => {
        console.error("出错了", error)
      })
    /** 一次性加载所有 feed END */
  },
  /**
   * 加载图片
   * @param {string[]} images - 图片 url
   * @returns {HTMLImageElement[]} 返回 image element
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
