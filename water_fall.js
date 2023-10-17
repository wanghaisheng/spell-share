import { FeedInfo, FeedListData } from "./models.js"

export default {
  container: document.getElementById("waterFallContainer"),
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

  /**
   * WaterFall 初始化: 创建 html 代码, 监听滚动事件 s
   * @param {FeedListData} feedListData - feed 列表数据
   */
  init: function (feedListData) {
    this.total = feedListData.total
    this.feedList = feedListData.list
    if (this.container) {
      this.create(feedListData.list).scroll()
    }
  },
  /**
   * 页面加载初始创建
   * @param {FeedInfo[]} feedList - feed 列表数据
   */
  create: function (feedList) {
    this.columnWidth = (this.container.clientWidth - this.gap * 3) / 2

    //   this.columnNumber = Math.floor(this.container.clientWidth / this.columnWidth)
    this.columnNumber = 2

    var start = 0,
      htmlColumn = "",
      self = this
    for (start; start < this.columnNumber; start += 1) {
      htmlColumn += `<span id="waterFallColumn_${start}" class="column" style="width:${this.columnWidth}px;${
        start === 0 ? `margin-right: ${this.gap * 0.8}px` : ""
      }">${(function () {
        var html = "",
          i = 0
        for (i = 0; i < 1; i += 1) {
          self.indexImage = start + self.columnNumber * i
          html += self.buildItem(start)
        }
        return html
      })()}</span>`
    }
    htmlColumn += `<span id="waterFallDetect" class="column" style="width:${this.columnWidth}px;"></span>`

    this.container.innerHTML += htmlColumn

    this.detectLeft = document.getElementById("waterFallDetect").offsetLeft
    return this
  },
  buildItem: function (i) {
    var index = (i % 3) + 1
    return `<a href="###" class="pic_a"><img src="./images/${index}.png" />
      <div class="userAvatar">
          <img src="./images/1.png" alt="avatar img">
          <span>Jacob222</span>
      </div>
      <div class="description">#3DRender #Lego #Vie...</div>
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
          // console.log(
          //   "判断条件",
          //   eleColumn.offsetTop + eleColumn.clientHeight,
          //   this.scrollTop + (window.innerHeight || document.documentElement.clientHeight),
          // )
          // console.log("添加图片")
          // console.log("==================================")
          this.append(eleColumn)
        }
      }
    }

    return this
  },

  // 滚动载入
  append: function (column) {
    this.indexImage += 1
    column.innerHTML += this.buildItem(this.indexImage % 2)

    if (this.indexImage >= this.feedList.length-1) {
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
      // console.log('当前滚动位置',scrollTop)
      // console.log('上次滚动位置',self.scrollTop)
      // console.log('滚动距离',Math.abs(scrollTop - self.scrollTop))
      if (!this.loadFinish && Math.abs(scrollTop - self.scrollTop) > 100) {
        self.scrollTop = scrollTop
        self.appendDetect()
      }
    }
    return this
  },

  // 浏览器窗口大小变换
  resize: function () {
    //   var self = this;
    //   window.onresize = function () {
    //     var eleDetect = document.getElementById("waterFallDetect"),
    //       detectLeft = eleDetect && eleDetect.offsetLeft;
    //     if (detectLeft && Math.abs(detectLeft - self.detectLeft) > 50) {
    //       // 检测标签偏移异常，认为布局要改变
    //       self.refresh();
    //     }
    //   };
    this.columnWidth = (this.container.clientWidth - this.gap * 3) / 2
    for (let i = 0; i < this.columnNumber; i++) {
      let columnEle = document.getElementById(`waterFallColumn_${i}`)
      columnEle.style.width = this.columnWidth + "px"
    }
    let detectEle = document.getElementById("waterFallDetect")
    detectEle.style.width = this.columnWidth + "px"

    return this
  },
}
