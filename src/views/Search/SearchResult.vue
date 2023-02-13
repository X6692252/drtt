<template>
  <div>
    <!--搜索结果页-头部导航-->
    <div class="search-result-container">
        <!-- 点击实现后退效果 -->
        <van-nav-bar
         title="搜索结果"
         left-arrow
         @click-left="$router.go(-1)"
         fixed
        />
    </div>
    <!--文章列表-->
    <div>
      
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
      <!-- .native为组件内根标签绑定原生click点击事件 -->
      <ArticleItem
       v-for="obj in articleList" 
       :key="obj.art_id"
       :artObj="obj"
       :isShow="false"
       @click.native="itemClickFn(obj.art_id)"
      ></ArticleItem>
    </van-list>
    </div>
  </div>
</template>

<script>
import { searchResultAPI } from '@/api';
import ArticleItem from '@/components/ArticleItem';
export default {
    name:'SearchResult',
    data () {
      return {
        page: 1,//页码
        articleList:[], // 文章列表
        loading: false, // 加载状态
        finished: false, //是否全部加载完成
      }
    },
    async created () {
       const res = await searchResultAPI({
          page: this.page,
          q: this.$route.params.kw
       })
       console.log(res)
       this.articleList = res.data.data.results
    },
    components: {
      ArticleItem
},
    methods: {
      async onLoad () {
        if (this.articleList.length > 0) {
          this.page++
          const res = await searchResultAPI({
            page: this.page,
            q: this.$route.params.kw
          })
          if (res.data.data.results.length === 0){
            // 没有更多数据
            this.finished = true
            return
          }
          console.log(res)
          // 把加载新的数据合并到articleList数组
          this.articleList = [...this.articleList, ...res.data.data.results]
          this.loading = false
        }
      },
      // 跳转到详情
      itemClickFn (id) {
        this.$router.push({
          path: `/detail?art_id=${id}`
        })
      }
    }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
.van-nav-bar{
  background-color: cornflowerblue;
}
//要修改组件内样式，如果用了scoped 就需要在选择器前/deep/即可
/deep/ .van-nav-bar__title{
  color: white;
}

</style>>

