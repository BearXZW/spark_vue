<template>
    <section>
        <el-col :span="12" v-for="cpu in cpulist" :key="cpu.core">
			<div :id="cpu.cpuindex" style="width:100%;height:400px;margin-right:50px"></div>
		</el-col>

        <el-col>
            <div id="CpuUsageChange" style="width:100%;height:800px;margin-right:50px"></div>
        </el-col>
    </section>
</template>


<script>
import echarts from 'echarts'
    export default {
        data() {
            return {
                cpulist:[],
                cpucore:0,
                cpuusage:[],
                intervalid:null,
            }
        },
        methods: {
            drawChartCpulist(){
                let _this=this;
                for(let i=0;i<_this.cpulist.length;i++){
                    let TotalUsage=_this.cpulist[i].TotalUsage;
                    let FreeUsage=100-_this.cpulist[i].TotalUsage;
                    let ChartCpuName=_this.cpulist[i].cpuindex;
                    _this.chartColumn = echarts.init(document.getElementById(ChartCpuName));
                    _this.chartColumn.setOption({
					title : {
						text: 'CPU'+(i+1)+'使用率',
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
								return name+" "+TotalUsage+"%"
							}
							else{
								return name+" "+FreeUsage+"%"
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
								{value:TotalUsage, name:'已使用'},
								{value:FreeUsage, name:'未使用'},
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
                }
            },
            drawChartCpuChange(){
                let _this=this;
                _this.chartColumn = echarts.init(document.getElementById('CpuUsageChange'));
                var usage=[];
                // 定义二维数组
                for(let i=0;i<_this.cpuusage.length;i++){
                    usage[i]=new Array();
                }
                var time=[];
                //导入CPU的编号
                var sign=new Array();
                for(let i=0;i<_this.cpuusage.length;i++){
                    sign[i]="cpu"+(i+1);
                }
                //导入cpu的利用率
                for(let i=0;i<_this.cpuusage.length;i++){
                    for(let j=0;j<_this.cpuusage[i].cpu.length;j++){
                        usage[i].push(_this.cpuusage[i].cpu[j].combindusage);
                    }
                }
                //导入时间
                  for(let i=0;i<_this.cpuusage.length;i++){
                    for(let j=0;j<_this.cpuusage[i].cpu.length;j++){
                        time.push(_this.cpuusage[i].cpu[j].createtime);
                    }
                    break;
                }
                
                var option = {
                        title: {
                            text: 'CPU利用率'
                        },
                        tooltip: {
                            trigger: 'axis',
                            formatter: '{b}<br/>{a0}: {c0}%<br/>{a1}: {c1}%<br/>{a2}: {c2}%<br/>{a3}: {c3}%<br/>{a4}: {c4}%<br/>{a5}: {c5}%<br/>{a6}: {c6}%<br/>{a7}: {c7}%<br/>'
                        },
                        legend: {
                            data:sign
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
                            max:100,
                        },
                        series: function(){
                            var seriesdata=[];
                            for(let i=0;i<_this.cpuusage.length;i++){
                                var item={
                                    name:sign[i],
                                    type:'line',
                                    //stack:'总量',
                                    data:usage[i],
                                }
                                seriesdata.push(item)
                            }
                            return seriesdata;
                        }(),
                    };
                _this.chartColumn.setOption(option);
            },
            drawCharts() {
                this.drawChartCpulist()
                this.drawChartCpuChange()
            },

        },

        mounted: function() {
                this.drawCharts()
        },
        created:function(){
			let _this=this;
			this.intervalid = setInterval(() => {
                //获取CPU系列的值
                _this.$axios({
                    method: 'POST',
                    url: 'http://127.0.0.1:8081/SystemInfo/cpu',
                    }).then(res => {
                        _this.cpulist=res.data.cpu;
                        _this.cpucore=_this.cpulist.length;
                        for(let i=0;i<_this.cpulist.length;i++){
                            _this.cpulist[i].cpuindex="ChartCpu"+(i+1);
                            _this.cpulist[i].TotalUsage=parseFloat(_this.cpulist[i].TotalUsage.replace("%",""));
                        }
                    })
              

                //获取CPU连续变化的值
                _this.$axios({
                    method: 'POST',
                    url: 'http://127.0.0.1:8081/sysinfo/cpu',
                    }).then(res => {
                        
                        for(let i=0;i<res.data.cpulist.length;i++){
                            _this.cpuusage[i]=res.data.cpulist[i];
                            for(let j=0;j<_this.cpuusage[i].cpu.length;j++){
                                _this.cpuusage[i].cpu[j].combindusage=parseFloat(_this.cpuusage[i].cpu[j].combindusage.replace("%",""));
                                var datetem=new Date(_this.cpuusage[i].cpu[j].createtime).toJSON();
                                _this.cpuusage[i].cpu[j].createtime=new Date(+new Date(datetem)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
                            }
                        }
                    })   
                },1000)
		},
		beforeDestroy () {
			clearInterval(this.intervalid)
		},
        updated: function(){
                this.drawCharts()
        }

}
</script>

<style>


</style>
