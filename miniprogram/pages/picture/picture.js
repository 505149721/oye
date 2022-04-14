// miniprogram/pages/picture.js
import * as echarts from '../../components/ec-canvas/echarts.min';
const app=getApp();
let chartPie=null,chartBar=null;
let xList=[],outList=[],inList=[];
function setBarOption(){
  let option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [12, 20, 15, 8, 7, 11, 13],
        itemStyle:{ color :'#8fc97a'},
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ]
  };
  return option;
}

function setOption(){
  let option = {
    title: {
      text: 'Temperature Change in the Coming Week'
    },
    tooltip: {
      triggerOn: 'none',
      position: function (pt) {
        return [pt[0], 130];
      }
    },
    legend: {},
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        dataView: { readOnly: false },
        magicType: { type: ['line', 'bar'] },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      axisPointer:{
        handle:{
          show: true,
          color: '#7581BD'
        }
      },
      type: 'category',
      boundaryGap: false,
      data: xList
    },
    yAxis: {
      
      type: 'value',
      axisLabel: {
        show:false
        // formatter: '{value} °C'
      }
    },
    series: [
      {
        name: '支出',
        type: 'line',
        data:outList,
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: 'Avg' }]
        }
      },
      {
        name: '收入',
        type: 'line',
        data:inList,
        markPoint: {
          data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }]
        },
        markLine: {
          data: [
            { type: 'average', name: 'Avg' },
            [
              {
                symbol: 'none',
                x: '90%',
                yAxis: 'max'
              },
              {
                symbol: 'circle',
                label: {
                  position: 'start',
                  formatter: 'Max'
                },
                type: 'max',
                name: '最高点'
              }
            ]
          ]
        }
      }
    ]
  };
  return option;
};
Page({

  data: {
    arr:['周','月','年'],
    index:0,//表示周月日的选择
    num:0,//表示到目前时间的周数
    num2:0,//表示某月的天数
    TabCur:0,
    TabCur_2:0,
    TabCur_3:0,
    weekDate:[],
    inList:[],
    outList:[],
    firstDate:null,
    firstDate_2:null,
    

    ec: {
      onInit: function (canvas, width, height, dpr) {
        chartPie = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr 
        });
        canvas.setChart(chartPie);
        let option = setOption();
        if (option) chartPie.setOption(option);
        return chartPie;
      }
    },
    bar:{
      onInit: function (canvas, width, height, dpr) {
        chartBar = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr 
        });
        canvas.setChart(chartBar);
        let option = setBarOption();
        if (option) chartBar.setOption(option);
        return chartBar;
      }
    },
    timeObj:{
      year:null,
      month:null,
      day:null,
      week:null
    }
  },
  
  onLoad: function (options) {
    // 设置 当前时间& firstDate
    this.setTimeObj();
    this.setFirstDate(this.data.time);
    console.log(this.data.firstDate);

    // 设置x轴日期
    this.setDate(this.data.firstDate,1);
    console.log(this.data.firstDate);
    xList=this.data.weekDate;

    // 设置y轴数据
    this.setOpData(this.data.firstDate,1);
    inList=this.data.inList;
    outList=this.data.outList;
  },

  // 设置时间及 当年周数
  setTimeObj(){
    let time=new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
    let timeObj={
      "year":time.getFullYear(),
      "month":time.getMonth()+1,
      "day":time.getDate(),
      "week":time.getDay()
        };
    let firstDate_2=new Date(new Date().getFullYear(),new Date().getMonth(),1);
    this.setData({
      timeObj:timeObj,
      firstDate_2:firstDate_2,
      time:time
    });
    let flag=false,i=1,time2;
    while(!flag){
      time2=new Date(timeObj.year,0,i++);
      if(time2.getDay()==1){
        flag=true;
      }
    }
    let  num=(time.getTime()-time2.getTime())/(1000*60*60*24);
    num=Math.ceil(num/7);
    this.setData({
      num:num,
      TabCur:num-1,
      TabCur_2:timeObj.month-1,
    })
  },
  // 在给定日期上加减日期
  addDate(date,n){    
    date.setDate(date.getDate()+n);  
    return date;

  },

  // 设置按周计算的开始日期
  setFirstDate(date){
    let week;
    if(date.getDay()==0){
      week=6;
    }else{
      week = date.getDay()-1;
    }
    date = this.addDate(date,week*-1);
    let firstDate=new Date(date.getFullYear(),date.getMonth(),date.getDate());
    this.setData({
      firstDate:firstDate 
    });
  },

  // 根据开始日期及 周/月的选择 设置x轴
  setDate(firstDate,flag){       
    let date=new Date(firstDate.getFullYear(),firstDate.getMonth(),firstDate.getDate());
    // currentFirstDate = new Date(date);
    let weekDate=[],item;
    let num= flag===1?7:new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
  
      for(let i = 0;i<num;i++){         
        item= i==0 ? date : this.addDate(date,1);   //星期一开始
        weekDate[i]=(item.getMonth()+1)+'-'+(item.getDate());
      } 
      this.setData({
        num2:num
      })
     
    this.setData({
      weekDate:weekDate,     
    });
    
  },
  // 根据开始日期及 周/月的选择 设置y轴数据
  setOpData(firstDate,flag){
    let date=new Date(firstDate.getFullYear(),firstDate.getMonth(),firstDate.getDate());
    let records=app.globalData.records;
    let inList=[],outList=[];
    let num= flag===1?7:this.data.num2;
    for(let i=0;i<num;i++){
      let year = parseInt(date.getFullYear()) ;
      let month=parseInt(date.getMonth()+1);
      let day=parseInt(date.getDate());
  
      if(!records[year]||!records[year][month]||!records[year][month][day]){
        inList[i]=0,outList[i]=0;
      }else{
        let record=records[year][month][day];
        let sum1=0,sum2=0;
        for(let j in record){
          if(record[j]["is"]==1){
            sum1+=parseInt(record[j]["cost"]) ;
          }else{
            sum2+=parseInt(record[j]["cost"]) ;
          }
        }
        inList[i]=sum2,outList[i]=sum1;

      }
      date=this.addDate(date,1);
      
    }
    this.setData({
      inList:inList,
      outList:outList
    });
    
  },
  // 设置当年每月的y轴数据
  setOpData_2(){
    let records=app.globalData.records;
    let year=new Date().getFullYear();
    let arr1=[],arr2=[];
    for(let i=0;i<12;i++){
      arr1[i]=0;
      arr2[i]=0;
      if(! records[year][i]){
        continue;
      }else{
        for(let day in records[year][i]){
          let record=records[year][i][day];
          record.forEach(function(item,index,arr){
            if(item.is===1){
              arr1[i]+=parseInt(item.cost);
            }else{
              arr2[i]+=parseInt(item.cost);
            }
          })
        }
      }
      
    }
    outList=arr1;
    inList=arr2;
    let option = setOption();
    if (option) chartPie.setOption(option);
  },
  // 根据tab差重新设置 开始日期
  changeFirstDate(value){
    let newDate=this.data.firstDate;
    this.addDate(newDate,7*value);
    this.setData({
      firstDate:newDate
    })
    
  },
  tabSelect_1(e){
    let index=e.currentTarget.dataset.index;
    this.setData({
      index:index
    });
    if(index==1){
      this.setDate(this.data.firstDate_2,2);
      xList=this.data.weekDate;
      this.setOpData(this.data.firstDate_2,2);
      inList=this.data.inList;
      outList=this.data.outList;
      let option = setOption();
    if (option) chartPie.setOption(option);
    }else if(index==2){
      xList=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月",];
      this.setOpData_2();
    }
  },
  tabSelect_2(e){
    let TabCur=e.currentTarget.dataset.id;
    let value=TabCur-this.data.TabCur;
    this.changeFirstDate(value);
    this.setDate(this.data.firstDate,1);
    xList=this.data.weekDate;
    this.setOpData(this.data.firstDate,1);
    inList=this.data.inList;
    outList=this.data.outList;
    let option = setOption();
    if (option) chartPie.setOption(option);
    this.setData({
      TabCur:TabCur
    })
  },
  tabSelect_3(e){
    let TabCur_2=e.currentTarget.dataset.id;
    let date=new Date(new Date().getFullYear(),TabCur_2,1 );  
    this.setDate(date,2);
      xList=this.data.weekDate;
      this.setOpData(date,2);
      inList=this.data.inList;
      outList=this.data.outList;
      let option = setOption();
    if (option) chartPie.setOption(option);
    this.setData({
      TabCur_2:TabCur_2
    })
  },
  tabSelect_4(e){}

})