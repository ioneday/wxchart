
module.exports = {
  draw: init,
  saveCanvans: saveCanvans
}

var util = require("chartUtils.js");
var canvasId = '';
var pageObj = null;
var chartOpt = {
  axisMark: [],
  barLength: 0,
  // bgColor: "transparent",
  lineColor:"#c2c2c2",
  bgColor: "#ffffff",
  chartWidth: 0,
  chartHeight: 0,
  legendWidth: 0,
  legendHeight: 0,
  chartSpace: 10,
  textSpace: 5,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  axisLeft: 0,
  axisBottom: 0,
  axisTop: 0
}
var dataSet = {
  hideYaxis: false,
  title: {
    color: "#394655",
    size: 16,
    text: ""
  },
  legend:{
    color:"",
    size:12
  },
  color: ['#394655', '#74DAE5', '#ED7672', '#F3AA59', '#FEE746', '#DAEE59', '#87E287', '#CFDCED', '#DC7BDF', '#6184FC'],
  xAxis: {
    color: "#666A73",
    size: 10,
    data: []
  },
  series: []
}

function init(page, canvas, data) {
  canvasId = canvas;
  pageObj = page;
  checkData(data);

  var ctx = initCanvas(page, canvasId);
  drawChart(ctx);
}
/**
 * 初始化Canvas
 */
function initCanvas(page, canvasId) {
  var ctx = wx.createCanvasContext(canvasId);
  var Sys = wx.getSystemInfoSync();

  chartOpt.chartWidth = Sys.windowWidth;
  chartOpt.chartHeight = Sys.windowWidth * 0.8;//Canvas组件的宽高比

  chartOpt.legendWidth = dataSet.legend.size * 1.3;
  chartOpt.legendHeight = dataSet.legend.size * 0.8;

  chartOpt.top = chartOpt.left = chartOpt.chartSpace;
  chartOpt.right = chartOpt.chartWidth - chartOpt.chartSpace;
  chartOpt.bottom = chartOpt.chartHeight - chartOpt.chartSpace;

  //3个数字的文字长度
  var textWidth = util.mesureText('100', dataSet.xAxis.size);
  var legendHeight = dataSet.series.length > 1 ? (chartOpt.legendHeight + chartOpt.chartSpace * 2) : 0;

  chartOpt.axisLeft = chartOpt.left + (dataSet.hideYaxis?0:textWidth + chartOpt.textSpace);
  chartOpt.axisBottom = chartOpt.bottom - dataSet.xAxis.size - chartOpt.textSpace - legendHeight;
  chartOpt.axisTop = chartOpt.top + dataSet.title.size + chartOpt.textSpace + dataSet.xAxis.size * 2;



  //更新页面Canvas的宽度、高度
  page.setData({
    chartWidth: chartOpt.chartWidth,
    chartHeight: chartOpt.chartHeight
  });

  return ctx;
}
/**
 * 检查并更新图表数据
 */
function checkData(data) {

  if (data.title != undefined) {
    if (data.title.color != undefined && data.title.color != '') {
      dataSet.title.color = data.title.color;
    }
    dataSet.title.text = data.title.text;

  }
  if (data.color != undefined && data.color != [] && data.color.length > 0) {
    dataSet.color = data.color;
  }
  dataSet.xAxis.data = data.xAxis.data;


  dataSet.series = data.series;

  var value = new Array();
  for (var i = 0; i < dataSet.series.length; i++) {
    var item = dataSet.series[i];
    var itemLenght = item.data.length;
    if (itemLenght > chartOpt.barLength) {
      chartOpt.barLength = itemLenght;
    }
    for (var k = 0; k < itemLenght; k++) {
      value.push(item.data[k]);
    }
  }

  var minNum = Math.min.apply(null, value);
  var maxNum = Math.max.apply(null, value);
  //计算Y轴刻度尺数据
  chartOpt.axisMark = util.calculateY(minNum, maxNum, 5);
}
/**
 * 绘制图表
 */
function drawChart(ctx) {
  drawBackground(ctx);
  drawXaxis(ctx);
  drawYaxis(ctx);
  drawTitle(ctx);
  drawLegend(ctx);

  drawBar(ctx);
  ctx.draw();
}
/**
 * 绘制图表背景
 */
function drawBackground(ctx) {
  if (chartOpt.bgColor != "" && chartOpt.bgColor != "transparent") {
    ctx.setFillStyle(chartOpt.bgColor);
    ctx.fillRect(0, 0, chartOpt.chartWidth, chartOpt.chartHeight);
  }
}
/**
 * 绘制标题
 */
function drawTitle(ctx) {
  var title = dataSet.title;
  if (title.text != '') {

    var textWidth = util.mesureText(title.text, title.size);
    ctx.setFillStyle(title.color);
    ctx.setFontSize(title.size)
    ctx.setTextAlign('left');
    ctx.fillText(title.text, (chartOpt.chartWidth - textWidth) / 2, chartOpt.top + title.size);
  }

}
/**
 * 绘制X轴刻度尺
 */
function drawXaxis(ctx) {
  //绘制X轴横线
  ctx.setLineWidth(0.5);
  ctx.setLineCap('round');
  ctx.moveTo(chartOpt.axisLeft, chartOpt.axisBottom)
  ctx.lineTo(chartOpt.right, chartOpt.axisBottom)
  ctx.stroke();


  var width = (chartOpt.right - chartOpt.axisLeft) / chartOpt.barLength;
  var data = dataSet.xAxis.data;
  //绘制X轴显示文字
  for (var i = 0; i < data.length; i++) {
    var textX = (width * (i + 1)) - (width / 2) + chartOpt.axisLeft;
    ctx.setFillStyle(dataSet.xAxis.color);
    ctx.setFontSize(dataSet.xAxis.size);
    ctx.setTextAlign('center');
    ctx.fillText(data[i], textX, chartOpt.axisBottom + dataSet.xAxis.size + chartOpt.textSpace);
  }
}
/**
 * 绘制Y轴刻度尺
 */
function drawYaxis(ctx) {

  //绘制Y轴横线
  ctx.setLineWidth(0.5);
  ctx.setLineCap('round');
  
  var height = (chartOpt.axisBottom - chartOpt.axisTop) / (chartOpt.axisMark.length - 1);
  //绘制Y轴显示数字
  for (var i = 0; i < chartOpt.axisMark.length; i++) {
    var y = chartOpt.axisBottom - height * i;
    if (i > 0){
      ctx.setStrokeStyle(chartOpt.lineColor);
      util.drawDashLine(ctx, chartOpt.axisLeft, y, chartOpt.right, y);
    }
    
    if (!dataSet.hideYaxis){
      ctx.setFillStyle(dataSet.xAxis.color);
      ctx.setFontSize(dataSet.xAxis.size)
      ctx.setTextAlign('right');
      ctx.fillText(chartOpt.axisMark[i], chartOpt.axisLeft - chartOpt.textSpace, y + chartOpt.textSpace);
    }
  }
}
  
/**
 * 绘制图例
 */
function drawLegend(ctx) {
  var series = dataSet.series;
  if (series.length > 1) {
    var textWidth = util.mesureText(series[0].name, dataSet.xAxis.size);
    var legendWidth = chartOpt.legendWidth + textWidth + chartOpt.chartSpace *2;
    var startX = (chartOpt.chartWidth / 2) - (legendWidth * series.length) / 2;

    for (var i = 0; i < series.length; i++) {
      var lx = startX + legendWidth * i + chartOpt.legendWidth * i;
      ctx.setFillStyle(dataSet.xAxis.color);
      ctx.setFontSize(dataSet.legend.size)
      ctx.setTextAlign('left');
      ctx.fillText(series[i].name, lx + chartOpt.chartSpace + chartOpt.legendWidth,chartOpt.bottom);

      ctx.setFillStyle(getColor(i));
      ctx.fillRect(lx, chartOpt.bottom - chartOpt.legendHeight + 1, chartOpt.legendWidth, chartOpt.legendHeight);
      // util.drawRoundBar(ctx, lx, chartOpt.bottom - chartOpt.legendHeight, chartOpt.legendWidth, chartOpt.legendHeight, 3);
    }
  }
}
/**
 * 绘制柱状图
 */
function drawBar(ctx) {
  var barWidth = (chartOpt.right - chartOpt.axisLeft - chartOpt.barLength * chartOpt.chartSpace) / chartOpt.barLength;

  var barHeight = chartOpt.axisBottom - chartOpt.axisTop;

  var maxMark = chartOpt.axisMark[chartOpt.axisMark.length - 1];

  var series = dataSet.series;
  for (var i = 0; i < series.length; i++) {
    var item = series[i];
    var itemWidth = barWidth / series.length;
    for (var k = 0; k < item.data.length; k++) {
      var itemHeight = barHeight * (item.data[k] / maxMark);
      var x = (barWidth * k + chartOpt.axisLeft + k * chartOpt.chartSpace + (chartOpt.chartSpace / 2)) + (i * itemWidth);
      var y = chartOpt.axisBottom - itemHeight;
      var color = getColor(series.length <= 1 ? k : i);
      ctx.setFillStyle(color);
      ctx.fillRect(x, y, itemWidth, itemHeight);

      drawTips(ctx, item.data[k], x + itemWidth / 2, y - chartOpt.textSpace, color);
      // util.drawRoundBar(ctx, x, y, itemWidth, itemHeight, 3);
    }
  }
}
function drawTips(ctx, text, x, y, color) {
  ctx.setFillStyle(color);
  ctx.setFontSize(dataSet.xAxis.size)
  ctx.setTextAlign('center');
  ctx.fillText(text, x, y);
}

/**
 * 获取柱状图颜色值，循环渲染
 */
function getColor(index) {
  var cLength = dataSet.color.length;
  if (index >= cLength) {
    return dataSet.color[index % cLength];
  } else {
    return dataSet.color[index];
  }
}
/**
 * 保存图表为图片
 */
function saveCanvans(func) {
  wx.canvasToTempFilePath({
    canvasId: canvasId,
    success: function (res) {
      console.log(res.tempFilePath)
      // wx.previewImage({
      //   urls: [res.tempFilePath],
      // })
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success(ress) {
          console.log(ress)
        }
      })
    }
  })
}