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
   */
  constructor(hdBanner, banner, customPrompt, feedId, tags, likes, userName, userIcon) {
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
  }
  /**
   * 将 json 序列化构造 FeedInfo 实例
   * @param {Object} json - 服务器数据
   */
  static fromJson(json) {
    return new FeedInfo(
      json["cover_full_image_url"],
      json["cover_image_url"],
      json["custom_prompt"],
      json["feed_id"],
      json["tags"],
      json["likes"],
      json["user_name"],
      json["user_icon"],
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
