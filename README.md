# 裁剪图片
`clipperjs`是一款非常强大却又简单的图片裁剪工具，它可以进行非常灵活的配置，支持手机端使用（关键是使用方法简单，几行代码就可以搞定）

## 演示示例
### pc端延时
![](./src/assets/images/pc_preview.gif)

### 手机端演示
![](./src/assets/images/mobile_preview.gif)

## 特色功能

* 同时对**移动端**和**pc端**的支持
* 支持commonjs、esmoudle和cdn的方式引入
* 使用简单、傻瓜式操作

## 快速开始
### 安装
```powershell
npm install clipperjs --save
```

### 引入
```js
 import Clipper from 'clipperjs'
```

> 提示：也支持`<script src="clipperjs.iife.js"></script>`的方式引入

### 用法
添加1`html`容器

> 注意： 容器需要设置宽度和高度，容器的宽度作为滑块验证码的宽度

```html
<div class="clipper" style="width: 800px; height: 480px;"></div>
```

### 创建控件
> pc端推荐配置
```js
const clipper = new Clipper({
	el: '.clipper'
})

clipper.setImgFile(file)
```


> 移动端推荐配置
```js
const clipper = new Clipper({
	el: '.clipper',
	clipRect: {
		size: [0.8, 0.8],
		position: 'center',
		visible: true,
		isCanHidden: false, // 是否支持隐藏
		isCanResize: false, // 是否可以更改尺寸大小
		isCanPosition: false // 是否可以改变位置
	}
})

clipper.setImgFile(file)
```

## 配置项

| 名称                     | 类型              | 默认值     | 必传 | 说明                                                         |
| ------------------------ | ----------------- | ---------- | ---- | ------------------------------------------------------------ |
| `el`                     | string \| element | 无         | 是   | 控件容器                                                     |
| `onChange`               | function          | 无         | 否   | 当裁剪位置（大小）发生变化时的回调 (参数1：裁剪图片的`blob`对象) |
| `clipRect.size`          | Array             | [0.5, 0.5] | 否   | 裁剪区域初始化时默认大小；[0.5, 0.1] 横向宽度为父元素的1/2, 纵向宽度为父元素的 1/10; ['50px', '60px'] 横向宽度为50像素, 纵向宽度为 60像素; |
| `clipRect.visible`       | boolean           | false      | 否   | 裁剪区域初始化时是否隐藏                                     |
| `clipRect.position`      | Array \| 'center' | 'center'   | 否   | 裁剪区域初始化时默认位置；[0.5, 0.1] 距离左边1/2, 距离顶部 1/10; ['50px', '60px'] 距离左边50像素, 距离顶部 60像素; center 自动计算后居中 |
| `clipRect.isCanHidden`   | boolean           | true       | 否   | 裁剪区域是否可以隐藏                                         |
| `clipRect.isCanResize`   | boolean           | true       | 否   | 裁剪区域是否可以自定义设置大小                               |
| `clipRect.isCanPosition` | boolean           | true       | 否   | 裁剪区域是否可以改变位置                                     |

## 方法

| 方法名         | 返回值  | 示例                     | 描述                                         |
| -------------- | ------- | ------------------------ | -------------------------------------------- |
| `setImgFile`   | Promise | `setImgFile.reset(blob)` | 设置要裁剪的图片; `blob`为图片对象           |
| `getClipImage` | Promise | `clipper.getClipImage()` | 获取裁剪区域的`blob`对象                     |
| `init`         | 无      | `clipper.init()`         | 销毁控件后可以调用`init`方法重新显示裁剪画布 |
| `destory`      | 无      | `clipper.destory()`      | 销毁控件                                     |
