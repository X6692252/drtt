<template>
    <div class="container">
        <!-- 固定导航 -->
        <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小菲同学"></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
        <div v-for="(obj,index) in list" :key="index">
            <!-- 左侧是机器人 -->
            <div class="chat-item left" v-if="obj.name !== 'me'">
                <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <div class="chat-pao">{{ obj.msg }}</div>
            </div>

            <!-- 右侧是当前用户 -->
            <div class="chat-item right" v-else>
                <div class="chat-pao">{{ obj.msg }}</div>
                <van-image
                 fit="cover" 
                 round 
                 :src="$store.state.userPhoto" />
            </div>
        </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
        <van-field v-model="word" placeholder="说点什么...">
            <template #button>
                <span style="font-size:12px;color:#999" @click="sendFn">提交</span>
            </template>
        </van-field>
    </div>
</div>
</template >

<script>
import { io } from 'socket.io-client'
import { getToken } from '@/utils/token.js'
export default {
  name: 'Chat',
  data () {
    return {
      word: '', // 输入框的内容
      // 所有的聊天消息
      list: [
        // 只根据 name 属性，即可判断出这个消息应该渲染到左侧还是右侧
        { name: 'xs', msg: 'hi，你好！我是小菲' },
        { name: 'me', msg: '我是隔壁三毛' }
      ],
      socket: null //客户端和服务器端建立链接的socket对象
    }
  },
  created () {
    // io是建立socket链接，和axios没有关系
     this.socket = io('ws://geek.itheima.net',{
      query: {
        token: getToken()
      },
      transports: ['websocket']
     })
     // 测试下是否建立链接成功
     // connect为内置事件
     this.socket.on('connect',() =>{
      console.log('链接建立成功')
     })
     // 接收后端传回来的消息
     this.socket.on('message',obj => {
      // 将同字段对象放到数组里面 -> v-for更新
      this.list.push({
        name: 'xs',
        msg: obj.msg
      })
      // 最后一条聊天消息滚动到屏幕范围
      // 数据变化 ->DOM更新是异步的额，所以获取到的是上一条
      this.$nextTick(()=>{
        const theDiv = document.querySelector('.chat-list>div:last-child')
        theDiv.scrollIntoView({
          behavior: 'smooth'
        })
      })
    })
  },
  methods: {
    sendFn () {
      // 发布span -> 点击事件
      // 用socket链接对象.emit('后端接收消息的时间名',值)
     if(this.word.trim().length === 0) return 
        this.socket.emit('message', {
        msg: this.word,
        timestamp: new Date().getTime()
      })
      // 把消息显示到页面上
      this.list.push({
        msg: this.word,
        name: 'me'
      })
      // 最后一条聊天消息滚动到屏幕范围
      // 数据变化 ->DOM更新是异步的额，所以获取到的是上一条
      this.$nextTick(()=>{
        const theDiv = document.querySelector('.chat-list>div:last-child')
        theDiv.scrollIntoView({
          behavior: 'smooth'
        })
      })

      // 清空输入框
      this.word  = ''
    }
  },
  // 关闭socket链接
  destroyed () {
    this.socket.close()
    this.socket = null
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: '';
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
.van-nav-bar {
  background-color: cornflowerblue;
}
//要修改组件内样式，如果用了scoped 就需要在选择器前/deep/即可
/deep/ .van-nav-bar__title {
  color: white;
}
</style>
