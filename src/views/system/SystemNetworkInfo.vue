<template>
    <section>
       <el-form  label-width="100px" style="margin:20px;width:60%;min-width:600px;">
				<el-form-item label="网络地址">
					<el-input v-model="address" style="width:280px;margin-left:15px" :readonly="true"></el-input>
				</el-form-item>
       </el-form>

        <el-col>
            <div id="Network" style="width:100%;height:600px;margin-right:50px"></div>
        </el-col>
    </section>
</template>

<script>
import echarts from 'echarts'
export default {
    
    data()  {
        return{
            
            address:'',
            
           
            Network:[]
           
        }
    },
    methods: {
        drawChartNetwork(){
            let _this=this;
            let time=[];
            let txdata=[];
            let rxdata=[];
            for(let i=0;i<_this.Network.length;i++){
                var datetem=new Date(_this.Network[i].createtime).toJSON();
                time.push(new Date(+new Date(datetem)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,''));
                txdata.push(parseFloat(_this.Network[i].txtotal));
                rxdata.push(parseFloat(_this.Network[i].rxtotal));
            }
            _this.chartNetwork = echarts.init(document.getElementById('Network'));
            var option = {
                        title: {
                            text: '网络数据流量变化'
                        },
                        tooltip: {
                            trigger: 'axis',
                            formatter: '{b}<br/>{a0}: {c0}<br/>{a1}: {c1}<br/>'
                        },
                        legend: {
                            data:['接收的总字节数','传输的总字节数']
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
                        },
                        series: [
                            {
                                name:'接收的总字节数',
                                type:'line',
                                data: rxdata
                            },
                            {
                                name:'传输的总字节数',
                                type:'line',
                                data: txdata
                            },
                        ]
                    };
            _this.chartNetwork.setOption(option);
        },
        drawCharts(){
            this.drawChartNetwork();
        }
    },
    mounted: function(){   
    },

    created: function(){
        let _this=this;
        this.intervalid = setInterval(() => {
                this.drawCharts()
                //获取JVM当前的值
                _this.$axios({
                    method: 'POST',
                    url: 'http://127.0.0.1:8081/sysinfo/network',
                    }).then(res => {
                       _this.address=res.data.network[0].address;
                       _this.Network=res.data.network;
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
