import Vue from 'vue'
import Vuex from 'vuex'
// import * as actions from './actions'
// import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
// const state = {
//     count: 10
// }

// // 定义所需的 mutations
// const mutations = {
//     INCREMENT(state) {
//         state.count++
//     },
//     DECREMENT(state) {
//         state.count--
//     }
// }

// // 创建 store 实例
// export default new Vuex.Store({
//     actions,
//     getters,
//     state,
//     mutations
// })

const store = new Vuex.Store({
 
    state: {
      // 存储token
      Authorization: sessionStorage.getItem('Authorization') ? sessionStorage.getItem('Authorization') : '',
      isLogin:false,
      currentUser:sessionStorage.getItem('currentUser') ? sessionStorage.getItem('currentUser') : '',
    },
   
    mutations: {
      // 修改token，并将token存入localStorage
      changeLogin (state, user) {
        state.Authorization = user.Authorization;
        state.isLogin=true;
        state.currentUser=user.currentUser;
        sessionStorage.setItem('Authorization', user.Authorization);
        sessionStorage.setItem('currentUser',user.currentUser);
        // console.log(user.currentUser)
        // console.log("user"+JSON.parse(state.currentUser));
        // console.log("token"+state.Authorization);
      }
    }
  });
  export default store;
  