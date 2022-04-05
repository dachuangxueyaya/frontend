const { Store } = require("vuex");

if(localStorage.getItem("token")) {
  Store.commit("set_token", localStorage.getItem("token"));
}
if(localStorage.getItem("headUrl")) {
  Store.commit("changeHeading", localStorage.getItem("headUrl"));
}
Router.beforeEach((to, from, next) => {
  if(to.matched.som(res => res.meta.requireAuth)){
    // 验证是否需要登录
    if(localStorage.getItem("userInfo")) {
        // 查询本地存储信息是否已经登录
        next();
    }else {
        next({
          path: "/login" // 未登录则跳转至登录界面
        });
      }
    }else {
        next();
      }
});
export default router;