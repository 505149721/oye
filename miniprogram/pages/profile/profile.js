// miniprogram/pages/profile/profile.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:null
  },
  navToType:function(e){
    wx.navigateTo({
      url: '../type/type',
    })
  },
  upload:function(e){
    
    const records=app.globalData.records;
    const db=wx.cloud.database();
    const openid=this.data.openid
    db.collection('records').where({
      _openid:openid
    }).update({
      data:{
        records:records
      },
      success:function(e){
        console.log('云端数据更新成功');
        console.log(res);
      }
    });
    db.collection('records').doc('1').get({
      success:function(res){
        console.log(res)
      },
      fail:function(){
        console.log('失败')
      }
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this;
    wx.cloud.callFunction({
    
      name: 'getopenid',
      complete: res => {
        that.setData({
          openid:res.result.openid
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})