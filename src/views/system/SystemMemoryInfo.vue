<template>
    <section>
        <el-col :span="12">
			<div id="Memory" style="width:100%;height:400px;margin-right:50px"></div>
		</el-col>

        <el-col>
            <div id="MemoryUsageChange" style="width:100%;height:600px;margin-right:50px"></div>
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
                Memory:{
                    used:'',
                    free:'',
                    total:'',
                },
                MemoryUsage:[],
                intervalid:null,
            }
        },
    methods:{
            drawChartMemory(){
                let _this=this;
                let MemoryUsed=parseFloat(_this.Memory.used.replace('G', '')); 
				let MemoryFree=parseFloat(_this.Memory.free.replace('G', '')); 
                _this.chartmemory = echarts.init(document.getElementById('Memory'));
                _this.chartmemory.setOption({
				    title : {
						text: '内存使用率',
						x:'center'
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
            drawMemoryUsageChange(){
                let _this=this;
                let time=[];
                let usage=[];
                for(let i=0;i<_this.MemoryUsage.length;i++){
                    time.push(_this.MemoryUsage[i].createtime);
                    usage.push((_this.MemoryUsage[i].usedpercent));
                }
               
                _this.chartmemory = echarts.init(document.getElementById('MemoryUsageChange'));

                var option={
                        title: {
                            text: '内存使用率变化'
                        },
                        tooltip: {
                            trigger: 'axis',
                             formatter: '{a}: {c}%'
                        },
                        legend: {
                            data:['系统内存变化']
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
                                name:'内存',
                                type:'line',
                                stack: '总量',
                                data: usage
                            }
                        ]
                    };
                this.chartmemory.setOption(option)
            },
            drawCharts() {
                this.drawChartMemory()
                this.drawMemoryUsageChange()
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
                    url: 'http://127.0.0.1:8081/SystemInfo/memory',
                    }).then(res => {
                        _this.Memory.used=res.data.MemoryUsed;
                        _this.Memory.free=res.data.MemoryFree;
                        _this.Memory.total=res.data.MemoryTotal;
                    })
                _this.$axios({
                    method: 'POST',
                    url: 'http://127.0.0.1:8081/sysinfo/memory',
                    }).then(res => {
                        _this.MemoryUsage=res.data.memory;
                        for(let i=0;i<_this.MemoryUsage.length;i++){
                            var datetem=new Date( _this.MemoryUsage[i].createtime).toJSON();
                            _this.MemoryUsage[i].createtime=new Date(+new Date(datetem)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
                            _this.MemoryUsage[i].used=parseFloat( _this.MemoryUsage[i].used).toFixed(2);
                            _this.MemoryUsage[i].total=parseFloat( _this.MemoryUsage[i].total).toFixed(2);
                            _this.MemoryUsage[i].usedpercent=parseFloat(_this.MemoryUsage[i].usedpercent).toFixed(2);
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
