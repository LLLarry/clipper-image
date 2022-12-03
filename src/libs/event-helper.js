import { handleLeftBorderMove, handleTopBorderMove, handleRightBorderMove, handleBottomBorderMove, handleCustomDraw, checkScaleStatus } from './clipper-helper.js'
import { isDescendant } from '../utils/index.js'
import { CLIPPER_DEFAULT_OPTIONS, CLIP_RECT_DEFAULT, IMG_STATUS_IDLE, IMG_STATUS_SUCCESS, IMG_STATUS_FAIL } from '../constants/index.js'
import { getType, getCenterPoint  } from '../utils/index.js'
export function mousedownHandler (event) {
			
		this.clipRect = {
			...this.clipRect,
			scaleBorder: 'none', // 那条边在滑动 
			scaleDirection: 'none' //  滑动的方向
		}
		const { clipperCvs, clipperClip, clipperMask, clipperBorderLineLeft, clipperBorderLineTop, clipperBorderLineRight, clipperBorderLineBottom, clipperBorderBlockLeftTop,
			clipperBorderBlockRightTop, clipperBorderBlockRightBottom, clipperBorderBlockLeftBottom,
			clipperSupLineCol1, clipperSupLineCol2, clipperSupLineRow1, clipperSupLineRow2
		} = this
		// 删除拷贝对象
		delete this.copyClipRect
		// 是否在图片上进行点击的
		const target = event.target
	
		// 判断是哪个边
		if (target.isSameNode(clipperBorderLineLeft)) {
			this.clipRect.scaleBorder = 'left'
			this.clipRect.scaleStartPosition = [event.clientX, event.clientY]
		} else if (target.isSameNode(clipperBorderLineTop)) {
			this.clipRect.scaleBorder = 'top'
			this.clipRect.scaleStartPosition = [event.clientX, event.clientY]
		} else if (target.isSameNode(clipperBorderLineRight)) {
			this.clipRect.scaleBorder = 'right'
			this.clipRect.scaleStartPosition = [event.clientX, event.clientY]
		} else if (target.isSameNode(clipperBorderLineBottom)) {
			this.clipRect.scaleBorder = 'bottom'
			this.clipRect.scaleStartPosition = [event.clientX, event.clientY]
		} else if (target.isSameNode(clipperClip) || target.isSameNode(clipperSupLineCol1) || target.isSameNode(clipperSupLineCol2) || target.isSameNode(clipperSupLineRow1) || target.isSameNode(clipperSupLineRow2)) {
			this.clipRect.scaleBorder = 'all'
			this.clipRect.scaleStartPosition = [event.clientX, event.clientY]
		} else if (target.isSameNode(clipperBorderBlockLeftTop)) {
			this.clipRect.scaleBorder = 'left-top'
			this.clipRect.scaleStartPosition = [event.clientX, event.clientY]
		} else if (target.isSameNode(clipperBorderBlockRightTop)) {
			this.clipRect.scaleBorder = 'right-top'
			this.clipRect.scaleStartPosition = [event.clientX, event.clientY]
		} else if (target.isSameNode(clipperBorderBlockRightBottom)) {
			this.clipRect.scaleBorder = 'right-bottom'
			this.clipRect.scaleStartPosition = [event.clientX, event.clientY]
		} else if (target.isSameNode(clipperBorderBlockLeftBottom)) {
			this.clipRect.scaleBorder = 'left-bottom'
			this.clipRect.scaleStartPosition = [event.clientX, event.clientY]
		} else if (target.isSameNode(clipperCvs) || target.isSameNode(clipperMask)) {
			if (this.imageInfo.status === IMG_STATUS_SUCCESS) {
				this.clipRect.scaleBorder = 'custom'
				this.clipRect.scaleStartPosition = [event.x, event.y]
				if (this.clipRect.isCanHidden) {
					this.contralClipVisible(false)
				}
			}
		}
		this.copyClipRect = JSON.parse(JSON.stringify(this.clipRect))

		// 是否可以更改clip的尺寸
		if (!this.clipRect.isCanResize) {
			// 点击的是否是更改尺寸的边框
			const isFlay = ['left', 'top', 'right', 'bottom', 'left-top', 'right-top', 'right-bottom', 'left-bottom', 'custom'].includes(this.clipRect.scaleBorder) 
			if (isFlay) {
				this.clipRect.scaleBorder = 'none'
			}
		}

		if (!this.clipRect.isCanPosition) {
			const isFlay = ['all'].includes(this.clipRect.scaleBorder) 
			if (isFlay) {
				this.clipRect.scaleBorder = 'none'
			}
		}
		
}

export function mousemoveHandler (event) {
	if (this.clipRect.scaleBorder === 'none') return false
	if (this.clipRect.scaleBorder === 'left') {
		handleLeftBorderMove.call(this, event)
	} else if (this.clipRect.scaleBorder === 'top') {
		handleTopBorderMove.call(this, event)
	} else if (this.clipRect.scaleBorder === 'right') {
		handleRightBorderMove.call(this, event)
	}  else if (this.clipRect.scaleBorder === 'bottom') {
		handleBottomBorderMove.call(this, event)
	}  else if (this.clipRect.scaleBorder === 'all') {
		const mx = event.clientX - this.clipRect.scaleStartPosition[0]
		const calcX = this.copyClipRect.x + mx
		this.clipRect.x = Math.min(Math.max(calcX, 0), this.clipperCvs.width - this.clipRect.width)

		const my = event.clientY - this.clipRect.scaleStartPosition[1]
		const calcY = this.copyClipRect.y + my
		// 转化后坐标位置
		this.clipRect.y = Math.min(Math.max(calcY, 0), this.clipperCvs.height - this.clipRect.height)
	} else if (this.clipRect.scaleBorder === 'left-top') {
		handleLeftBorderMove.call(this, event)
		handleTopBorderMove.call(this, event)
		
	} else if (this.clipRect.scaleBorder === 'right-top') {
		handleRightBorderMove.call(this, event)
		handleTopBorderMove.call(this, event)
	} else if (this.clipRect.scaleBorder === 'right-bottom') {
		handleRightBorderMove.call(this, event)
		handleBottomBorderMove.call(this, event)
	} else if (this.clipRect.scaleBorder === 'left-bottom') {
		handleLeftBorderMove.call(this, event)
		handleBottomBorderMove.call(this, event)
	} else if (this.clipRect.scaleBorder === 'custom') {
		handleCustomDraw.call(this, event)
		this.contralClipVisible(true)
	}
	this.drawClipRect()
}

export function mouseupHandler (event) {
	this.clipRect.scaleBorder = 'none', // 那条边在滑动 none left top right bottom
	this.clipRect.scaleDirection = 'none', //  滑动的方向  none left top right bottom
	this.clipRect.scaleStartPosition = [0, 0] // 滑动起始位置
	delete this.copyClipRect
}

export function wheelHandler (event) {
	// 是否在组件内滚动滚轮
	const flag = isDescendant(this.clipperImgBox, event.target)
	if (!flag || this.imageInfo.status !== IMG_STATUS_SUCCESS) {
		return false
	}
	event.preventDefault()
	event.stopPropagation()
	// if (!event.target.isSameNode(clipperCvs)) return false
	// 计算出鼠标点距离图片左上边的距离
	const reImgX = event.clientX - this.imageInfo.dx - this.clipperCvs.getBoundingClientRect().left 
	const reImgY = event.clientY - this.imageInfo.dy - this.clipperCvs.getBoundingClientRect().top 
	// 计算出鼠标点距离canvas左上边的距离
	const reCvsX = event.clientX - this.clipperCvs.getBoundingClientRect().left 
	const reCvsY = event.clientY - this.clipperCvs.getBoundingClientRect().top 
	const rateX = reImgX / (this.img.width * this.imageInfo.scale)
	const rateY = reImgY / (this.img.height * this.imageInfo.scale)
	if (event.deltaY > 0) {
		this.imageInfo.scale = this.imageInfo.scale * (1 - this.imageInfo.SCALE_RATE)
	} else{
		this.imageInfo.scale = this.imageInfo.scale * (1 + this.imageInfo.SCALE_RATE)
	}
	this.imageInfo.dx = reCvsX - rateX * (this.img.width * this.imageInfo.scale)
	this.imageInfo.dy = reCvsY - rateY * (this.img.height * this.imageInfo.scale)
	this.drawImage()
}

export function keydownHandler (event) {
	const STEP = 10
	event.preventDefault()
	if (event.code === 'ArrowUp') {
		this.imageInfo.dy -= STEP
	} else if (event.code === 'ArrowRight') {
		this.imageInfo.dx += STEP
	} else if (event.code === 'ArrowDown') {
		this.imageInfo.dy += STEP
	} else if (event.code === 'ArrowLeft') {
		this.imageInfo.dx -= STEP
	}
	this.drawImage()
}

export function touchstartHandler () {
	this.startTouchStatus = {
		touches: event.touches,
		centerPoiont: null, // 在画布上的连个手指之间的中心点
		flag: false // 是否在this.options.el元素内开始触摸
	}
	// 触摸不符合条件
	if (!isDescendant(this.options.el, event.target)) {
		return false
	}
	this.startTouchStatus.flag = true
	// event.preventDefault()
	// event.stopPropagation()
	const {left, top} = this.clipperCvs.getBoundingClientRect()
	const [touche1, touche2] = Array.from(event.touches)
	let centerPoiont = null
	if (touche1 && touche2) {
		centerPoiont = getCenterPoint(
			{ x: touche1.clientX - left, y: touche1.clientY - top }, 
			{ x: touche2.clientX - left, y: touche2.clientY - top }
		)
	}
	this.startTouchStatus.centerPoiont = centerPoiont
}

export function touchmoveHandler () {
	if (!this.startTouchStatus.flag) return false
	event.preventDefault()
	event.stopPropagation()
	
	let centerPoiont = null
	// 手指状态
	if (this.startTouchStatus.centerPoiont) {
		// 判断缩放状态 1放大、0无效值、-1缩小
		const res = checkScaleStatus.call(this, event)
		// 获取中心点坐标
		const {x, y} = this.startTouchStatus.centerPoiont
		// 鼠标距离canvas距离
		const reImgX = x - this.imageInfo.dx // - this.clipperCvs.getBoundingClientRect().left 
		const reImgY = y - this.imageInfo.dy // - this.clipperCvs.getBoundingClientRect().top 
		// 计算出鼠标点距离canvas左上边的距离
		const reCvsX = x // - this.clipperCvs.getBoundingClientRect().left 
		const reCvsY = y // - this.clipperCvs.getBoundingClientRect().top 
		const rateX = reImgX / (this.img.width * this.imageInfo.scale)
		const rateY = reImgY / (this.img.height * this.imageInfo.scale)

		if (res === 1) { // 放大
			this.imageInfo.scale = this.imageInfo.scale * (1 + this.imageInfo.SCALE_RATE)
		} else if (res === -1){ // 缩小
			this.imageInfo.scale = this.imageInfo.scale * (1 - this.imageInfo.SCALE_RATE)
		}

		this.imageInfo.dx = reCvsX - rateX * (this.img.width * this.imageInfo.scale)
		this.imageInfo.dy = reCvsY - rateY * (this.img.height * this.imageInfo.scale)	


		const {left, top} = this.clipperCvs.getBoundingClientRect()
		const [touche1, touche2] = Array.from(event.touches)
		
		if (touche1 && touche2) {
			centerPoiont = getCenterPoint(
				{ x: touche1.clientX - left, y: touche1.clientY - top }, 
				{ x: touche2.clientX - left, y: touche2.clientY - top }
			)
		}
		
	} else { // 移动位置
		// 水平方向 距离上个触摸点开始移动的位置
		const moveX = event.touches[0].clientX - this.startTouchStatus.touches[0].clientX
		// 垂直方向 距离上个触摸点开始移动的位置
		const moveY = event.touches[0].clientY - this.startTouchStatus.touches[0].clientY
		this.imageInfo.dx += moveX
		this.imageInfo.dy += moveY
	}
	
	this.startTouchStatus = {
		...this.startTouchStatus,
		touches: event.touches,
		centerPoiont
	}
	
	
	this.drawImage()
}

export function touchendHandler () {
	
}