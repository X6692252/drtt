// 此文件封装三个方法 专门用于操作token
// 存到本地缓存
const key = 'geek-itheima'
//设置
export const setToken = (token) => {
    localStorage.setItem(key,token)
}
// 获取
export const getToken = () => localStorage.getItem(key)

//删除
export const removeToken = () => {
    localStorage.removeItem(key)
} 