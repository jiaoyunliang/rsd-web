<!-- 新闻添加 or 修改 -->
<template>
  <div>
    <el-dialog
      :top="dialogTop"
      :title="dialogTitle"
      :close-on-click-modal="false"
      width="90%"
      :visible="showDialog"
      @close="tallDataListChanged"
    >
      <el-form
        :model="currentData"
        ref="formObject"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="分类" v-if="currentData.sysId == 3">
          <el-select v-model="currentData.newsType" placeholder="分类">
            <el-option
              v-for="item in EnewsTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" v-if="currentData.sysId == 2">
          <el-select
            v-model="currentData.newsType"
            placeholder="分类"
            v-if="currentData.sysId == 2"
          >
            <el-option
              v-for="item in HnewsTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="currentData.title" />
        </el-form-item>
        <el-form-item label="内容">
          <UE
            :config="ueConfig"
            ref="ueditor"
            :value="currentData.content"
            @ready="editorReady"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveNews">保存</el-button>
        <el-button @click="tallDataListChanged">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as api from "@/api";
  import UE from "@/components/UEditor";

  export default {
  components: { UE },
  props: {
    dialogTitle: "",
    showDialog: false,
    newsObject: Object
  },
  data() {
    return {
      dialogTop: "2vh",
      loading: false,
      EnewsTypes: [
        { name: "资料下载", id: 1 },
        { name: "行业动态", id: 2 },
        { name: "项目公告", id: 3 }
      ],
      HnewsTypes: [
        { name: "政府文件", id: 4 },
        { name: "工作动态", id: 5 },
        { name: "资料下载", id: 6 },
        { name: "企业评价", id: 7 }
      ],
      currentData: {},
      ueConfig: {
        zIndex: 3000,
        autoHeightEnabled: true,
        autoFloatEnabled: true,
        initialFrameWidth: null,
        initialFrameHeight: 250
      }
    };
  },
  created: function() {},
  mounted: function() {},
  computed: {},
  watch: {
    showDialog: function(n, o) {
      if (n == true) {
        this.currentData = Object.assign({}, this.newsObject);
      }
    }
  },
  methods: {
    saveNews() {
      let _this = this;
      // let ss = this.$refs.ueditor.getUEContent();
      // console.log("saveNews", ss, this.currentData);
      if (this.currentData.newsType == null) {
        _this.$notify.error({
          title: "提示",
          message: "请选择分类！"
        });
        return;
      }

      if (this.currentData.title == "") {
        _this.$notify.error({
          title: "提示",
          message: "请填写标题！"
        });
        return;
      }

      if (this.currentData.content == "") {
        _this.$notify.error({
          title: "提示",
          message: "请填写内容！"
        });
        return;
      }

      if (confirm("确认保存?")) {
        api
          .saveNewsApi(_this.currentData)
          .then(rs => {
            if (rs.result === 200) {
              _this.$notify.success({
                title: "提示",
                message: rs.message
              });
            } else {
              _this.$notify.error({
                title: "提示",
                message: rs.message
              });
            }
            _this.tallDataListChanged();
          })
          .catch(err => {
            _this.tallDataListChanged();
            console.log("api saveNewsApi error", err);
          });
      }
    },
    editorReady(instance) {
      instance.setContent(this.currentData.content);
      instance.addListener("blur", () => {
        // console.log("blur", instance.getContent());
        this.currentData.content = instance.getContent();
      });
    },
    dialogClosed: function() {
      this.$emit("update:show-dialog", false);
    },
    tallDataListChanged: function() {
      this.dialogClosed();
      this.$emit("refreshList");
    }
  }
};
</script>

<style></style>
