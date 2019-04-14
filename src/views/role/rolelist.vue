<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="角色名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUserByName">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

        <!--列表-->
		<el-table :data="roles" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="rolename" label="角色名称" width="150" sortable>
			</el-table-column>
			<el-table-column prop="roledesc" label="角色" width="150" sortable>
			</el-table-column>
			<el-table-column prop="createtime" label="创建时间" width="200" sortable>
			</el-table-column>
			<el-table-column prop="updatetime" label="更新时间" min-width="200" sortable>
			</el-table-column>
            <el-table-column label="角色状态" width="150">
				<template  slot-scope="scope"  prop="rolestatus">
					<el-button type="success" size="small" v-if="getRoleStatus(scope.$index, scope.row)==true">激活</el-button>
					<el-button type="danger" size="small"  v-if="getRoleStatus(scope.$index, scope.row)==false" >禁用</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template  slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
      
        <!-- 工具条 -->
		<el-col :span="24" class="toolbar">
			<el-button type="danger"  :disabled="this.sels.length===0" @click="batchdelete">批量删除</el-button>
			<el-pagination background  layout="prev, pager, next" :page-size="5" :total="total"  :current-page.sync="currentpage"  @current-change="handleCurrentChange()" @prev-click="prevChange()" @next-click="nextChange()" style="float:right;">
			</el-pagination>
		</el-col>

        <!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="角色名称">
					<el-radio-group v-model="editForm.rolename">
						<el-radio class="radio" label="系统管理员">系统管理员</el-radio>
						<el-radio class="radio" label="游客">游客</el-radio>
                        <el-radio class="radio" label="普通用户">普通用户</el-radio>
                        <el-radio class="radio" label="VIP用户">VIP用户</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="角色">
					<el-input v-model="editForm.roledesc" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="创建时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.createtime"></el-date-picker>
				</el-form-item>
                <el-form-item label="更新时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.updatetime"></el-date-picker>
				</el-form-item>
                <el-form-item label="角色状态">
					<el-radio-group v-model="editForm.rolestatus">
						<el-radio class="radio" :label="1">激活</el-radio>
						<el-radio class="radio" :label="0">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

        <!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色名称">
					<el-radio-group v-model="addForm.rolename">
						<el-radio class="radio" label="系统管理员">系统管理员</el-radio>
						<el-radio class="radio" label="游客">游客</el-radio>
                        <el-radio class="radio" label="普通用户">普通用户</el-radio>
                        <el-radio class="radio" label="VIP用户">VIP用户</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="角色">
					<el-input v-model="addForm.roledesc" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="创建时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.createtime"></el-date-picker>
				</el-form-item>
                <el-form-item label="更新时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.updatetime"></el-date-picker>
				</el-form-item>
                <el-form-item label="角色状态">
					<el-radio-group v-model="addForm.rolestatus">
						<el-radio class="radio" :label="1">激活</el-radio>
						<el-radio class="radio" :label="0">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import util from '../../common/js/util'
    export default {

        data() {
            return{
                filters:{
                    name:''
                },
                roles:[],
                total: 0,
                pageNum: 1,
                pageSize:5,
                currentpage:1,
                listLoading: false,
                sels:[],//选中的列表
                ids:[],//批量删除的用户的id列表

                editFormVisible:false,//编辑界面是否显示
                editLoading:false,
                editFormRules:{
                    rolename:[
                            {required:true, message:'请输入角色名称',trigger:'blur'}
                    ],
                    roledesc:[
                            {required:true,message:'请输入角色信息',trigger:'blur'}   
                    ]
                },
                //编辑界面的工具
                editForm:{
                    id:0,
                    rolename:'',
                    roledesc:'',
                    createtime:'',
                    updatetime:'',
                    rolestatus:1,             
                },

                addFormVisible:false,//新增界面是否显示
                addLoading:false,
                addFormRules:{
                    rolename:[
                            { required: true, message:'请输入角色名称', trigger: 'blur' }
                    ],
                    roledesc:[
                            {required:true,message:'请输入角色信息',trigger:'blur'}
                    ]
                },
                //新增界面数据
                addForm:{
                    rolename:'',
                    roledesc:'',
                    createtime:'',
                    updatetime:'',
                    rolestatus:1,      
                }
            }
        },
        methods: {
            //性别显示转换
            // formatStatus: function(row,column){
            //     return row.rolestatus == 1 ? '' : row.sex== 0 ?'女' :'未知';
            // },
            //获取所有的用户
            getAllRoles(){
                let  _this=this;
                _this.$axios({
                    method:'POST',
                    url:'http://127.0.0.1:8081/role/all',
                    data:{
                        pageSize:_this.pageSize,
                        pageNum:_this.pageNum
                    }
                }).then(res => {
                    _this.roles=res.data.rolelist;
                    _this.total=res.data.pageTotal;
                })
            },
            //获取用户状态
            getRoleStatus(index,row){
                if(this.roles[index].rolestatus===1){
                    return true;
                }
                else{
                    return false;
                }
                // return this.roles[index].status===1 ? true: false ;
            },
            //通过姓名查询用户列表
            getUserByName(){
                let _this=this;
                if(_this.filters.name==null||_this.filters.name==""){
                    _this.getAllRoles();
                }
                else{

                    _this.$axios({
                    method: 'POST',
                    url: 'http://127.0.0.1:8081/role/getRoleByName',
                    data:{
                        rolename:_this.filters.name
                    }
                    }).then(res => {
                        _this.total=res.data.total;
                        _this.roles=res.data.rolelist;
                    })
                }
            },
            //删除用户
            handleDel(index,row){
                    let role=this.roles[index];
                    role.createtime= (!role.createtime || role.createtime == '') ? '' : util.formatDate.format(new Date(role.createtime), 'yyyy-MM-dd hh:mm:ss');
                    this.$axios({
                        method: 'POST',
                        url: 'http://127.0.0.1:8081/role/deleteRole',
                        data:{
                            role:role
                        }
                        }).then(res => {
                            if(res.data.code==="200"){
                                this.$message({
                                    message:'删除成功',
                                    type:'success'
                                });
                            }
                            else{
                                this.$message({
                                    message:'删除失败',
                                    type:'error'
                                });
                            }
                        this.getAllRoles();
                    })
            },
            //批量删除用户
            batchdelete(){
                //console.log(this.sels)
                this.ids=[];
                for(let i=0;i<this.sels.length;i++){
                     this.ids.push(this.sels[i].id)
                }
                this.$axios({
                        method: 'POST',
                        url: 'http://127.0.0.1:8081/role/deleteBatch',
                        data:{
                            ids:this.ids
                        }
                        }).then(res => {
                            if(res.data.code=="200"){
                                this.$message({
                                    message:'删除成功',
                                    type:'success'
                                });
                            }
                            else{
                                this.$message({
                                    message:'删除失败',
                                    type:'error'
                                });
                            }
                            this.getAllRoles();
                    })
                // this.getAllUser();
            },
            //显示编辑界面
            handleEdit(index,row){
                this.editFormVisible=true;
                this.editForm=this.roles[index];
            },
            //编辑界面提交
            editSubmit(){
                this.$refs.editForm.validate((valid) => {
					if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editForm.createtime= (!this.editForm.createtime || this.editForm.createtime == '') ? '' : util.formatDate.format(new Date(this.editForm.createtime), 'yyyy-MM-dd hh:mm:ss');
                        this.editForm.updatetime= (!this.editForm.updatetime || this.editForm.updatetime == '') ? '' : util.formatDate.format(new Date(), 'yyyy-MM-dd hh:mm:ss');
                        this.$axios({
                            method: 'POST',
                            url: 'http://127.0.0.1:8081/role/updateRole',
                            data:{
                                role:this.editForm
                            }
                            }).then(res => {
                                if(res.data.code=="200"){
                                    this.$message({
                                    message:'提交成功',
                                    type:'success'
                                    });
                                }
                                else{
                                    this.$message({
                                    message:'提交失败',
                                    type:'error'
                                    });
                                }
                               this.$refs['editForm'].resetFields();
                               this.editFormVisible=false;
                               this.getAllRoles();
                            })
                        })
                    }
                })
                
            },
            //显示新增界面
            handleAdd(){
                this.addFormVisible=true;
            },
            //新增界面提交
            addSubmit(){

                this.$refs.addForm.validate((valid) => {
                    if(valid){
                        this.$confirm('确认提交吗？','提交', {}).then(() => {
                            this.addForm.createtime= (!this.addForm.createtime || this.addForm.createtime == '') ? '' : util.formatDate.format(new Date(this.addForm.createtime), 'yyyy-MM-dd hh:mm:ss');
                            this.addForm.updatetime= (!this.addForm.updatetime || this.addForm.updatetime == '') ? '' : util.formatDate.format(new Date(this.addForm.updatetime), 'yyyy-MM-dd hh:mm:ss');
                            this.$axios({
                                method: 'POST',
                                url: 'http://127.0.0.1:8081/role/addRole',
                                data:{
                                    role:this.addForm
                                }
                                }).then(res => {
                                    if(res.data.code=="200"){
                                        this.$message({
                                            message:'新增成功',
                                            type:'success'
                                        });
                                    }
                                    else{
                                        this.$message({
                                            message:'新增失败',
                                            type:'error'
                                        });
                                    }
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible=false;
                                this.getAllRoles();
                                this.addForm={
                                        realname:'',
                                        sex:-1,
                                        age:0,
                                        birthday:'',
                                        address:'',
                                }
                            })
                        })
                    }
                })
            },
            //获取选中的列表
            selsChange: function (sels) {
                this.sels = sels;
            },
            //改变分页框中的当前页
            handleCurrentChange(){
                this.pageNum=this.currentpage;
                this.getAllRoles();
            },
            //分页前进
            prevChange(){
                
            },
            //分页后退
            nextChange(){

            },

        },
        mounted() {
            this.getAllRoles();
        },
        created(){

        },
        beforeDestroy(){

        },
    }

</script>

<style scoped>

</style>