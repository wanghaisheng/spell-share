import { FeedListData, FeedInfo } from "./models.js"

export default {
  baseUrl: "https://sptv2.aimirror.fun/", //'https://sptv2.aimirror.fun/',
  /**
   * 请求 Feed 详情
   * @param {string} feedId
   * @returns {FeedInfo}
   */
  queryFeedInfo: async function (feedId) {
    // feedId = "652ca6fc9132da4a11e2b7bb"
    try {
      const response = await fetch(`${this.baseUrl}spell/feed/share_info?feed_id=${feedId}`)
      let data = await response.json()
      return FeedInfo.fromJson(data)
    } catch (error) {
      console.log(error)
    }
  },
  /**
   *
   * @param {number} pageNum - 页码
   * @param {number} pageSize - 页数，一页显示数量
   * @returns {Promise<FeedListData>} 返回 FeedListData
   */
  queryFeedList: async function (pageNum, pageSize) {
    let showNsfw = true
    // let sessionId = "1857fe37-2b68-45d9-9ec3-bf9fb25dc7f6"
    try {
      const response = await fetch(
        // `${this.baseUrl}spell/feed/query/v2?page_num=${pageNum}&page_size=${pageSize}&show_nsfw=${showNsfw}&session_id=${sessionId}`
        `${this.baseUrl}spell/feed/query/v2?page_num=${pageNum}&page_size=${pageSize}&show_nsfw=${showNsfw}`,
      )
      let data = await response.json()
      return FeedListData.fromJson(data)
    } catch (error) {
      console.log(error)
    }
  },
}
