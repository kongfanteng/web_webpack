import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-CN')
console.log('moment:', moment().format('MMMM Do YYYY, h:mm:ss a'))
