import * as axios from "../utils/axiosHttp";

//查询机构
export const queryOrgListApi = (params = {}) => {
  return axios.fetchPostToken("/bnzOrgApi/queryOrgList", params);
};

//查询字典
export const queryDictByCategoryIdApi = (params = {}) => {
  return axios.fetchPostToken("/bnzDictInfoApi/queryDictByCategoryId", params);
};

//验证
export const validateTokenApi = (params = {}) => {
  return axios.fetchPostToken("/bnzAccountApi/validateToken", params);
};

//login
export const login = (params = {}) => {
  return axios.fetchPost("/bnzAccountApi/login", params);
};

//修改密码
export const updatePwdApi = (params = {}) => {
  return axios.fetchPostToken("/bnzAccountApi/updatePwd", params);
};

export const queryResListApi = (params = {}) => {
  return axios.fetchPostToken("/bnzResApi/queryResList", params);
};

export const delResByIdApi = (params = {}) => {
  return axios.fetchPostToken("/bnzResApi/delResById", params);
};

export const saveResApi = (params = {}) => {
  return axios.fetchPostToken("/bnzResApi/saveRes", params);
};

export const updateResApi = (params = {}) => {
  return axios.fetchPostToken("/bnzResApi/updateRes", params);
};

export const queryRoleListApi = (params = {}) => {
  return axios.fetchPostToken("/bnzRoleApi/queryRoleList", params);
};

export const saveRoleApi = (params = {}) => {
  return axios.fetchPostToken("/bnzRoleApi/saveRole", params);
};

export const updateRoleStatusApi = (params = {}) => {
  return axios.fetchPostToken("/bnzRoleApi/updateRoleStatus", params);
};

export const queryRoleListBySysIdApi = (params = {}) => {
  return axios.fetchPostToken("/bnzRoleApi/queryRoleListBySysId", params);
};

export const queryResByRoleApi = (params = {}) => {
  return axios.fetchPostToken("/bnzRoleApi/queryResByRole", params);
};

export const queryAccountListApi = (params = {}) => {
  return axios.fetchPostToken("/bnzAccountApi/queryAccountList", params);
};

export const saveAccountApi = (params = {}) => {
  return axios.fetchPostToken("/bnzAccountApi/saveAccount", params);
};

export const updateAccountApi = (params = {}) => {
  return axios.fetchPostToken("/bnzAccountApi/updateAccount", params);
};

//产品类型-添加
export const saveProductTypeApi = (params = {}) => {
  return axios.fetchPostToken("/bnzProductTypeApi/saveProductType", params);
};

//产品类型-修改
export const updateProductTypeApi = (params = {}) => {
  return axios.fetchPostToken("/bnzProductTypeApi/updateProductType", params);
};

//产品类型-查询
export const queryProductTypeApi = (params = {}) => {
  return axios.fetchPostToken("/bnzProductTypeApi/queryProductType", params);
};

//企业申请-查询
export const queryAccountApplyApi = (params = {}) => {
  return axios.fetchPostToken("/bnzAccountApplyApi/queryAccountApply", params);
};

//企业申请-标记为已读
export const updateAccountApplyApi = (params = {}) => {
  return axios.fetchPostToken("/bnzAccountApplyApi/updateAccountApply", params);
};

//企业机构-类型查询
export const queryOrgTypeApi = (params = {}) => {
  return axios.fetchPostToken("/bnzProductTypeApi/queryOrgType", params);
};

//机构-添加-修改
export const saveOrgApi = (params = {}) => {
  return axios.fetchPostToken("/bnzOrgApi/saveOrg", params);
};

//机构-查询分页
export const queryOrgPageApi = (params = {}) => {
  return axios.fetchPostToken("/bnzOrgApi/queryOrgPage", params);
};

//企业机构-类型
export const queryOrgTypesApi = (params = {}) => {
  return axios.fetchPostToken("/bnzOrgApi/queryOrgTypes", params);
};

//新闻-添加 or 修改
export const saveNewsApi = (params = {}) => {
  return axios.fetchPostToken("/bnzNewsApi/saveNews", params);
};

//新闻列表
export const queryNewsPageApi = (params = {}) => {
  return axios.fetchPostToken("/bnzNewsApi/queryNewsPage", params);
};

//企业黄页
export const queryOrgDetailPageApi = (params = {}) => {
  return axios.fetchPostToken("/bnzOrgDetailApi/queryOrgDetailPage", params);
};

//企业黄页 - 图片
export const queryOrgDetailPicsApi = (params = {}) => {
  return axios.fetchPostToken("/bnzOrgDetailApi/queryOrgDetailPics", params);
};

//系统通知 列表
export const querySysNoticePageApi = (params = {}) => {
  return axios.fetchPostToken("/bnzSysNoticeApi/querySysNoticePage", params);
};

//系统通知 添加 修改
export const saveNoticeApi = (params = {}) => {
  return axios.fetchPostToken("/bnzSysNoticeApi/saveNotice", params);
};

//站内消息 列表
export const queryMsgPageApi = (params = {}) => {
  return axios.fetchPostToken("/bnzInsideMsgApi/queryMsgPage", params);
};

//站内消息 回复
export const queryMsgReplyByMsgIdApi = (params = {}) => {
  return axios.fetchPostToken("/bnzInsideMsgApi/queryMsgReplyByMsgId", params);
};

//信息反馈 列表
export const queryFeedbackPageApi = (params = {}) => {
  return axios.fetchPostToken("/bnzFeedbackApi/queryFeedbackPage", params);
};

//信息反馈 更新
export const updateFeedbackApi = (params = {}) => {
  return axios.fetchPostToken("/bnzFeedbackApi/updateFeedback", params);
};

//ad 更新
export const updateAdApi = (params = {}) => {
  return axios.fetchPostToken("/bnzAdApi/updateAd", params);
};

//ad 列表
export const queryAdListApi = (params = {}) => {
  return axios.fetchPostToken("/bnzAdApi/queryAdList", params);
};

//产品 列表
export const queryProductPageApi = (params = {}) => {
  return axios.fetchPostToken("/bnzProductApi/queryProductPage", params);
};

//产品 修改
export const updateProductApi = (params = {}) => {
  return axios.fetchPostToken("/bnzProductApi/updateProduct", params);
};

//产品 规格及附件
export const queryProductApi = (params = {}) => {
  return axios.fetchPostToken("/bnzProductApi/queryProduct", params);
};
