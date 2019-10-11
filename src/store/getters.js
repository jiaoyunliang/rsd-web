export default {
  routeItems: state => state.user.items,
  currentUser: state => state.user.user,
  isLogin: state => state.user.isLogin,
  applyNonReadNum: state => state.user.applyNonReadNum
};
