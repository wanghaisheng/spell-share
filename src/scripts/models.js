export class FeedInfo {
  /**
   * Feed 详细数据
   * @param {string} hdBanner - 高清 Banner
   * @param {string} banner - 普通 Banner
   * @param {string} customPrompt - 自定义咒语
   * @param {string} feedId - 唯一标识符，也用作 fusion id
   * @param {string[]} tags - 模型编码列表，用于获取模型信息
   * @param {number} likes - 点赞数量
   * @param {string} userName - 用户名
   * @param {string} userIcon - 用户头像
   * @param {ModelData[]} models - 模型列表
   */
  constructor(hdBanner, banner, customPrompt, feedId, tags, likes, userName, userIcon, models) {
    // 高清 banner，优先使用 hdBanner，没有就使用 banner
    this.hdBanner = hdBanner
    // 普通 banner
    this.banner = banner
    // 自定义
    this.customPrompt = customPrompt
    this.feedId = feedId
    this.tags = tags
    this.likes = likes
    this.userName = userName
    this.userIcon = userIcon
    this.models = models
  }
  /**
   * 将 json 序列化构造 FeedInfo 实例
   * @param {Object} json - 服务器数据
   */
  static fromJson(json) {
    /**
     * @type {ModelData[]}
     */
    let modelList = []
    if (json["models"]) {
      for (let i = 0; i < json["models"].length; i++) {
        modelList.push(ModelData.fromJson(json["models"][i]))
      }
    }
    return new FeedInfo(
      json["cover_full_image_url"],
      json["cover_image_url"],
      json["custom_prompt"],
      json["feed_id"],
      json["tags"],
      json["likes"],
      json["user_name"],
      json["user_icon"],
      modelList,
    )
  }
}

/** 模型数据, Feed 下的模型列表 */
export class ModelData {
  /**
   * 模型数据构造函数
   * @param {string} categoryCode - 分类编码
   * @param {string} categoryColor - 分类颜色
   * @param {string} categoryName - 分类名称
   * @param {number} categorySort - 分类顺序
   * @param {string} modelCode - 模型编码
   * @param {string} modelName - 模型名称
   * @param {string} imgUrl - 图片
   */
  constructor(categoryCode, categoryColor, categoryName, categorySort, modelCode, modelName, imgUrl) {
    this.categoryCode = categoryCode
    this.categoryColor = categoryColor
    this.categoryName = categoryName
    this.categorySort = categorySort
    this.modelCode = modelCode
    this.modelName = modelName
    this.imgUrl = imgUrl
  }
  /**
   * 序列化
   * @param {Object} json - 服务器数据
   */
  static fromJson(json) {
    return new ModelData(
      json["category_code"],
      json["category_color"],
      json["category_name"],
      json["category_sort"],
      json["model_code"],
      json["model_name"],
      json['icon_urls'][0]
    )
  }
}

export class FeedListData {
  /**
   * Feed 列表数据构造函数
   * @param {FeedInfo[]} list - Feed 列表数据
   * @param {number} pageNum - 第几页
   * @param {number} pageSize - 一页多少条
   * @param {number} total - 总数，一共多少条 Feed
   */
  constructor(list, pageNum, pageSize, total) {
    this.list = list
    this.pageNum = pageNum
    this.pageSize = pageSize
    this.total = total
  }
  /**
   * 序列化 Feed 列表数据
   * @param {Object} json - 服务器数据
   */
  static fromJson(json) {
    let list = []
    for (let item of json["data"]) {
      list.push(FeedInfo.fromJson(item))
    }
    return new FeedListData(list, json["page_num"], json["page_size"], json["total"])
  }
}
