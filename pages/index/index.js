// test.js
var chart = require("../../utils/chart.js");
Page({

  data: {
  },
  onLoad: function (options) {
    chart.draw(this, 'canvas1', {
      title: {
        text: "2017城市人均收入(万)",
        color: "#333333"
      },
      xAxis: {
        data: ['北京', '上海', '杭州', '深圳', '广州', '成都', '南京', '西安']
      },
      series: [
        {
          name: "第一季度",
          data: [28, 35, 99, 16, 48, 27, 63, 25]
        }
        , {
          name: "第二季度",
          data: [73, 63, 25, 73, 17, 49, 35, 91]
        }
      ]
    });
  },
  onSaveClick: function () {
    chart.saveCanvans(function(){

    });
  }
})