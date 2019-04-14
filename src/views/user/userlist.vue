<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
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
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="realname" label="姓名" width="150" sortable>
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
			</el-table-column>
			<el-table-column prop="age" label="年龄" width="100" sortable>
			</el-table-column>
			<el-table-column prop="birthday" label="生日" width="200" sortable>
			</el-table-column>
			<el-table-column prop="address" label="地址" min-width="200" sortable>
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
				<el-form-item label="姓名" prop="realname">
					<el-input v-model="editForm.realname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birthday"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.address"></el-input>
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
				<el-form-item label="姓名" prop="realname">
					<el-input v-model="addForm.realname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birthday"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.address"></el-input>
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
                users:[],
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
                    realname:[
                            {required:true, message:'请输入姓名',trigger:'blur'}
                        ]
                },
                //编辑界面的工具
                editForm:{
                    id:0,
                    realname:'',
                    sex:-1,
                    age:0,
                    birthday:'',
                    address:''                
                },

                addFormVisible:false,//新增界面是否显示
                addLoading:false,
                addFormRules:{
                    realname:[
                            { required: true, message:'请输入姓名', trigger: 'blur' }
                        ]
                },
                //新增界面数据
                addForm:{
                    realname:'',
                    sex:-1,
                    age:0,
                    birthday:'',
                    address:'',
                }
            }
        },
        methods: {

            //性别显示转换
            formatSex: function(row,column){
                return row.sex == 1 ? '男' : row.sex== 0 ?'女' :'未知';
            },
            //获取所有的用户
            getAllUser(){
                let  _this=this;
                _this.$axios({
                    method:'POST',
                    url:'http://127.0.0.1:8081/userinfo/all',
                    data:{
                        pageSize:_this.pageSize,
                        pageNum:_this.pageNum
                    }
                }).then(res => {
                    _this.users=res.data.userinfo;
                    _this.total=res.data.pageTotal;
                    for(let i=0;i<_this.users.length;i++){
                        var datetem=new Date(_this.users[i].birthday).toJSON();
                        _this.users[i].birthday=new Date(+new Date(datetem)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
                    }
                })
            },
            //通过姓名查询用户列表
            getUserByName(){
                let _this=this;
                if(_this.filters.name==null||_this.filters.name==""){
                    _this.getAllUser();
                }
                else{
                    _this.listLoading=false;
                    _this.$axios({
                    method: 'POST',
                    url: 'http://127.0.0.1:8081/userinfo/selectByName',
                    data:{
                        realname:_this.filters.name
                    }
                    }).then(res => {
                        if(res.data.code=="200"){
                            _this.users=res.data.userinfo;
                            _this.total=res.data.total;
                            for(let i=0;i<_this.users.length;i++){
                                var datetem=new Date(_this.users[i].birthday).toJSON();
                                _this.users[i].birthday=new Date(+new Date(datetem)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
                            }
                            this.$message({
                                message:'查询成功',
                                type:'success'
                            });
                        }
                        else{
                            this.$message({
                                message:'查询失败',
                                type:'error'
                            });
                        }
                    })
                }
            },
            //删除用户
            handleDel(index,row){
                    let user=this.users[index];
                    //console.log(user)
                    user.birthday= (!user.birthday || user.birthday == '') ? '' : util.formatDate.format(new Date(user.birthday), 'yyyy-MM-dd');
                    this.$axios({
                        method: 'POST',
                        url: 'http://127.0.0.1:8081/userinfo/deleteUserinfo',
                        data:{
                            userinfo:user
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
                        this.getAllUser();
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
                        url: 'http://127.0.0.1:8081/userinfo/deletebatch',
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
                        this.getAllUser();
                    })
            },
            //显示编辑界面
            handleEdit(index,row){
                this.editFormVisible=true;
                this.editForm=this.users[index];
                //console.log(this.editForm)
                //this.editForm=Object.assign({},row);
            },
            //编辑界面提交
            editSubmit(){
                this.$refs.editForm.validate((valid) => {
					if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editForm.birthday= (!this.editForm.birthday || this.editForm.birthday == '') ? '' : util.formatDate.format(new Date(this.editForm.birthday), 'yyyy-MM-dd');
                        this.$axios({
                            method: 'POST',
                            url: 'http://127.0.0.1:8081/userinfo/updateUserinfo',
                            data:{
                                userinfo:this.editForm
                            }
                            }).then(res => {
                                if(res.data.code=="200"){
                                    this.$message({
                                        message:'提交成功',
                                        type:'success'
                                    });
                                }
                               this.$refs['editForm'].resetFields();
                               this.editFormVisible=false;
                               this.getAllUser();
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
                            this.addForm.birthday= (!this.addForm.birthday || this.addForm.birthday == '') ? '' : util.formatDate.format(new Date(this.addForm.birthday), 'yyyy-MM-dd');
                            this.$axios({
                                method: 'POST',
                                url: 'http://127.0.0.1:8081/userinfo/addUserinfo',
                                data:{
                                    userinfo:this.addForm
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
                                this.getAllUser();
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
                this.getAllUser();
            },
            //分页前进
            prevChange(){
                
            },
            //分页后退
            nextChange(){

            },

        },
        mounted() {
            this.getAllUser();
        },
        created(){

        },
        beforeDestroy(){

        },
    }

</script>

<style scoped>

</style>