<template>
  <div>
    <!--文章列表-->
    <!--:immediate-check="false"-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        offset="50"
        :immediate-check="true"
    >   
        <ArticleItem
         v-for="obj in list"
          :key="obj.art_id"
          :artObj="obj"
          @disLikeEV="disLikeFn"
          @reportEV="reportFn"
          @click.native="itemClickFn(obj.art_id)"
        ></ArticleItem>
    </van-list>
    </van-pull-refresh>

  </div>
</template>

<script>
import { getAllArticleListAPI,dislikeArticleAPI,reportArticleAPI } from '@/api'
import ArticleItem from '@/components/ArticleItem.vue'
import { Notify } from 'vant'
export default {
    props:{
       // list:Array //文章列表数组
       channelId:Number // 频道id
    },
    data(){
        return{
            list:[], //文章列表数据
            loading:false, //底部加载状态
            finished:false, //底部完成状态
            theTime: new Date().getTime(), // 用于分页 时间戳
            isLoading:false // 触底变为false
        }
    },
    components:{
        ArticleItem
    },
    async created () {
        this.getArticeListFn()
    },

    methods:{
        async getArticeListFn () {
            const res = await getAllArticleListAPI({
            channel_id:this.channelId, //默认请求频道数据
            timestamp:this.theTime
        })
        // pre_timestamp
        // 下一段开头的那篇文章事件戳
        // 第一次 系统时间（timestamp）-> 后台 返回0-9条数据 ->携带第10条pre_timestamp值返回
        // 第二次 （timestamp）-上一次pre_timestamp（代表告诉后，从指定的时间戳再往后找10个） 10-19条 携带第20条pre_timestamp值返回
        // 如果pre_timestamp没有时间戳了，没有数据了，就设置finished为true 相对于加载完毕 拦截
        this.list = [...this.list,...res.data.data.results] // 合并上一条时间戳的数据
        this.theTime = res.data.data.pre_timestamp
        this.loading = false // 如果不关闭，底部一直是加载中状态，下次触底会再次出发loading

        if(res.data.data.pre_timestamp === null ){
            this.finished = true
        }
          //顶部状态改为false
        this.isLoading = false
        },


        // 底部加载事件方法
       async onLoad () {
        // immediate-check：内部不要进行判断而已，监听滚动事件的代码还在
        // 第一个频道滚动到底部，再切换第二个频道的时候(新建内容没有那么高),滚动会从底部滚动回到顶部
        // 这个时候发生了滚动，所以滚动事件还是触发了, immediate-check判断无效
        // 如果页面没有数据，length为0，让本次onLoad逻辑代码不往下执行
        if (this.list.length === 0){
            this.loading = false // 触底变为false
            return 
        }
        this.getArticeListFn()
    },

        // 顶部刷新数据事件方法
       async onRefresh() {
        //list清空，来一份新数据
            this.list = []
            this.theTime = new Date().getTime()
            this.getArticeListFn()
       },
        // 反馈-不感兴趣
       async disLikeFn(id){
        try {
            await dislikeArticleAPI({
                artId: id
            })
            Notify({ type:'success', message:'反馈成功'})
        
       } catch(err){
        console.log('失败了')
       }
    },
        // 反馈-垃圾内容
       async reportFn (id,value) {
        await reportArticleAPI({
            artId: id,
            type: value
        })
        Notify({ type:'success', message:'举报成功'})
       },

        // 文章单元格-跳转到详情
        itemClickFn (id) {
            this.$router.push({
            path: `/detail?art_id=${id}`
            })
        }
    }

}
</script>
<style>
</style>