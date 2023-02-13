<template>
  <div>
    <!-- 头部导航 -->
    <!--fixed 把头部固定顶部-->
    <div>
      <van-nav-bar fixed>
        <template v-slot:left>
          <img class="logo" src="@/assets/image/logo.png" alt="">
        </template>
        <template #right>
          <van-icon name="search" size="0.45rem" color="white" @click="moveSearchPageFn" />
        </template>
      </van-nav-bar>
    </div>
    <!--tab导航栏
      van-tabs 一行容器
      van-tab 每个tab栏
      v-model关联的激活项的下标（双向绑定）
      每个van-tab代表一个标签导航，中间夹着内容，对应下属内容
    -->
    <div class="main">
      <!--sticky粘性布局-->
      <van-tabs
       v-model="channelId" 
       @change="channelChangeFn" 
       animated sticky 
       offset-top="1.226667rem"
       >
      <!--循环频道里数据-->
        <van-tab
          :title="obj.name" 
          v-for="obj in userChannelList" 
          :key="obj.id" 
          :name="obj.id"
        >
          <ArticleList :channelId="channelId"></ArticleList>
        </van-tab>
      </van-tabs>
      <van-icon name="plus" size="0.37333334rem" class="moreChannels" @click="plusClickFn"/>
    </div>
    <!-- 频道管理弹出层 -->
    <van-popup v-model="show">
      <ChanneIEdit
       :userList="userChannelList" 
       :unCheckList="unCheckChannelList"
       @addChannelEV="addChannelFn"
       @removeChannelEV="removeChannelFn"
       @closeEv="closeFn"
       ref="editRef"
       v-model="channelId"
       ></ChanneIEdit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannelsAPI, getAllChannelsAPI, updateChannelsAPI, removeTheChannelAPI  } from '@/api'
import ArticleList from './components/ArticleList.vue'
import ChanneIEdit from './ChanneIEdit.vue'
export default {
  methods:{
    // tabs切换的事件 ——》 获取文章列表数据
   async channelChangeFn () {
    //获取文章列表
    // const res2 = await getAllArticleListAPI({
    //   channel_id:0, //默认请求频道数据
    //  timestamp:(new Date()).getTime()
    // })
    // console.log(res2)
    // this.articleList = res2.data.data.results
    },

    // +号点击方法
    plusClickFn() {
      this.show = true
    },

    // 添加频道
    async addChannelFn (channelObj) {
      this.userChannelList.push(channelObj)
      // 把新数组发送给后台
      // 数组里对象字段 -> 转换
      // 推荐频道不能传递-筛选出不是推荐频道剩下的频道对象
      const newArr = this.userChannelList.filter(obj => obj.id !== 0)
      const theNewArr = newArr.map((obj,index)=> {
      const newObj = { ...obj} //拷贝
      delete newObj.name
      newObj.seq = index
      return newObj // 让map方法把新对象收集起来形成一个新数组
      })
      const res = await updateChannelsAPI({
        channels:theNewArr
      }) 
      console.log(res)
    },

    // 删除频道
    async removeChannelFn (channelObj) {
      let index = this.userChannelList.findIndex(obj => obj.id === channelObj.id)
      this.userChannelList.splice(index,1)
      //调用删除的接口
      const res = await removeTheChannelAPI({
        channelId:channelObj.id
      })
      console.log(res)
      // 知道：删除接口返回状态码204（not Content）无返回内容
    },

    // 关闭弹出层
    closeFn () {
      this.show = false
      // 我要让内部的编辑状态回归false
      this.$refs.editRef.isEdit = false
    },
    // 首页-右上角放大镜点击事件 -> 跳转搜索页面
    moveSearchPageFn () {
      this.$router.push('/search')
    }
  },

  components: { ArticleList, ChanneIEdit },
    name: 'Home',
    data() {
    return {
      channelId: 0,// tab导航-激活频道ID（默认频道ID为0，页面刚打开时推荐频道高亮-对应文章数据）
      userChannelList:[], // 用户频道
      allChannelList:[], //所有频道的列表
      // articleList:[] // 文章列表
      show:false // 频道弹出层显示/隐藏
    }
  },

    async created() {
      // 获取-获取用户选择的频道
      const res = await getUserChannelsAPI()
      console.log(res)
      this.userChannelList = res.data.data.channels
      // this.channelChangeFn()
      //所有频道的列表
      const res2 = await getAllChannelsAPI() 
      console.log(res2)
      this.allChannelList = res2.data.data.channels      
    },

    computed: {
      // 把所有频道数组挨个对象取出，去用户已选择频道数组里查找，如果找不到，则让filter方法收集到一个新数组里
      unCheckChannelList () {
        const newArr = this.allChannelList.filter(bigObj => {
          const index = this.userChannelList.findIndex(smallObj => {
            return smallObj.id === bigObj.id
          })
          if(index> -1) {
             return false
          }else {
            return true
          }
        })
        return newArr
      },
     //上面的优化算法 
    // return this.allChannelList.filter(bigObj => (this.userChannelList.findIndex(smallObj => smallObj.id === bigObj.id) === -1))
    }

  }
</script>

<style lang="less" scoped>
.van-nav-bar{
  background-color: cornflowerblue;
}
//要修改组件内样式，如果用了scoped 就需要在选择器前/deep/即可
/deep/ .van-nav-bar__title{
  color: white;
}
.main{
  padding-top: 46px;
  /* 底部在Layout已经给了padding-bottom */
}
.logo{
  width: 100px;
  height: 45px;
}
/deep/.tabs-bottom-bar__color{
  background-color: cornflowerblu;
}

/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color:#fff ;
}

.moreChannels {
  position: fixed;
  top:62px;
  right: 8px;
  z-index: 999;
}
</style>