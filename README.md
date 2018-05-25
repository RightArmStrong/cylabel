# cylabel
文本动画控件，比较文本内容的不同，进行动画切换。

1、在小程序中的wxml文件里创建一个canvas;
2、在js文件里导入cylabel.js
3、使用已创建的canvas-id初始化cylabel，需要传三个必要参数和1个可选参数：new cylabel(canvasid, canvasWidth, canvasHeight, thisValue)，如果是在小程序组件里使用此控件，需要传thisValue，否则找不到canvas；
4、配置默认参数：cylabel.setDefaultParameter ,目前暂只支持对齐方式：textAlign（可选left、center、right）和字体大小：defaultFontStyle（目前必须是以px为单位）
5、设置内容：cylabel.setText(content, hasAnimation)，其中content支持普通文本和label标签；hasAnimation可选

