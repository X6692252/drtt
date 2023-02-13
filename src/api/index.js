// 统一封装接口方法
// 每个方法负责请求一个url
// 逻辑页面，导入这个接口方法，就能发请求
// 请求url路径，在这里统一管理
import request from '@/utils/request'
import { getToken } from '@/utils/token'
// 登录-登录接口
// axios内部，会把参数对象转成json字符串格式发后台
// axios内部，会自动携带请求参数（headers）里
// Content-Type:'application/json' 帮你添加好
export const loginAPI = ({ mobile, code }) => request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: {
        mobile,
        code
    }
})
// 用户 - 更新token
export const refreshTokenAPI = () => request({
  url: '/v1_0/authorizations',
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${getToken().refresh_token}`
  }
})
// 用户-关注
export const userFollowedAPI = ({ userId }) => request({
  url: 'v1_0/user/followings',
  method:'POST',
  data:{
    target: userId
  }
})

// 用户-取消关注
export const userUnFollowedAPI = ({ userId }) => request({
  url: `v1_0/user/followings/${userId}`,
  method:'DELETE'
})
// 用户-获取个人资料
export const userProfileAPI = () => request({
  url: '/v1_0/user/profile'
})
// 用户-更新头像
export const updateUserPhotoAPI = (fd) => request({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  data: fd //外边传进来的new FormData表单头像
})
// 用户-更新基本资料
export const updateUserProfileAPI = (dataObj) => {
 const obj = {
  name: '',
  gender: 0,
  birthday: '',
  intro: '' 
 }
 for (const prop in obj) { // 遍历参数对象里每个KEY
  if (dataObj[prop] === undefined) { // 用key去外面传入的参数对象匹配，如果没有找到
    delete obj[prop] // 从obj身上移除这对属性和值
  } else {
    obj[prop] = dataObj[prop] // 从外面对象取出对应key值，保存到obj上
  }
 }
 return request({
  url: 'v1_0/user/profile',
  method: 'PATCH', // 局部更新
  data: obj
    // data不会忽略值为null的那对key+value,params遇到null值会忽略不携带此对参数和值给后台
    // name, // 昵称
    // gender, // 性别0：男, 1：女
    // birthday, // 生日
    // intro, // 个人介绍
  
 }) 
}
// 用户-获取基本信息(我的页面显示数据)
export const getUserInfoAPI = () => request({
  url: '/v1_0/user'
})
// 频道-获取所有频道
export const getAllChannelsAPI = () => request({
  url: '/V1_0/channels',
  method: 'GET'
})
// 获取-获取用户选择的频道
// 注意：用户没有登录，默认返回后台设置的默认频道列表
export const getUserChannelsAPI = () => request({
  url:'/v1_0/user/channels',
})
// 获取-获取新闻文章的频道
export const getAllArticleListAPI = ({channel_id,timestamp}) => request({
  url: '/v1_0/articles',
  method: 'GET',
  params:{ // 这里的参数，axios会帮你拼接在URL？后面（查询字符串）
    channel_id,
    timestamp
  }
})
// 频道 更新覆盖频道
export const updateChannelsAPI = ({ channels }) => request({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels // 用户已选整个频道数组
  }
})
// 频道 - 删除用户指定的频道
export const removeTheChannelAPI = ({ channelId }) =>request({
  url: `/v1_0/user/channels/${channelId}`,
  method: 'DELETE',
})

// 文章-不感兴趣
export const dislikeArticleAPI = ({artId}) => request({
    url: '/v1_0/article/dislikes',
    method:'POST',
    data: {
      target: artId
    }
  })
  

// 文章 反馈垃圾内容
export const reportArticleAPI = ({artId,type}) => request({
  url:'/v1_0/article/reports',
  method:'POST',
  data: {
    target:artId,
    type:type,
    remark:'如果你想写，你可以逻辑页面判断下秒如果点击类型是0，再给一个弹出框输入框输入其他问题，传参到这里'
  }
})
// 文章 获取详情
export const detailAPI = ({ artId }) => request({
  url: `/v1_0/articles/${artId}`
})

// 文章 点赞
export const likeArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target: artId
  }
})
// 文章 取消点赞
export const unLikeArticleAPI = ({ artId }) => request({
  url: `/v1_0/article/likings/${ artId }`,
  method: 'DELETE',
})
//文章 评论列表
export const commentsListAPI = ({ id,offset = null, limit = 10 }) => request({
  url: '/v1_0/comments',
  method: 'GET',
  params: { // axios只针对params参数，如果发现键值对，值为null，会忽略此参数名和值不携带在url?后面
    type: 'a', //评论类型 a为对文章的评论
    source: id,
    offset,
    limit
  }
})
// 文章 评论（喜欢）
export const commentLikingAPI = ({ comId }) => {
  return request({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: {
      target: comId
    }
  })
}
// 文章 评论 取消喜欢
export const commentDisLikingAPI = ({ comId }) => {
  return request({
    url: `/v1_0/comment/likings/${comId}`,
    method: 'DELETE'
  })
}
// 文章 评论 发布评论
export const commentSendAPI = ({ id,content,art_id = null }) => {

  // data请求体对象需要自己处理
  const obj = {
    target: id,
    content
  }
  if (art_id !== null) { // 如果本次有第三个参数，证明是对评论进行回复
    obj.art_id = art_id
  }
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: {
      target: id,
      content,
      art_id: id
    }
  }) 
}
// 搜索 联想菜单列表
export const suggestListAPI = ({keywords}) => request({
  url: '/v1_0/suggestion',
  params: {
    q: keywords
  }
})

// 搜索 搜索结果列表
export const searchResultAPI = ({ page = 1, per_page = 10, q }) => request({
  url: '/v1_0/search',
  method: 'GET',
  params: {
    page,
    per_page,
    q
  }
})

// 