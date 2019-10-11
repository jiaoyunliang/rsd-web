import moment from "moment";

export default {
  dateFormat: function(value) {
    var formatString = "YYYY-MM-DD";
    return value ? moment(value).format(formatString) : null;
  },
  dateFormatMonth: function(value) {
    var formatString = "YYYY-MM";
    return value ? moment(value).format(formatString) : null;
  },
  dateFormatFull: function(value) {
    return value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : null;
  }
};
