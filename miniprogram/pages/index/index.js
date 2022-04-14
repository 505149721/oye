const app=getApp();
Page({
  data:{
    show:false,
    timeObj:{
      year:null,
      month:null
    },
    output:null,
    input:null,
    records:{},
    userInfo:null,
    isHide:false,
    openid:null
  },
  onLoad(){
    let that=this;
    wx.getSetting({
      withSubscriptions: true,
      success:function(res){
        if(res.authSetting['scope.userInfo']){
          that.setData({
            isHide:true
          })
        }
        console.log(res.authSetting)
      }
    });
    // mark:云函数若没有及时更新openid会不会影响到后面的操作
    // const that_2=this;
    //   wx.cloud.callFunction({
      
    //     name: 'getopenid',
    //     complete:(res)  => {
    //       console.log('用户id index ', res.result.openid);
    //       that_2.setData({
    //         openid:res.result.openid
    //       })
    //     }
    //   });
  },
  authorize(e){

  },
  rmItem(e){
    let obj=e.detail;
    let timeObj=this.data.timeObj;
    let records=this.data.records;
    let glbrecords=app.globalData.records;
    if(records[obj.day].length===1){
      delete records[obj.day]
    }else{
      records[obj.day].splice(obj.index,1)
    }
    glbrecords[timeObj.year][timeObj.month]=records;
    wx.setStorageSync('records', glbrecords);
    // mark 
    app.globalData.records=glbrecords;
    this.setData({
      records:records
    });
    this.setIOput();
    
  },
  nvgToRec:function(e){
    wx.navigateTo({
      url: '../record/record',
    
    })
  },
  reloadThisPage() {
    let currentPages = getCurrentPages()
    let lastRoute = currentPages[currentPages.length - 1].route
    let options = currentPages[currentPages.length - 1].options
    let optionsStr = ""
    for (let key in options) {
        optionsStr += '?' + key + '=' + options[key]
    }
    wx.redirectTo({
        url: '/' + lastRoute + optionsStr,
    })},
  setTimeObj:function(){
    let time=new Date();
    this.setData({
      timeObj:{
        year:time.getFullYear(),
        month:time.getMonth()+1
      }
    });
  },
  setIOput:function(){
    let records=this.data.records;
    let sum1=0.00,sum2=0.00;
    for(let day in records){
      let array=records[day];
      array.forEach(function(item,i){
        if(item.is==1){
          sum1+=parseFloat(item.cost)
        }else{
          sum2+=parseFloat(item.cost)
        }

      })
    }
    this.setData({
      output:sum1,
      input:sum2
    })
  },
  setNewMonth(e){
    let arr=e.detail.value.split('-');
    let timeObj={
      year:parseInt(arr[0]),
      month:parseInt(arr[1])
    };
    this.setData({
      timeObj:timeObj
    });
    
    this.setRecords();
    this.setIOput();
    
  },
  setRecords:function(){
    let records=app.globalData.records;
    console.log('records:',records)
    let time_1=this.data.timeObj;
    if(!records[time_1.year]||!records[time_1.year][time_1.month]){
      // mark: onload中有同款 只要选一个用就行
      const db=wx.cloud.database();
      const that=this;
      wx.cloud.callFunction({
      
        name: 'getopenid',
        complete: res => {
          that.setData({
            openid:res.result.openid
          })
        }
      })
      // mark：openid是否及时更新
      db.collection('records').where({
        openid:openid
      }).get({
        success:function(res){
          if(res.records){
            that.setData({
              records:res.records[time_1.year][time_1.month]
            })
          }else{
            that.setData({
              records:null
            });
          }
          
        }
      })
      
      return;
    }
    console.log('y云端'+app.openId)
    this.setData({
      records:records[time_1.year][time_1.month]
    })
    
  },
  onShow:function(){
    this.setTimeObj();
    this.setRecords();
    this.setIOput();

  }
   
  
})