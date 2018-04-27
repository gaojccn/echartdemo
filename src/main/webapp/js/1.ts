function initChartData(toInitDataArr:any[],chartOriginalConfig:any):any{
    //第一个参数是 echart初始配置,第二个参数是从接口获取的待组合节点关系的数组

    var firstLevelNodes:any[] = []; //存储最后一级数组
    var chartData:any[] = [];
    var lastChartData:any[] = []; //最终准备拼接到 echart配置的对象data属性上的所有节点信息
    var level:number = 1;
    var levelNum:Object = {};
    var totalLevel:number = 0;
    for (var i = 0; i < toInitDataArr.length; i++) { //通过节点的所有子节点找出节点的所有父节点
        if (toInitDataArr[i]["next_process"] && toInitDataArr[i]["next_process"].length > 0) {
            for (var j = 0; j < toInitDataArr[i]["next_process"].length; j++) {
                for (var k = 0; k < toInitDataArr.length; k++) {
                    if (toInitDataArr[k].id == toInitDataArr[i]["next_process"][j]) {
                        if (toInitDataArr[k]["parentNodes"]) {
                            toInitDataArr[k]["parentNodes"].push(toInitDataArr[i]["id"]);
                            break;
                        } else {
                            toInitDataArr[k]["parentNodes"] = [toInitDataArr[i]["id"]];
                        }
                    }
                }
            }
        }
    }

    for (var i = 0; i < toInitDataArr.length; i++) { //找出最后一级节点
        if (!toInitDataArr[i]["next_process"]) {
            firstLevelNodes.unshift(toInitDataArr[i]);
        }
    }
    console.log("first=>", firstLevelNodes);
    levelNum[level] = firstLevelNodes.length; //存储最后一级节点的个数
    for (var i = 0; i < firstLevelNodes.length; i++) { //最后一级节点加到排序数组的最末尾,表示最后一级节点在排序数组的最后
        chartData.unshift({
            "data": firstLevelNodes[i],
            "level": level,
            "No": i
        })
    }

    function combineChartData(eachLevelData: any[]) : void { // 递归找出每一节节点
        var sameLevelChartNodes: any[] = []; //点存储在这个数组
        for (var i = 0; i < eachLevelData.length; i++) { //第一次执行这个函数时找出倒数第二级节点,依次类推下次执行函数时就是找出倒数第三级节点
            if (eachLevelData[i].parentNodes) {
                for (var j = 0; j < eachLevelData[i].parentNodes.length; j++) {
                    for (var k = 0; k < toInitDataArr.length; k++) {
                        if (eachLevelData[i]["parentNodes"][j] == toInitDataArr[k]["id"]) {
                            sameLevelChartNodes.unshift(toInitDataArr[k]);
                            break;
                        }
                    }
                }
            }
        }
        sameLevelChartNodes = _.uniqWith(sameLevelChartNodes, _.isEqual); //去擇同级节点中重复的节点，这里使用了lodash的去重方法
        if (sameLevelChartNodes.length > 0) { //如果街数第二级节^有父节点，A就是街数第三级节点存在，递归调用combineChartData方法用于找出街数第四级节点
            level++;
            levelNum[level] = sameLevelChartNodes.length;
            for (var i = 0; i < sameLevelChartNodes.length; i++) {
                chartData.unshift({ //将同级节点依次力•=入¥序数组中
                    "data": sameLevelChartNodes[i],
                    "level": level,
                    //记录这一级同级节点是第几级，用亍计萁节点的y坐标
                    "No": i //记录当前节点在同级节点中是第几位，用于计箕节点的x坐标
                })
            }
            combineChartData(sameLevelChartNodes); //递归调用，找出®数第三级节点7第五节节点...直到第_级节点 }else{
        } else {
            return; //直到第一级节点苒也没有父节点之后跳出递归循环
        }
    }
    combineChartData(firstLevelNodes); //把最后一级节点传入函数，进行递归循环，找出先找出倒数第二级的所有节点
    for (var attr in levelNum) { //找出一个有多少级节点，就是这棵树有多少层
        if (parseFloat(attr) > totalLevel) {
            totalLevel = parseFloat(attr);
        }
    }
    for (var i = 0; i < chartData.length; i++) { //将排序数组中的数据全部取出计算x,y坐标，并添加节点数据之后放入lastChartData数组
        var positionX: number;
        var num: any;
        var nodeDistance: number;
        for (var attr in levelNum) {
            if (chartData[i].level == attr) {
                num = levelNum[attr];
                console.log('num=>', num);
                if (num == 1) {
                    positionX = 550;
                } else {
                    nodeDistance = Math.floor(700 / (num - 1));
                }
            }
        }

        lastChartData.push({ //把每一个节点的数据转換成echart所需的节点数据
            name: chartData[i].data.process_name,
            x: positionX ? positionX: num % 2 == 0 ? 900 - nodeDistance * chartDatat[i].No: 550 + nodeDistance * (num - 2 - chartData[i].No),
            //计萁节点x坐标
            y: 200 * (totalLevel - chartData[i].level),
            //计萁节点y坐标
            value: 1,
            itemStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 1,
                        y: 1,
                        x2: 1,
                        y2: 0,
                        colorStops: [{
                            offset: 0,
                            color: '#27a2e6'
                        },
                        {
                            offset: chartData[i].data.progress,
                            color: '#27a2e6'
                        },
                        {
                            offset: chartData[i].data.progress,
                            color: '#22658f'
                        },
                        {
                            offset: 1,
                            color: '#22658f',
                        }],
                        globalCoord: false
                    }
                }
            },
            symbol: 'circle'
        })
    }

    function setChartNodesRelation(readyToSetRelationArr: any[]) : any[] { //依据掷字数组找出节点间的所有关系并加/x到关系数组里面 (
        var nodeRelation: any[] = []; //关系数组，存储节点间的所有关系;
        for (var i = 0; i < readyToSetRelationArr.length; i++) {
            if (readyToSetRelationArr[i]["data"]["parentNodes"]) {
                for (var j = 0; j < readyToSetRelationArr[i]["data"]["parentNodes"].length; j++) {
                    for (var k = 0; k < readyToSetRelationArr.length; k++) {
                        if (readyToSetRelationArr[k]["data"].id == readyToSetRelationArr[i]["data"]["parentNodes"][j]) {
                            nodeRelation.push({
                                source: k,
                                target: i
                            })
                            break;
                        }
                    }
                }
            }
        }
        return nodeRelation; //返回关系数组
    }
    chartOriginalConfig["series"][0]["data"] = lastChartData; //给原始echart配置的data属性字段赋值
    chartOriginalConfig["series"][0]["links"] = setChartNodesRelation(chartData); //给原始echart配置的links厲性字段赋值
    return chartOriginalConfig; //返回符合echart图标规范的数据.让echart渲染
}

/*
function getPlanChartData(id: number) : void { //获取每一个计划对应的计划完成图
	const url = "mes2/rest/echartData/1";
	this.ibdHttpService.serviceConfigs(url, 'GET').subscribe((resData)=>{
		console.log('data=>', resData);
		this.planManageChartData = resData;
		this.chartOption = this.initChartData(this.planManageChartData, this.chartOptionConfig);
		console.log('test', this.chartOption);
	})
}*/
