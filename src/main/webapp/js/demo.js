 // alert("1.准备初始化echarts实例");
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option  = {
            title: {
                text: 'MES 生产流程监控'
            },
            color:'#19C6B6',
            tooltip: {
                show:true,
                trigger:'item',
                axisPointer:{
                    type:'shadow'
                },
                formatter:function(tipData){
                    if(tipData.value){
                        return tipData.name+':'+tipData.value+'%\r\n步骤:'+tipData.data.step;
                    }else{
                        return tipData.name;
                    }
                }
            },
            animation:true,
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series : [
                {
                    type: 'graph',
                    layout: 'none',
                    symbolSize: 50,
                    roam: true,
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    edgeSymbol: ['circle', 'arrow'],
                    edgeSymbolSize: [4, 10],
                    /*edgeLabel: {
                        normal: {
                            textStyle: {
                                fontSize: 20
                            }
                        }
                    },*/
                    left:'center',
                    top:'10%',
//                    data:[],
                    data: [{
                        name: '手工压膜',
                        x: 300,
                        y: 300,
                        value:78,
                        step:'1/2',
                        itemStyle:null
                    }, {
                        name: '自动压膜',
                        x: 550,
                        y: 300,
                        value:34,
                        step:'1/2',
                        itemStyle:null
                    }, {
                        name: '光固化抽检',
                        x: 550,
                        y: 100,
                        value:100,
                        step:'1/2',
                        itemStyle:null
                    }, {
                        name: '打磨质检',
                        x: 550,
                        y: 500,
                        value:100,
                        step:'1/2',
                        itemStyle:null
                    }],
//                     links: [],
                    links: [
                     {
                        source: '光固化抽检',
                        target: '手工压膜'
                    }, {
                        source: '光固化抽检',
                        target: '自动压膜'
                    }, {
                        source: '自动压膜',
                        target: '打磨质检'
                    }, {
                        source: '手工压膜',
                        target: '打磨质检'
                    }],
                    lineStyle: {
                        normal: {
                            opacity: 0.9,
                            width: 2,
                            curveness: 0
                        }
                    }
                }
            ]
        };

        var data=option["series"][0].data;
        for(let i = 0;i<data.length;i++){
            var itemStyle={
                 normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops:[{
                                    offset: 0,
                                    color: '#19C6B6'
                                },
                                {
                                    offset: data[i].value/100,
                                    color: '#19C6B6'
                                },
                                {
                                    offset: data[i].value/100,
                                    color: '#B5FFD8'
                                },
                                {
                                    offset: 1,
                                    color: '#B5FFD8'
                                }]
                    }
                }
            };
            data[i].itemStyle=itemStyle;
        }

        //alert("2.准备指定配置项");
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        myChart.on("click", function (param){
            alert(param.dataIndex+':'+option.series[0].data[param.dataIndex].name);
        });
        // 相当于 document.ready，{代码}
        $(function(){
            // alert("3.页面加载完毕");
        })