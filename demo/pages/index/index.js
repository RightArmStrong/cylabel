//index.js
//获取应用实例
var cylabel = require('../../utils/cylabel.js')
const app = getApp()

Page({
  data: {
    content: ""
  },
  //事件处理函数
  bindViewTap: function() {
    this.data.leftLabel.setText(this.data.content, false);
    this.data.centerLabel.setText(this.data.content);
    this.data.rightLabel.setText(this.data.content);
  },
  input: function(e) {
    this.data.content = e.detail.value;
  },
  onLoad: function () {
  },
  onShow: function() {
    var that = this;
    var query_left = wx.createSelectorQuery()
    query_left.select('#animationCanvas_left').boundingClientRect()
    query_left.exec(function (res) {
      that.data.leftLabel = new cylabel('left', res[0].width, res[0].height);
      that.data.leftLabel.setDefaultParameter({
        textAlign: "left",
        defaultFontSize: '20px',
        defaultFontColor: 'black',
        defaultFontWeight: 'normal',
      })
      for (let i = 0; i < 100; i++) {
        that.data.leftLabel.setText(i.toString());
      }
      //that.data.leftLabel.setText('<label style="font-size:30px;font-weight:bold;color:blue;">你好！</label>朋友<label style="font-size:15px;font-weight:nomal;color:red;">！</label>欢迎<label style="font-size:15px;font-weight:nomal;color:red;">使用</label>！');
    });
    ////
    var query_center = wx.createSelectorQuery()
    query_center.select('#animationCanvas_center').boundingClientRect()
    query_center.exec(function (res) {
      that.data.centerLabel = new cylabel('center', res[0].width, res[0].height);
      that.data.centerLabel.setDefaultParameter({
        textAlign: "center",
        defaultFontSize: '10px',
        defaultFontColor: 'black',
        defaultFontWeight: 'bold',
      })
      that.data.centerLabel.setText('<label style="font-size:30px;font-weight:bold;color:blue;">你好！</label>朋友<label style="font-size:15px;font-weight:nomal;color:red;">！</label>欢迎<label style="font-size:15px;font-weight:nomal;color:red;">使用</label>！');
    });
    ////////
    var query_right = wx.createSelectorQuery()
    query_right.select('#animationCanvas_right').boundingClientRect()
    query_right.exec(function (res) {
      that.data.rightLabel = new cylabel('right', res[0].width, res[0].height);
      that.data.rightLabel.setDefaultParameter({
        textAlign: "right",
        defaultFontSize: '25px',
        defaultFontColor: 'black',
        defaultFontWeight: 'normal',
      })
      that.data.rightLabel.setText('<label style="font-size:30px;font-weight:bold;color:blue;">你好！</label>朋友<label style="font-size:15px;font-weight:nomal;color:red;">！</label>欢迎<label style="font-size:15px;font-weight:nomal;color:red;">使用</label>！');
    });
  }
})
