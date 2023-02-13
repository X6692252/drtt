<template>
    <div>
      <van-cell @click="cellClickFn">
      <!--标题区域的插槽-->
      <template #title>
        <div class="title-box">
          <!--标题-->
          <span>{{artObj.title}}</span>

          <!--单图-->
          <!-- <img class="thumb"
           v-if="artObj.cover.type === 1" 
           :src="artObj.cover.images[0]" alt=""
          > -->
          <van-image
           v-if="artObj.cover.type === 1"
           class="thumb" 
           lazy-load
           :src="artObj.cover.images[0]"
          >
            <template v-slot:error>图片走丢了</template>
          </van-image>

        </div>
        <!--多图-->
        <div class="thumb-box" v-if="artObj.cover.type > 1">
          <!-- <img
           v-for="(imgUrl,index) in artObj.cover.images" 
           :key="index" class="thumb"  
           :src="imgUrl" 
           alt=""
          > -->
          <van-image
            v-for="(imgUrl,index) in artObj.cover.images" 
            :key="index" 
            class="thumb"  
            :src="imgUrl" 
            alt=""
            lazy-load
          >
            <template v-slot:error>图片走丢了</template>
          </van-image>
        </div>
      </template>
      <!--label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{artObj.aut_name}}</span>
            <span>{{artObj.comm_count}}</span>
            <span>{{formatTime(artObj.pubdate) }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="show = true" v-if="isShow"/>
        </div>
      </template>
      </van-cell>
      <!--反馈面板-->
      <van-action-sheet 
        v-model="show" 
        :actions="actions" 
        @select="onSelect" 
        get-container="body"
        @cancel="cancelFn" 
        @close="closeFn"
        :cancel-text="bottomText"/>
    </div>
  <!--一条文章单元格-->
    
  </template>
  
  <script>

  import { firstActions, secondActions } from '@/api/report'
  import { timeAgo } from '@/utils/date.js'
  import 'dayjs/locale/zh'
  export default {
    name:'Articleitem',
    props:{
      artObj: Object, // 文章对象
      isShow: {
        type:Boolean,
        default: true // 例如首页的地方我不想再去动了，首页无传isShow值进来，所以首页需要显示
      }
    },
    methods:{
      formatTime:timeAgo, //函数体是timeAgo
      // action反馈垃圾内容 item索引值
      onSelect(action) {
        // 默认情况下点击选项时不会自动收起
        // 可以通过 close-on-click-action 属性开启自动收起
        if (action.name === '反馈垃圾内容'){
          this.actions = secondActions
          this.bottomText = '返回'
        } else if (action.name === '不感兴趣') {
          this.$emit('disLikeEV',this.artObj.art_id)
          this.show = false //关闭弹窗
        } else {
          this.$emit('reportEV',this.artObj.art_id, action.value)
          this.show = false // 关闭
        }
      },
  
      // 底部按钮-点击事件
      cancelFn () {
        if (this.bottomText === '返回') {
          this.show = true // 强制让它回来
          this.actions = firstActions
          this.bottomText = '取消'
        }
      },
      // 关闭面板-触发事件
      closeFn () {
        this.actions = firstActions
        this.bottomText = '取消'
      },
      cellClickFn () {

      }
    },
    data(){
      return {
        show:false, // 反馈面板显示/隐藏
        actions: firstActions, //report.js引入的数据
        bottomText: '取消' //底部按钮文字
      }
    }
  }
  </script>
  
  <style lang="less" scoped>
  
  .title-box{
    display: flex;
    justify-content:space-between;
    align-items:flex-start;
  }
  
  .label-box{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .label-box span{
    margin:  0 3px;
    &:first-child{
      margin-left: 0;
    }
  }
  /*单图*/
  .thumb{
    width: 113px;
    height: 70px;
    background-color:#f8f8f8 ;
    object-fit: cover;
  }
  /* 三图*/ 
  .thumb-box{
    display: flex;
    justify-content: space-between;
  }
  </style>