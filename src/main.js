import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
// import Mock from './mock'
import axios from 'axios'
import Qs from 'Qs'
import echarts from 'echarts'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip=false;
Vue.prototype.$echarts=echarts;
Vue.prototype.$axios=axios;
Vue.prototype.qs=Qs;

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})
// router.beforeEach((to, from, next) => {
  
  // if (to.path == '/login') {
  //   next();
  // } else {
  //   let token = localStorage.getItem('Authorization');
  //   console.log(token)
  //   if (token === 'null' || token === '') {
  //     next('/login');
  //   } else {
  //     next();
  //   }
  // }
  // let token = localStorage.getItem('Authorization');
  // if(token){
  //   next();
  // }
  // else{
  //   if (to.path == '/login'){
  //     next();
  //   }
  //   else{
  //     next("/login");
  //   }
  // }
// });

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
     sessionStorage.removeItem('currentUser');
  }
  // let user = JSON.parse(sessionStorage.getItem('currentUser'));
  let token=sessionStorage.getItem('Authorization');
  if ((to.path != '/login')&&(token==null||token=='')) {
    if(to.path=='/register'){
      next()
    }
    else
    {next({ path: '/login' })}
  } 
  else{
    next();
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

//添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
  config => {
    if (localStorage.getItem('Authorization')) {
      config.headers.Authorization = localStorage.getItem('Authorization');
    }
 
    return config;
  },
  error => {
    return Promise.reject(error);
  });

axios.interceptors.response.use(
  response=>{
    return response;
  },
  error=>{
    if(error.response){
      switch(error.response.status){
        case 401:
        localStorage.removeItem('Authorization');
        this.$router.push('/login');
  
      }
    }
  }
);

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')


