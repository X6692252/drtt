<template>
  <div>
    <div class="home_container">
    <!-- 二级路由页面 -->
      <router-view></router-view>
    </div>
    <!-- 下面底部导航 -->
    <div>
      <van-tabbar v-model="active" route>
      <van-tabbar-item icon="home-o" to="/layout/home">首页</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/layout/user">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Layout',
    data() {
        return {
            active: 0
        }
    }
}
</script>

<style scoped lang="less">
/*
    内容底部内边距（把内容往上挤压，防止内部被底部导航栏挡住）
*/
.home_container {
    padding-bottom: 50px;
}
/*底部导航栏上边框*/
.van-tabbar {
    border-top: 1px solid #f8f8f8;
}
</style>>
