// 封装专门处理时间的方法
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh'


export const timeAgo = (targetTime) => {
    //格式化时间
    dayjs.extend(relativeTime)
    dayjs.locale('zh')
    var a = dayjs()
    var b = dayjs(targetTime)
    return a.to(b) //返回多久之前
}

export const formatDate = (dateObj) => {
    return dayjs(dateObj).format('YYYY-MM-DD')
}