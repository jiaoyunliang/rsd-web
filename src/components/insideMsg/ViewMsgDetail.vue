<!-- 站内消息 -->
<template>
  <div>
    <el-row style="padding-top:15px">
      <el-col :span="20">&nbsp;</el-col>
      <el-col :span="4" style="text-align:right"
        ><el-button @click="back" size="mini">返回</el-button></el-col
      >
    </el-row>
    <el-row class="row">
      <el-col :span="24" class="title">
        {{ msgDetail.title }}
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="24" class="time">
        {{ msgDetail.createTime | dateFormat }}
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="24" class="remark">
        <hr />
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="24" class="remark">
        {{ msgDetail.content }}
      </el-col>
    </el-row>

    <el-row class="row" v-for="(item, i) in msgReply" v-bind:key="i">
      <el-col :span="2">
        &nbsp;
      </el-col>
      <el-col :span="22" class="msg">
        {{ item.replyContent }}
        <el-row>
          <el-col :span="12" class="orgName">{{ item.orgName }}</el-col>
          <el-col :span="12" class="replyTime">{{
            item.replyTime | dateFormat
          }}</el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as api from "@/api";

  export default {
  components: {},
  props: {
    msgDetail: Object
  },
  data() {
    return {
      msgReply: []
    };
  },
  created: function() {
    this.handelQueryMsgReply();
  },
  mounted: function() {},
  computed: {},
  watch: {},
  methods: {
    handelQueryMsgReply() {
      let _this = this;
      api
        .queryMsgReplyByMsgIdApi({ msgId: _this.msgDetail.id })
        .then(rs => {
          if (rs.result === 200) {
            _this.msgReply = rs.data;
          } else {
            _this.$notify.error({
              title: "提示",
              message: rs.message
            });
          }
        })
        .catch(err => {
          console.log("api queryMsgReplyByMsgIdApi error", err);
        });
    },
    back() {
      this.$emit("back");
    }
  }
};
</script>

<style>
.row {
  padding-top: 10px;
}
.title {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
}
.time {
  text-align: center;
}
.remark {
  padding: 0 10px;
  line-height: 25px;
}
.msg {
  border: 1px solid #ebebeb;
  padding: 10px;
  line-height: 25px;
}
.orgName {
  font-size: 12px;
  color: #606266;
}
.replyTime {
  text-align: right;
  font-size: 12px;
  color: #606266;
}
</style>
