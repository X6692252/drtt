<template>
  <div>
    <van-nav-bar title="当日头条-登录"/>
    <div>
      <!-- van-form整体表单组件
        submit	提交表单且验证通过后触发（自定义事件）
        van-field 输入框	
        failed	提交表单且验证不通过后触发
        rules 属性配置检验规则
  
      -->
      <van-form @submit="onSubmit">
        <van-field
          v-model="user.mobile"
          required
          name="mobile"
          label="手机号"
          placeholder="请输入11位手机号"
          :rules="[{ required: true, message: '请填写手机号', pattern: /^1[3-9]\d{9}$/ }]"
        />
        <van-field
          v-model="user.code"
          required
          type="password"
          name="密码"
          label="密码"
          placeholder="请输入6位密码"
          :rules="[{ required: true, message: '请填写密码', pattern: /^\d{6}$/  }]"
        />
      <div style="margin: 16px;">
        <van-button van-button round block 
          type="info" native-type="submit"
           :loading="isLoading"
           :disabled="isLoading"
           loading-text="正在登陆..."
          color="cornflowerblue"
        >提交</van-button>
      </div>
  </van-form>
  </div>
  </div>
  </template>
  
  <script>

  //组件
  // 找 引 用 读 删 改
  // 消息通知
  import { Notify } from 'vant';
  import {loginAPI} from '@/api'
  import { setToken } from '@/utils/token'
  
  export default {
   data() {
      return {
        user:{
          mobile:'',//手机号
          code:'' //验证码（密码）246810 
        },
        isLoading:false //登陆按钮-加载状态
      };
    },
    methods: {
      //提交方法
      async onSubmit(values) {
        // 可以直接用values（收集参数名和值）
        console.log('submit', values)
        //点击提交后状态设置为ture
        this.isLoading = true
        //try catch同步代码
        try {
          const res = await loginAPI(this.user)
          console.log(res)
          Notify({ type: 'success', message: '登陆成功' });
          // 把token值通过token.js文件封装的方法存到本地缓存
          setToken(res.data.data.token)
          // 跳转一定要写在最后
          // this.$router.push() 压栈（会产生历史记录，可以回退）,this.$router.replace() 替换（不会产生历史记录）
          this.$router.replace({
            path:'/layout/home'
          })
        } catch (err) {
          // promise内ajax抛出错误，直接进入这里
          Notify({ type: 'danger', message: '手机号或密码错误' });
        }
        //提交成功状态设置为false
        this.isLoading = false
  
       
      },
    },
  }
  </script>
  
  <style scoped lang="less">
  .van-nav-bar{
    background-color: cornflowerblue;
  }
  //要修改组件内样式，如果用了scoped 就需要在选择器前/deep/即可
  /deep/ .van-nav-bar__title{
    color: white;
  }
  </style>>
  

  