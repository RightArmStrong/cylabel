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
    this.data.leftLabel.setText(this.data.content);
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
        textAlign: "left"
      })
      for (let i = 100; i < 110; i++) {
        that.data.leftLabel.setText(i.toString());
      }
    });
    ////
    var query_center = wx.createSelectorQuery()
    query_center.select('#animationCanvas_center').boundingClientRect()
    query_center.exec(function (res) {
      that.data.centerLabel = new cylabel('center', res[0].width, res[0].height);
      that.data.centerLabel.setDefaultParameter({
        textAlign: "center"
      })
      for (let i = 200; i < 210; i++) {
        that.data.centerLabel.setText(i.toString());
      }
    });
    ////////
    var query_right = wx.createSelectorQuery()
    query_right.select('#animationCanvas_right').boundingClientRect()
    query_right.exec(function (res) {
      that.data.rightLabel = new cylabel('right', res[0].width, res[0].height);
      that.data.rightLabel.setDefaultParameter({
        textAlign: "right"
      })
      for (let i = 300; i < 310; i++) {
        that.data.rightLabel.setText(i.toString());
      }
    });
  }
})
