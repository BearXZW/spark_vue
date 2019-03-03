<template>
  <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">大数据运维预测平台</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="form.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="form.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;margin-bottom:10px" @click="login">登录</el-button>
      <el-button  type="warning" style="width:100%;margin-left:0px;" @click="register">注册</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
  // import { requestLogin } from '../api/api';
  import { mapMutations } from 'vuex'
  import {mapActions} from 'vuex'
  import { testlogin } from '../api/api';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        form: {
          username: '',
          password: ''
        },
        rules: {
            username:[{required:true,message:'请输入账号',trigger: 'blur'}],
            password: [{required: true, message: '请输入账户密码！', trigger: 'blur'}]
          // account: [
          //   { required: true, message: '请输入账号', trigger: 'blur' },
          //   //{ validator: validaePass }
          // ],
          // checkPass: [
          //   { required: true, message: '请输入密码', trigger: 'blur' },
          //   //{ validator: validaePass2 }
          // ]
        },
        userToken:'',
        checked: true
      };
    },
    methods: {
      // handleReset2() {
      //   this.$refs.ruleForm2.resetFields();
      // },
      // handleSubmit2(ev) {
      //   var _this = this;
      //   this.$refs.ruleForm2.validate((valid) => {
      //     if (valid) {
      //       //_this.$router.replace('/table');
      //       this.logining = true;
      //       //NProgress.start();
      //       var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
      //       requestLogin(loginParams).then(data => {
      //         this.logining = false;
      //         //NProgress.done();
      //         let { msg, code, user } = data;
      //         if (code !== 200) {
      //           this.$message({
      //             message: msg,
      //             type: 'error'
      //           });
      //         } else {
      //           sessionStorage.setItem('user', JSON.stringify(user));
      //           this.$router.push({ path: '/table' });
      //         }
      //       });
      //     } else {
      //       console.log('error submit!!');
      //       return false;
      //     }
      //   });
      // }
      ...mapMutations(['changeLogin']),
      // login(){
      //   let _this = this;
      //   if (this.username === '' || this.password === '') {
      //     alert('账号或密码不能为空');
      //   } 
      //   else {
      //     testlogin( _this.form).then(res => {
      //       console.log(res);
      //       _this.userToken=res.token;
      //       _this.changeLogin({ Authorization: _this.userToken });
      //       if(_this.userToken){
      //         _this.$router.push('/');
      //         alert('登陆成功');
      //       }
      //       else{
      //         _this.$router.push('/login');
      //       }
      //       }).catch(error => {
      //         alert('账号或密码错误');
      //         console.log(error);
      //       });
      //   }
      // },
      //登录方法
      login(){
        let _this = this;
        if (_this.form.username === '' || _this.form.password === '') {
            alert('账号或密码不能为空');
        } 
        else {
          _this.$axios({
          method: 'post',
          url: 'http://127.0.0.1:8081/user/Login',
          data: {
              username:_this.form.username,
              password:_this.form.password
            }
        }).then(res => {
            // console.log(res.data);
            // _this.userToken ='Bearer'+res.data.token;
            _this.userToken=res.data.token;
            _this.currentUser=res.data.user;
            // console.log(_this.userToken)
            // 将用户token保存到vuex中
            _this.changeLogin({ Authorization: _this.userToken,currentUser:_this.currentUser});
            if(_this.userToken){
              //  sessionStorage.setItem('user', JSON.stringify(user));
              _this.$router.push( '/table' );
              alert('登陆成功');
            }
            else{
              _this.$router.push('/login');
            }
          }).catch(error => {
              alert('账号或密码错误');
              console.log(error);
        });
        }
      },
      //注册方法
      register(){
        let _this = this;
        console.log("register")
        _this.$router.push( '/register' );
      },
      redirt:function(){
        this.$router.push('/');
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>