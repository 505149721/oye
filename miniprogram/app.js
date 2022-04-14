//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'cloud1',
        traceUser: true,
      })
    } ;
    let records=wx.getStorageSync('records');
    this.globalData.records=records;
    // mark:创建全局openId的方式失败，因为在其他页面获取到其值的时候，其值还没有更新，调用api和云函数的区别，莫非有一个是异步执行
    // let that = this;
    // wx.cloud.callFunction({
      
    //   name: 'getopenid',
    //   complete: res => {
    //     console.log('用户id ', res.result.openid);
    //     that.openId=res.result.openid;
    //     console.log(that.openId)
    //   }
    // })
  },
  globalData : {
    records:null,
    ni:333
  },
  // openId:'ninini'

})
