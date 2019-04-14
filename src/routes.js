import Login from './views/Login.vue'
import Register from './views/Register.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/system/Table.vue'
import Form from './views/system/Form.vue'
import user from './views/system/user.vue'

// import SystemHome from './views/system/Home.vue'
import SystemInfo from './views/system/SystemInfo.vue'
import SystemCpuInfo from './views/system/SystemCpuInfo.vue'
import SystemJvmInfo from './views/system/SystemJvmInfo.vue'
import SystemMemoryInfo from './views/system/SystemMemoryInfo.vue'
import SystemNetworkInfo from './views/system/SystemNetworkInfo.vue'


import UserList from './views/user/userlist.vue'

import RoleList from './views/role/rolelist.vue'

import Page4 from './views/user/Page4.vue'
import Page5 from './views/user/Page5.vue'


import Page6 from './views/role/Page6.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {   
        path: '/register',
        component: Register,
        name:'',
        hidden:true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '首页',
        iconCls: 'fa fa-home fa-lg ',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/SystemInfo', component: SystemInfo, name: '系统属性' },
            { path: '/SystemCPUInfo', component: SystemCpuInfo, name: 'CPU性能' },
            { path: '/SystemJVMInfo', component: SystemJvmInfo, name: 'JVM性能' },
            { path: '/SystemMemoryInfo', component: SystemMemoryInfo, name: '内存性能' },
            { path: '/SystemNetworkInfo', component: SystemNetworkInfo, name: '网络性能' },
            
        ]
    },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'fa fa-user fa-lg ',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/userlist', component: UserList, name: '用户列表' },
            // { path: '/table', component: Table, name: 'Table' },
            // { path: '/form', component: Form, name: 'Form' },
            // { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '角色管理',
        iconCls: 'fa fa-id-card-o fa-lg',
        children: [
            { path: '/rolelist', component: RoleList, name: '角色列表' },
            // { path: '/page4', component: Page4, name: '页面4' },
            // { path: '/page5', component: Page5, name: '页面5' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统分析',
        iconCls: 'fa fa-television fa-lg',
        //leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '导航三' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统预测',
        iconCls: 'fa fa-bar-chart fa-lg',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '个人设置',
        iconCls: 'fa fa-cog fa-lg',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;