import Vue from "vue";
import moment from "moment";
// 日期格式化
Vue.filter("dateFormat", function(value) {
  var formatString = "YYYY-MM-DD";
  return value ? moment(value).format(formatString) : null;
});
// 日期格式化 完整时间
Vue.filter("dateFormatFull", function(value) {
  return value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : null;
});
