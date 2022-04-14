// miniprogram/pages/record/record.js
const iconData=require('../../utils/icons')
const app=getApp()
Page({

  data: {
    cIcons:[],
    tabIndex:1,
    iconIndex:0,
    inputIcons:[],
    outputIcons:[],
    cost:null,
    ps:null,
    date:null,
    timeObj:{
      year:null,
      month:null,
      day:null
    },
  },

  onLoad: function (options) {
    let icons=iconData.icons;
    this.setData({
      inputIcons:icons.input,
      outputIcon:icons.output,
      cIcons:icons.output
    });
    let time=new Date();
    
    let timeObj={};
    timeObj.year=time.getFullYear();
    timeObj.month=time.getMonth()+1;
    timeObj.day=time.getDate();
    this.setData({
      timeObj:timeObj
      }
    );
    
  },
  setNewDate:function(e){
    let arr=e.detail.value.split('-');
    let timeObj={
      year:parseInt(arr[0]),
      month:parseInt(arr[1]),
      day:parseInt(arr[2])
    };
    this.setData({
      timeObj:timeObj
    })
  },

  setTabIndex(e){
    let index=e.currentTarget.dataset.index;
    this.setData({
      tabIndex:index
    })
  },
  setIconIndex(e){
    let index=e.currentTarget.dataset.index;
    this.setData({
      iconIndex:index
    })
  },
  setCost(e){
    let cost=e.detail.value;
    this.setData({
      cost:cost
    })
  },
  setPs(e){
    let ps=e.detail.value;
    this.setData({
      ps:ps
    })
  },
  setRecord(e){
    if(!this.data.cost){
      wx.showToast({
        title: '请填写金额！',
        icon: 'none'
      })
      return
    }
    let record={
      "cost":this.data.cost,
      "text":this.data.cIcons[this.data.iconIndex].text,
      "icon":this.data.cIcons[this.data.iconIndex].icon,
      "ps":this.data.ps,
      "is":this.data.tabIndex
    };
    let records=app.globalData.records?app.globalData.records:{};
    let time=this.data.timeObj;
    if(!records[time.year]) records[time.year]={};
    if(!records[time.year][time.month]) records[time.year][time.month]={};
    if(!records[time.year][time.month][time.day]) records[time.year][time.month][time.day]=[];
    
    records[time.year][time.month][time.day].push(record);
    
    wx.setStorageSync('records', records); 
    app.globalData.records=records;
   
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
  }
})