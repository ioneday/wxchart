# wxchart
微信小程序，图表组件（柱状图、折线图、饼图、雷达图...）。持续更新中...



![barchart](https://github.com/ioneday/wxchart/blob/master/image/barchart.png)



#### Useage

wxml：

```javascript
<canvas style="width:{{chartWidth}}px;height:{{chartHeight}}px;"/>

```

js：

```javascript
var chart = require("../../utils/chart.js");

chart.draw(this, 'canvasId', {
  hideYaxis: false,
  color: ['#394655', '#74DAE5', '#ED7672', '#F3AA59', '#FEE746'],
  title: {
    text: "2017城市人均收入(万)",
    color: "#333333",
    size: 16
  },
  xAxis: {
    color: "#666A73",
    size: 10,
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
```





