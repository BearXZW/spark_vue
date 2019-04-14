<template >
	<section>
		<div style="float:left;">
			<el-form ref="form" :model="form" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
				<el-form-item label="主机名称">
					<el-input v-model="form.HostName" style="width:280px;margin-left:15px" :readonly="true"></el-input>
				</el-form-item>
				<el-form-item label="主机地址">
					<el-input v-model="form.HostAddress" style="width:280px;margin-left:15px" :readonly="true"></el-input>
				</el-form-item>
				<el-form-item label="CPU型号">
					<el-input v-model="form.CpuModel" style="width:280px;margin-left:15px" :readonly="true"></el-input>
				</el-form-item>
				<el-form-item label="CPU核心数">
					<el-input v-model="form.CpuCore" style="width:280px;margin-left:15px" :readonly="true"></el-input>
				</el-form-item>
				<el-form-item label="JVM总内存">
					<el-input v-model="form.JVM" style="width:280px;margin-left:15px" :readonly="true"></el-input>
				</el-form-item>
				<el-form-item label="系统总内存">
					<el-input v-model="form.Memory" style="width:280px;margin-left:15px" :readonly="true"></el-input>
				</el-form-item>
			</el-form>
			<div style="margin-top:25px">
				<el-col :span="12">
					<div id="chartmemory" style="width:100%;height:400px;margin-right:50px"></div>
				</el-col>
				<el-col :span="12">
					<div id="chartjvm" style="width:100%;height:400px;"></div>
				</el-col>
			</div>
		</div>
		<template>
			<div style="float:left;margin-right:100px">
			  <el-table :data="table" style="width: 100%">
      			<el-table-column prop="CpuCore" label="CPU核心" width="180px"></el-table-column>
      			<el-table-column prop="TotalUsage" label="CPU总利用率" width="180px"></el-table-column>
				<el-table-column prop="SystemUsage" label="CPU系统利用率" width="180px"></el-table-column>
				<el-table-column prop="UserUsage" label="CPU用户利用率" width="180px"></el-table-column>
    			</el-table>
			</div>

		</template>

	</section>
</template>


<script>
 import echarts from 'echarts'
	export default {
		data() {
			return {
				form: {
					HostName: '',
					HostAddress: '',
					CpuModel: '',
					CpuCore: '',
					Memory: '',
					JVM: '',
				},
				table:[],
				memory:{
					used:'',
					free:'',
				},
				JVM:{
					used:'',
					free:'',
				},
				intervalid:null
				
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			drawchartmemory() {
				let _this=this;
				let MemoryUsed=parseFloat(_this.memory.used.replace('G', '')); 
				let MemoryFree=parseFloat(_this.memory.free.replace('G', '')); 
				_this.chartColumn = echarts.init(document.getElementById('chartmemory'));
				_this.chartColumn.setOption({
					title : {
						text: '内存使用率',
						x:'130'
					},
					tooltip : {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c}G ({d}%)"
					},
					legend: {
						orient: 'vertical',
						left: 'left',
						data: ['已使用','未使用'],
						formatter:function(name){
							if(name=="已使用"){
								return name+" "+MemoryUsed+"G"
							}
							else{
								return name+" "+MemoryFree+"G"
							}
						}
					},
					series : [
						{
							name: '内存使用率',
							type: 'pie',
							radius : '55%',
							center: ['50%', '60%'],
							data:[
								{value:MemoryUsed, name:'已使用'},
								{value:MemoryFree, name:'未使用'},
							],
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							}
						}
					]
				});
			},
			drawjvm(){
				let _this=this;
				let JvmUsed=parseFloat(_this.JVM.used.replace('M', '')); 
				let JvmFree=parseFloat(_this.JVM.free.replace('M', '')); 
				this.chartColumn = echarts.init(document.getElementById('chartjvm'));
				this.chartColumn.setOption({
					title : {
						text: 'JVM使用率',
						x:'130',
					},
					tooltip : {
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c}M ({d}%)"
					},
					legend: {
						orient: 'vertical',
						left: 'left',
						data: ['已使用','未使用'],
						formatter:function(name){
							if(name=="已使用"){
								return name+" "+JvmUsed+"M"
							}
							else{
								return name+" "+JvmFree+"M"
							}
						}
					},
					series : [
						{
							name: 'JVM使用率',
							type: 'pie',
							radius : '55%',
							center: ['50%', '60%'],
							data:[
								{value:JvmUsed, name:'已使用'},
								{value:JvmFree, name:'未使用'},
							],
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							}
						}
					]
				});
			},
			drawCharts() {
                this.drawchartmemory()
                this.drawjvm()
            },
		},
		mounted: function () {
			this.drawCharts()
			let _this=this;
			 _this.$axios({
				method: 'POST',
				url: 'http://127.0.0.1:8081/SystemInfo/info',
				}).then(res => {
					_this.form.HostName=res.data.HostName;
					_this.form.HostAddress=res.data.HostAddress;
					_this.form.CpuModel=res.data.CpuModel;
					_this.form.CpuCore=res.data.CpuCore;
					_this.form.Memory=res.data.Memory;
					_this.form.JVM=res.data.JvmMemory;
				})
		},
		created:function(){
			let _this=this;
			this.intervalid = setInterval(() => {
				_this.$axios({
					method: 'POST',
					url: 'http://127.0.0.1:8081/SystemInfo/cpu',
					}).then(res => {
						_this.table=res.data.cpu;
				})
				_this.$axios({
					method: 'POST',
					url: 'http://127.0.0.1:8081/SystemInfo/memory',
					}).then(res => {
						_this.memory.used=res.data.MemoryUsed;
						_this.memory.free=res.data.MemoryFree;										
				}),
				_this.$axios({
					method: 'POST',
					url: 'http://127.0.0.1:8081/SystemInfo/jvm',
					}).then(res => {
						_this.JVM.used=res.data.JvmUsed;
						_this.JVM.free=res.data.JvmFree;							
				})
				},1000)
		},
		beforeDestroy () {
			clearInterval(this.intervalid)
		},
        updated: function () {
            this.drawCharts()
        }
	}

</script>
