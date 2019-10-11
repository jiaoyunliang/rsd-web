import * as axios from "../utils/axiosHttp";

export const projectlist = (params = {}) => {
  return axios.fetchPostToken("/project/list", params);
};

export const projectadd = (params = {}) => {
  return axios.fetchPostToken("/project/add", params);
};

export const projectdelete = (params = {}) => {
  return axios.fetchPostToken("/project/delete", params);
};

export const searchorginfolist = (params = {}) => {
  return axios.fetchPostToken("/bnzOrgApi/queryOrgList", params);
};

export const searchinstitutionlist = (params = {}) => {
  return axios.fetchPostToken("/institution/list", params);
};

export const searchinstitutionqualist = (params = {}) => {
  return axios.fetchPostToken("/institution/institutionlist", params);
};

export const searchinstitutiondetaillist = (params = {}) => {
  return axios.fetchPostToken("/institution/institutiondetail", params);
};

export const searchproductqualist = (params = {}) => {
  return axios.fetchPostToken("/productqua/productqualist", params);
};

export const searchproductquadetaillist = (params = {}) => {
  return axios.fetchPostToken("/productqua/productquadetail", params);
};
export const searchbidlist = (params = {}) => {
  return axios.fetchPostToken("/bid/show/column/list", params);
};
export const searchbidupdate = (params = {}) => {
  return axios.fetchPostToken("/bid/show/column/update", params);
};
export const biddetailprocess = (params = {}) => {
  return axios.fetchPostToken("/bid/detail/process", params);
};
export const biddetaildelete = (params = {}) => {
  return axios.fetchPostToken("/bid/detail/delete", params);
};
export const querybideetailpage = (params = {}) => {
  return axios.fetchPostToken("/bid/detail/queryBidDetailPage", params);
};
