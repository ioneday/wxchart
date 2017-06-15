module.exports = {
  mesureText: mesureText,
  calculateY: calculateY,
  drawDashLine: drawDashLine,
  drawRoundBar: drawRoundBar
}
/**
 * 测量文字宽度，
 * Canvas宽度太大，微信提供的setTextAlign(center)
 * 方法并不能准确居中显示
 */
function mesureText(text, textSize) {
  var ratio = textSize / 20;
  var text = text.split('');
  var width = 0;
  text.forEach(function (item) {
    if (/[a-zA-Z]/.test(item)) {
      width += (14 * ratio);
    } else if (/[0-9]/.test(item)) {
      width += (11 * ratio);
    } else if (/\./.test(item)) {
      width += (5.4 * ratio);
    } else if (/-/.test(item)) {
      width += (6.5 * ratio);
    } else if (/[\u4e00-\u9fa5]/.test(item)) {
      width += (20 * ratio);
    }
  });
  return width;
}
/**
 * 计算Y轴显示刻度
 */
function calculateY(dMin, dMax, iMaxAxisNum) {
  if (iMaxAxisNum < 1 || dMax < dMin)
    return;

  var dDelta = dMax - dMin;
  if (dDelta < 1.0) {
    dMax += (1.0 - dDelta) / 2.0;
    dMin -= (1.0 - dDelta) / 2.0;
  }
  dDelta = dMax - dMin;

  var iExp = parseInt(Math.log(dDelta) / Math.log(10.0)) - 2;
  var dMultiplier = Math.pow(10, iExp);
  var dSolutions = [1, 2, 2.5, 5, 10, 20, 25, 50, 100, 200, 250, 500];
  var i;
  for (i = 0; i < dSolutions.length; i++) {
    var dMultiCal = dMultiplier * dSolutions[i];
    if ((parseInt(dDelta / dMultiCal) + 1) <= iMaxAxisNum) {
      break;
    }
  }

  var dInterval = dMultiplier * dSolutions[i];

  var dStartPoint = (parseInt(dMin / dInterval) - 1) * dInterval;
  var yIndex = [];
  var iAxisIndex;
  for (iAxisIndex = 1; true; iAxisIndex++) {
    var y = dStartPoint + dInterval * iAxisIndex;
    console.log(y);
    yIndex.push(y);
    if (y > dMax)
      break;
  }
  return yIndex;
}
/**
 * 绘制虚线
 */
function drawDashLine(ctx, x1, y1, x2, y2, dashLen) {
  dashLen = dashLen === undefined ? 4 : dashLen;
  var beveling = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  var num = Math.floor(beveling / dashLen);

  ctx.beginPath();
  for (var i = 0; i < num; i++) {
    var x = x1 + (x2 - x1) / num * i;
    var y = y1 + (y2 - y1) / num * i;
    if (i % 2 == 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

  }
  ctx.stroke();
  ctx.closePath();
}
/**
 * 绘制圆角矩形
 */
function drawRoundBar(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
  ctx.lineTo(width - radius + x, y);
  ctx.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
  ctx.lineTo(width + x, height + y - radius);
  ctx.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2);
  ctx.lineTo(radius + x, height + y);
  ctx.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI);
  ctx.closePath();
  ctx.fill();
}

function requestAnimation(callback) {
  var that = this;
  // 保证如果重复执行callback的话，callback的执行起始时间相隔16ms 
  var currTime = new Date().getTime();
  var timeToCall = Math.max(0, 16 - (currTime - lastTime));
  var id = setTimeout(function () {
    callback(currTime + timeToCall);
  }, timeToCall);
  lastTime = currTime + timeToCall;
  return id;
}

function easeOut(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b;
}