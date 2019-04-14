<template>
    <section>
        <el-col :span="12">
			<div id="JVM" style="width:100%;height:400px;margin-right:50px"></div>
		</el-col>

        <el-col>
            <div id="JVMUsageChange" style="width:100%;height:600px;margin-right:50px"></div>
        </el-col>
    </section>
</template>

<script>
import echarts from 'echarts'
import { scrypt } from 'crypto';
import { setTimeout } from 'timers';
export default {
    data() {
            return {
                JVM:{
                    used:'',
                    free:'',
                    total:'',
                },
                JVMUsage:[],
                intervalid:null,
            }
        },
    methods:{
            drawChartJVM(){
                let _this=this;
                let JvmUsed=parseFloat(_this.JVM.used.replace('M', '')); 
				let JvmFree=parseFloat(_this.JVM.free.replace('M', '')); 
                _this.chartjvm = echarts.init(document.getElementById('JVM'));
                _this.chartjvm.setOption({
				    title : {
						text: 'JVM使用率',
						x:'center'
					},
					tooltip : {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c}M ({d}%)"
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
            drawJVMUsageChange(){
                let _this=this;
                let time=[];
                let usage=[];
                for(let i=0;i<_this.JVMUsage.length;i++){
                    time.push(_this.JVMUsage[i].createtime);
                    usage.push(((_this.JVMUsage[i].used/_this.JVMUsage[i].total)*100).toFixed(2));
                }
               
                _this.chartjvm = echarts.init(document.getElementById('JVMUsageChange'));

                var option={
                        title: {
                            text: 'JVM内存'
                        },
                        tooltip: {
                            trigger: 'axis',
                             formatter: '{a}: {c}%'
                        },
                        legend: {
                            data:['JVM内存变化']
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: time
                        },
                        yAxis: {
                            type: 'value',
                            min:0,
                            max:100
                        },
                        series: [
                            {
                                name:'JVM',
                                type:'line',
                                stack: '总量',
                                data: usage
                            }
                        ]
                    };
                this.chartjvm.setOption(option)
            },
            drawCharts() {
                this.drawChartJVM()
                this.drawJVMUsageChange()
            },
    },
    mounted:function(){    
    },
    created:function(){
        let _this=this;
        this.intervalid = setInterval(() => {
                this.drawCharts()
                //获取JVM当前的值
                _this.$axios({
                    method: 'POST',
                    url: 'http://127.0.0.1:8081/SystemInfo/jvm',
                    }).then(res => {
                        _this.JVM.used=res.data.JvmUsed;
                        _this.JVM.free=res.data.JvmFree;
                    })
                _this.$axios({
                    method: 'POST',
                    url: 'http://127.0.0.1:8081/sysinfo/jvm',
                    }).then(res => {
                        _this.JVMUsage=res.data.jvm;
                        for(let i=0;i<_this.JVMUsage.length;i++){
                            var datetem=new Date(_this.JVMUsage[i].createtime).toJSON();
                            _this.JVMUsage[i].createtime=new Date(+new Date(datetem)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
                            _this.JVMUsage[i].used=parseFloat(_this.JVMUsage[i].used).toFixed(1);
                            _this.JVMUsage[i].free=parseFloat(_this.JVMUsage[i].free).toFixed(1);
                            _this.JVMUsage[i].total=parseFloat(_this.JVMUsage[i].total).toFixed(1);
                        }
                    })
            },1000)
    },
    beforeDestroy () {
        clearInterval(this.intervalid)
    },
    updated:function(){
            this.drawCharts()
    },
}
</script>

<style>

</style>
