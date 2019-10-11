<template>
  <el-container>
    <div class="hspt_header">
      <div class="hspt_header_a">
        <a href="#" class="header_logo"
          ><img
            src="../../static/images/logo.png"
            width="40"
            height="40"
          />海虹帮你找</a
        >
        <div class="hspt_header_b">
          <span>Find For You</span> —只为更高效的服务
        </div>
        <p class="header_meg">
          <span>欢迎&nbsp;&nbsp;{{ showUserInfo.nickname }}</span>
          <!--
          <a
            v-if="
              menu.find(item => {
                return item.resUrl == '/manager/accountApply';
              })
            "
            href="javascript:void(0)"
            @click="handleJumpMsg('001005', ['001005'])"
            >消息 <i v-if="applyNonReadNum > 0" v-text="applyNonReadNum"></i
          ></a>-->
          <a href="javascript:void(0)" @click="handleModifyPwd">修改密码</a
          ><a href="javascript:void(0)" @click="logout">退出</a>
        </p>
      </div>
    </div>
    <el-row>
      <el-col :span="24">
        <div>
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            :router="true"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <template v-for="item in menu">
              <el-menu-item
                :index="item.resCode"
                v-if="item.resType == '2'"
                :key="item.id"
                :route="{ path: item.resUrl, query: { c: item.resCode } }"
              >
                {{ item.resName }}
                <el-badge
                  class="mark"
                  v-if="applyNonReadNum > 0 && item.resName == '企业申请'"
                  :value="applyNonReadNum"
                  :max="10"
                />
              </el-menu-item>

              <el-submenu
                v-if="item.resType == '1'"
                :index="item.resCode"
                :key="item.id"
              >
                <template slot="title">{{ item.resName }}</template>
                <el-menu-item
                  v-for="itemChild in item ? item.children : []"
                  :index="itemChild.resCode"
                  :key="itemChild.id"
                  :route="{
                    path: itemChild.resUrl,
                    query: { c: itemChild.resCode }
                  }"
                >
                  {{ itemChild.resName }}
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </div>
      </el-col>
    </el-row>
    <el-main>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="item in breadcrumbName" :key="item">{{
          item
        }}</el-breadcrumb-item>
      </el-breadcrumb>
      <router-view />
    </el-main>
    <el-footer></el-footer>
    <modifyPwd :dialog-title="dialogTitle" :show-dialog.sync="isShowDialog" />
  </el-container>
</template>

<script>
  import * as api from "../api";
  import modifyPwd from "@/components/ModifyPwd";

  export default {
  name: "Manager",
  components: { modifyPwd },
  data() {
    return {
      msg: "后台管理",
      dialogTitle: "",
      isShowDialog: false,
      activeIndex: "",
      menu: [],
      breadcrumbName: []
    };
  },
  created: function() {
    // console.log("routes", this.$router.options.routes);
    this.validateToken();
  },
  mounted: function() {},
  // beforeRouteEnter(to, from, next) {
  //   console.log("beforeRouteEnter to", to);
  //   next();
  // },
  // beforeRouteUpdate(to, from, next) {
  //   console.log("beforeRouteUpdate to", to);
  //   next();
  // },
  methods: {
    validateToken() {
      api
        .validateTokenApi()
        .then(rs => {
          if (rs.result === 200) {
            this.$store.dispatch("validateToken", rs.data);
            // this.$store.commit("validateToken", rs.data);
            var menusJsonStr = sessionStorage.getItem("menus");
            this.menu = JSON.parse(menusJsonStr)[0].children;

            this.activeIndex = this.$route.query.c;
            //this.setbreadcrumbName(this.activeIndex);
          } else {
            this.$notify.error({
              title: "提示",
              message: rs.message
            });
            this.$router.replace({ path: "/index" });
          }
        })
        .catch(err => {
          console.log("api validateToken error", err);
        });
    },
    handleSelect: function(key, keyPath) {
      this.activeIndex = key;
      this.breadcrumbName = [];
      this.setbreadcrumbName(key);
    },
    setbreadcrumbName: function(key) {
      if (key == "" || typeof key == "undefined") {
        return;
      }
      if (key.length > 6) {
        let aa = this.menu.find(item => {
          if (item.resCode == key.substring(0, 6)) {
            this.breadcrumbName.push(item.resName);
            item.children.find(children => {
              if (children.resCode == key) {
                this.breadcrumbName.push(children.resName);
              }
            });
            return item;
          }
        });
      } else {
        let aa = this.menu.find(item => {
          if (item.resCode == key) {
            this.breadcrumbName.push(item.resName);
            return item;
          }
        });
      }
    },
    showChildBreadcrumb: function(key) {
      this.breadcrumbName.push(key);
      console.log(key);
    },
    logout: function() {
      this.$store.dispatch("userLogout", {});
      this.$router.replace({ path: "/index" });
      location.reload();
    },
    handleModifyPwd() {
      let _this = this;
      _this.dialogTitle = "修改密码";
      _this.isShowDialog = true;
    }
  },
  computed: {
    showUserInfo: function() {
      return this.$store.getters.currentUser;
    },
    applyNonReadNum: function() {
      return this.$store.getters.applyNonReadNum;
    }
  },
  watch: {}
};
</script>
<style>
.el-menu-item a {
  color: #fff;
  text-decoration: none;
}

.el-menu-item a:visited {
  color: #fff;
}
.grid-content {
  float: right;
  line-height: 24px;
  font-size: 12px;
  width: 380px;
  text-align: center;
  color: #0099c9;
  background-color: #fff;
}
.grid-content a {
  padding-left: 50px;
  color: #0099c9;
  text-decoration: none;
}
.grid-content a:visited {
  color: #0099c9;
}
.el-header {
  background-color: #0099c9;
  color: #fff;
  text-align: center;
  line-height: 60px;
  font-weight: bold;
}
.label {
  text-align: right;
  vertical-align: middle;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 12px;
  box-sizing: border-box;
}
</style>
