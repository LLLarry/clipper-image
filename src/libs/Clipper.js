import { getType, getRandom, toHumpName, query, jieliu, createElement, getObjectURL, deepCopy  } from '../utils/index.js'
import { CLIPPER_DEFAULT_OPTIONS, CLIP_RECT_DEFAULT, IMG_STATUS_IDLE, IMG_STATUS_SUCCESS, IMG_STATUS_FAIL, CLIPPER_STATUS_IDLE, CLIPPER_STATUS_DESTORY, CLIPPER_STATUS_RUN } from '../constants/index.js'

import { mousedownHandler, mousemoveHandler, mouseupHandler, wheelHandler, keydownHandler, touchstartHandler, touchmoveHandler, touchendHandler } from './event-helper.js'
import styleStr from '../assets/styles/index.js'
import bgImg from '../assets/images/bg.png'
class Clipper {
	constructor (options = {}) {
		this.status = CLIPPER_STATUS_IDLE // 默认空闲状态
		this._options = deepCopy(options)
		this.init()
	}

	init () {
		// 运行状态时禁止执行init
		if (this.status === CLIPPER_STATUS_RUN) return false
		this.status = CLIPPER_STATUS_RUN

		// 验证options
		this.options = this.validOptions(this._options)
		// 合并options
		this.options = this.mergeOptions(this.options)
		// 图片信息
		this.imageInfo = {
			status: IMG_STATUS_IDLE, // 图片状态 'idle', success, fail
			SCALE_RATE: 0.001, // 缩小或放大比例常量
			scale: 1, // 图片缩放比例
			dx: 0, // 图片左边相对于canvas左边的距离
			dy: 0, // 图片上边相对于canvas上边的距离
		}
		
		// 创建clip裁剪矩形信息
		this.clipRect = this.createClipRect(this.options.clipRect)
		// 创建元素
		this.createElement()
		// 初始化一些值
		this.initValue()
		this.bindEvent()
	}
	// 验证options
	validOptions (options) {
		if (getType(options.el) === 'string' ) {
			options.el = document.querySelector(options.el)
		}
		if (!options.el) {
			throw new Error(`el must be String、Element`)
		}

		return options
	}
	// 合并配置
	mergeOptions (options) {
		if (!options.clipRect) {
			options.clipRect = CLIPPER_DEFAULT_OPTIONS.clipRect
		} else if (getType(options) === 'object'){
			for (let [key, value] of Object.entries(options.clipRect)) {
				if (key === 'size') {
					if (getType(value) !== 'array') {
						options.clipRect[key] = CLIPPER_DEFAULT_OPTIONS.clipRect[key]
					}
				} else if (key === 'position') {
					if (getType(value) !== 'array' && value !== 'center') {
						options.clipRect[key] = CLIPPER_DEFAULT_OPTIONS.clipRect[key]
					}
				} else if (key === 'visible') {
					if (getType(value) !== 'boolean') {
						options.clipRect[key] = CLIPPER_DEFAULT_OPTIONS.clipRect[key]
					}
				} else if (key === 'isCanHidden') {
					if (getType(value) !== 'boolean') {
						options.clipRect[key] = CLIPPER_DEFAULT_OPTIONS.clipRect[key]
					}
				}  else if (key === 'isCanResize') {
					if (getType(value) !== 'boolean') {
						options.clipRect[key] = CLIPPER_DEFAULT_OPTIONS.clipRect[key]
					}
				}  else if (key === 'isCanPosition') {
					if (getType(value) !== 'boolean') {
						options.clipRect[key] = CLIPPER_DEFAULT_OPTIONS.clipRect[key]
					}
				}  
			}
		} else {
			throw new TypeError(`options.clipRect must be undefined or Object`)
		}
		return options
	}
	// 通过配置项生成clipRect对象
	createClipRect (clipRectOptions) {
		// 获取配置项clipRect中的配置信息
		const { size, position, visible, isCanHidden, isCanResize, isCanPosition } = clipRectOptions
		// 获取容器的宽高（canvas的宽高相同）
		const { offsetWidth, offsetHeight } = this.options.el
		// 计算出要获取的clipRect的宽高
		const sizes = size.map((one, index) => {
			if (getType(one) === 'number') {
				return index === 0 ? one * offsetWidth : one * offsetHeight
			} else {
				return Number.parseFloat(one)
			}
		})

		// 计算出clipRect的位置
		let positions = [0, 0]
		if (getType(position) === 'array') {
			positions = position.map((one, index) => {
				if (getType(one) === 'number') {
					return index === 0 ? one * offsetWidth : one * offsetHeight
				} else {
					return Number.parseFloat(one)
				}
			})
		} else {
			// 居中显示
			positions[0] = offsetWidth / 2 - sizes[0] / 2
			positions[1] = offsetHeight / 2 - sizes[1] / 2
		}

		// 判断配置是否合理，不合理直接报错
		// 判断依据： 以下是不合理的情况
		// 1、clipRect位置不能小于0，且不能大于容器宽高
		// 2、clipRect宽高不能小于0，且不能大于容器宽高
		// 3、clipRect位置横向坐标 + clipRect宽 不能大于容器宽度
		// 4、clipRect位置纵向坐标 + clipRect高 不能大于容器高度

		if (positions[0] < 0 || positions[0] > offsetWidth || positions[1] < 0 || positions[1] > offsetHeight) {
			throw new Error(`clipRect.positions 不能小于0，且不能大于容器宽高`)
		}

		if (sizes[0] < 0 || sizes[0] > offsetWidth || sizes[1] < 0 || sizes[1] > offsetHeight) {
			throw new Error(`clipRect.size 不能小于0，且不能大于容器宽高`)
		}

		if (positions[0] + sizes[0] > offsetWidth) {
			throw new Error(`clipRect位置横向坐标 + clipRect宽 不能大于容器宽度`)
		}

		if (positions[1] + sizes[1] > offsetHeight) {
			throw new Error(`clipRect位置纵向坐标 + clipRect高 不能大于容器高度`)
		}

		return {
			isCanPosition,
			isCanResize,
			isCanHidden, // 是否可以隐藏
			visible, // 矩形裁剪块是否显示
			...(this.clipRect || {}),
			x: positions[0],
			y: positions[1],
			width: sizes[0],
			height: sizes[1],
			scaleBorder: 'none', // 那条边在滑动 none left top right bottom left-top right-top right-bottom left-bottom all custom 自定义
			scaleDirection: 'none', //  滑动的方向  none left top right bottom
		}
	}
	// 生成随机key
	createRandomKey () {
		return 'clipper' + '-' + getRandom() + '-' + Date.now()
	}
	// 创建元素
	createElement () {
		// 矩形块是否显示
		// const clipRectVisible = this.options.clipRect.visible
		// const visibleStyle = clipRectVisible ? 'display: block' : 'display: none'
		// 创建背景图像
		const clipperBgCvs = createElement('div', { class: 'clipper-bg-cvs', style: `background-image: url(${bgImg})`})
		// 创建核心画布
		const clipperCvs = createElement('canvas', { class: 'clipper-cvs' })
		// 创建遮罩层
		const clipperMask = createElement('div', { class: 'clipper-mask', style: 'display: none' })
		// 创建裁剪框
		const clipperClip = createElement('div', { class: 'clipper-clip', style: 'display: none' }, `
			<!-- 边框 -->
			<span class="clipper-border-line clipper-border-line-left"></span>
			<span class="clipper-border-line clipper-border-line-top"></span>
			<span class="clipper-border-line clipper-border-line-right"></span>
			<span class="clipper-border-line clipper-border-line-bottom"></span>
			<!-- 边角点 -->
			<span class="clipper-border-block clipper-border-block-left-top"></span>
			<span class="clipper-border-block clipper-border-block-right-top"></span>
			<span class="clipper-border-block clipper-border-block-right-bottom"></span>
			<span class="clipper-border-block clipper-border-block-left-bottom"></span>
			<!-- 横向辅助线 -->
			<span class="clipper-sup-line clipper-sup-line-row clipper-sup-line-row-1"></span>
			<span class="clipper-sup-line clipper-sup-line-row clipper-sup-line-row-2"></span>
			<!-- 纵向辅助线 -->
			<span class="clipper-sup-line clipper-sup-line-col clipper-sup-line-col-1"></span>
			<span class="clipper-sup-line clipper-sup-line-col clipper-sup-line-col-2"></span>	
		`)
		// 创建img-box元素
		const clipperImgBoxWarpper = createElement('div', { class: 'clipper-img-box', style: 'position: relative; z-index:0;' }, [clipperBgCvs, clipperCvs, clipperMask, clipperClip])
		this.options.el.appendChild(clipperImgBoxWarpper)

		const style = createElement('style', { class: 'clipper-style' }, styleStr)
		document.head.appendChild(style)
	}

	removeElement () {
		this.options.el.innerHTML = ''
		const style = query('.clipper-style')
		if (style && style.parentNode) {
			style.parentNode.removeChild(style)
		}
	}
	// 初始化一些值
	initValue () {
		// 需要获取dom的类名
		const classNames = ['clipper-img-box', 'clipper-bg-cvs', 'clipper-cvs', 'clipper-mask', 'clipper-clip', 'clipper-border-line-left', 'clipper-border-line-top',
		'clipper-border-line-right', 'clipper-border-line-bottom', 'clipper-border-block-left-top', 'clipper-border-block-right-top', 'clipper-border-block-right-bottom',
		'clipper-border-block-left-bottom', 'clipper-sup-line-row-1', 'clipper-sup-line-row-2', 'clipper-sup-line-col-1', 'clipper-sup-line-col-2'
		]
		// 获取classNames的对应的dom元素，并挂在到实例上
		for (let className of classNames) {
			this[toHumpName(className)] = query(`.${className}`, this.options.el)
		}

		// 初始化canvas
		const {offsetWidth, offsetHeight} = this.options.el
		this.options.el.style.setProperty('width', offsetWidth + 'px')
		this.options.el.style.setProperty('height', offsetHeight + 'px')
		this.clipperCvs.width = offsetWidth
		this.clipperCvs.height = offsetHeight
		this.ctx = this.clipperCvs.getContext('2d')

		// 注册事件
		this.mousedownHandler = mousedownHandler.bind(this)
		this.mousemoveHandler = jieliu(mousemoveHandler.bind(this), 16.667)
		this.mouseupHandler = mouseupHandler.bind(this)
		this.wheelHandler = wheelHandler.bind(this)
		this.keydownHandler = keydownHandler.bind(this)

		this.touchstartHandler = touchstartHandler.bind(this)
		this.touchmoveHandler = touchmoveHandler.bind(this)
		this.touchendHandler = touchendHandler.bind(this)
	}
	// 画图片
	drawImage () {
		if (!this.img) return false
		this.ctx.clearRect(0, 0, this.clipperCvs.width, this.clipperCvs.height)
		// 在画布上开始绘制的坐标
		const { dx, dy, scale } = this.imageInfo
		this.ctx.drawImage(this.img, dx, dy, this.img.width * scale, this.img.height * scale)
		this.drawClipRect()
	}
	// 画clip裁剪矩形块
	drawClipRect () {
		const { clipperClip, clipRect, imageInfo } = this
		const { dx, dy } = imageInfo
		clipperClip.style.left = clipRect.x + 'px'
		clipperClip.style.top = clipRect.y + 'px'
		clipperClip.style.width = clipRect.width + 'px'
		clipperClip.style.height = clipRect.height + 'px'

		/*
		截取框中绘制图片的位置获取
			相对于截取框的，开始绘制的横坐标 = canvas图片左边距离canvas左边的距离 dx - 截取框左边距离canvas左边的距离
			相对于截取框的，开始绘制的纵坐标 = canvas图片上边距离canvas上边的距离 dx - 截取框上边距离canvas上边的距离

			绘制图片宽度 = img.width * scale
			绘制图片高度 = img.height * scale
		*/

		const positionX = dx - clipRect.x
		const positionY = dy - clipRect.y

		// clip.style.backgroundImage= 'url(./下载.png)'
		// clip.style.backgroundSize = `${img.width * scale}px ${img.height * scale}px`
		// clip.style.backgroundPosition = `${positionX}px ${positionY}px`
		clipperClip.style.background = `url('${this.options.imgUrl}') no-repeat ${positionX}px ${positionY}px / ${this.img.width * this.imageInfo.scale}px ${this.img.height * this.imageInfo.scale}px` 

		if (this.imageInfo.status === IMG_STATUS_SUCCESS && this.clipRect.visible) {
			this.options.onChange && this.options.onChange(this._getClipImage())
		}
	}
	loadImage (url) {
		// 图片信息
		this.imageInfo = {
			status: IMG_STATUS_IDLE, // 图片状态 'idle', success, fail
			SCALE_RATE: 0.05, // 缩小或放大比例常量
			scale: 1, // 图片缩放比例
			dx: 0, // 图片左边相对于canvas左边的距离
			dy: 0, // 图片上边相对于canvas上边的距离
	// 加载图片
		}

		// 创建clip裁剪矩形信息
		this.clipRect = this.createClipRect(this.options.clipRect)

		this.options.imgUrl = url || this.options.imgUrl
		return new Promise((resolve, reject) => {

			this.img = this.img || new Image()
			
			// this.img.setAttribute("crossOrigin",'Anonymous')
			this.img.onload = () => {
				console.log(this)
				this.imageInfo.status = IMG_STATUS_SUCCESS
				resolve(this.options.imgUrl)
				this.imageInfo.dx = this.clipperCvs.width / 2 - this.img.width * this.imageInfo.scale / 2 
				this.imageInfo.dy = this.clipperCvs.height / 2 - this.img.height * this.imageInfo.scale / 2
				if (this.options.clipRect.visible) {
					this.contralClipVisible(true)
				}
				this.drawImage()
			}
			this.img.onerror = (err) => {
				console.log(err)
				this.imageInfo.status = IMG_STATUS_FAIL
				reject(err)
			}
			this.img.src = url 
		})
	}
	// 绑定事件
	bindEvent () {
		this.bindMouseEvent()
		this.bindMouseWheelEvent()
		this.bindKeyEvent()
		this.bindTouchEvent()
	}
	// 解绑事件
	unbindEvent () {
		document.removeEventListener('mousedown', this.mousedownHandler)
		document.removeEventListener('mousemove', this.mousemoveHandler)
		document.removeEventListener('mouseup', this.mouseupHandler)

		window.removeEventListener('wheel', this.wheelHandler, { passive: false })

		document.removeEventListener('keydown', this.keydownHandler)

		document.removeEventListener('touchstart', this.touchstartHandler)

		document.removeEventListener('touchmove', this.touchmoveHandler, { passive: false })

		document.removeEventListener('touchend', this.touchendHandler)
	}
	// 绑定鼠标事件
	bindMouseEvent () {
		document.addEventListener('mousedown', this.mousedownHandler)
		document.addEventListener('mousemove', this.mousemoveHandler)
		document.addEventListener('mouseup', this.mouseupHandler)
	}
	// 绑定鼠标滚轮事件
	bindMouseWheelEvent () {
		// 监听鼠标滚轮事件
		/*
			1、首先鼠标点必须在canvas画布内才能使用
			2、计算出鼠标点距离图片左上角的差值 reImgX reImgY
			3、计算出鼠标点距离canvas左上角的差值 reCvsX reCvsY
			3、计算出 reImgX reImgY 占据图片的比例 rateX rateY、
			4、当图片缩放后，计算出缩放后占据图片的距离 rateX * (img.width * scale) ； rateY * (img.height * scale)
			5、计算出绘制的原点坐标 dx = reCvsX - rateX * (img.width * scale); dy - reCvsY - rateY * (img.height * scale)
			https://blog.csdn.net/lijingshan34/article/details/88350456
		*/
		window.addEventListener('wheel', this.wheelHandler, { passive: false })
	}
	// 绑定键盘事件
	bindKeyEvent () {
		document.addEventListener('keydown', this.keydownHandler)
	}
	// 绑定移动端事件
	bindTouchEvent () {
		document.addEventListener('touchstart', this.touchstartHandler)

		document.addEventListener('touchmove', this.touchmoveHandler, { passive: false })

		document.addEventListener('touchend', this.touchendHandler)
	}
	// 控制裁剪框显示或隐藏
	contralClipVisible (visible) {
		this.clipRect.visible = visible
		this.clipperMask.style.setProperty('display', this.clipRect.visible ? 'block' : 'none')
		this.clipperClip.style.setProperty('display', this.clipRect.visible ? 'block' : 'none')
	}
	_getClipImage () {
		const ncvs = document.createElement('canvas')
		ncvs.width = this.clipRect.width
		ncvs.height = this.clipRect.height
		const nctx = ncvs.getContext('2d')
		nctx.drawImage(this.clipperCvs, -this.clipRect.x, -this.clipRect.y)
		const base64String = ncvs.toDataURL("image/png")

		var arr = base64String.split(","),
			    mime = arr[0].match(/:(.*?);/)[1], // 此处得到的为文件类型
			    bstr = atob(arr[1]), // 此处将base64解码
			    n = bstr.length,
			    u8arr = new Uint8Array(n);
		while (n--) {
		  u8arr[n] = bstr.charCodeAt(n);
		}
		const blob = new Blob([u8arr], { type: mime })
		return blob
	}
	// 获取clip截取图片
	getClipImage () {
		return new Promise((resolve, reject) => {
			if (!this.options.imgUrl) {
				return reject(new Error('图片不存在'))
			}
			if (!this.clipRect.visible) {
				return reject(new Error('未选中需要截取的图片'))
			}
			try {
				const blob = this._getClipImage()
					resolve(blob)
			} catch (err) {
				return reject(err)
			}
		})
		
				
	}



	setImgFile (file) {
		// 生成临时路径
		this.shortTimeUrl = getObjectURL(file)
		console.log(this.shortTimeUrl,  this.img)
		// 重新绘制图片
		return this.loadImage(this.shortTimeUrl)
	}

	destory () {
		if (this.status === CLIPPER_STATUS_DESTORY) return false
		this.status = CLIPPER_STATUS_DESTORY
		this.unbindEvent()
		this.removeElement()
		// 移除图片临时路径
		window.URL.revokeObjectURL(this.shortTimeUrl)
		delete this.img
	}

}
export default Clipper