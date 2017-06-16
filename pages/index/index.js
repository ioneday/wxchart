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
        // {
        //   name: "第一季度",
        //   category: "bar",
        //   data: [37, 63, 60, 78, 92, 63, 57, 48]
        // },
        // {
        //   name: "第二季度",
        //   category: "line",
        //   data: [20, 35, 38, 59, 48, 27, 43, 35]
        // },
        {
          name: ['北京', '上海', '杭州', '深圳', '广州', '成都'],
          category: "pie",
          data: [40, 38, 39, 28, 27, 33]
        }
      ]
    });
  },
  onSaveClick: function () {
    chart.saveCanvans(function () {

    });
  }
})