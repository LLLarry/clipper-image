import { getDistance } from '../utils/index.js'
// 处理左边移动
export function handleLeftBorderMove (event) {
	// 左边出边界后不进行处理
	if (event.clientX <= this.clipperCvs.getBoundingClientRect().left) return
	// 左边移动的距离
	const mx = event.clientX - this.clipRect.scaleStartPosition[0]
	const calcX = this.copyClipRect.x + mx
	const clientWidth = this.copyClipRect.width - mx
	// 转化后坐标位置
	this.clipRect.x = Math.min(Math.max(calcX, 0), this.clipRect.width + this.clipRect.x)
	this.clipRect.width = Math.min(Math.max(clientWidth, 0), this.clipperCvs.width - this.clipRect.x)
}

// 处理顶部边移动
export function handleTopBorderMove (event) {
	// 顶部出边界后不进行处理
	if (event.clientY <= this.clipperCvs.getBoundingClientRect().top) return
	// 顶部移动的距离
	const my = event.clientY - this.clipRect.scaleStartPosition[1]
	const calcY = this.copyClipRect.y + my
	const clientHeight = this.copyClipRect.height - my
	// 转化后坐标位置
	this.clipRect.y = Math.min(Math.max(calcY, 0), this.clipRect.height + this.clipRect.y)
	this.clipRect.height = Math.min(Math.max(clientHeight, 0), this.clipperCvs.height - this.clipRect.y)
}

// 处理顶部边移动
export function handleRightBorderMove (event) {
	// 左边移动的距离
	const mx = event.clientX - this.clipRect.scaleStartPosition[0]
	const calcWidth = this.copyClipRect.width + mx
	// 转化后坐标位置
	this.clipRect.width = Math.min(Math.max(calcWidth, 0), this.clipperCvs.width - this.clipRect.x)
}

// 处理底部边移动
export function handleBottomBorderMove (event) {
	// 左边移动的距离
	const my = event.clientY - this.clipRect.scaleStartPosition[1]
	const calcHeight = this.copyClipRect.height + my
	// 转化后坐标位置
	this.clipRect.height = Math.min(Math.max(calcHeight, 0), this.clipperCvs.height - this.clipRect.y)
}

export function handleCustomDraw (event) {
	const {  top: clipperCvsTop, left: clipperCvsLeft } = this.clipperCvs.getBoundingClientRect()

	// 开始触摸时坐标
	let [startX, startY] = this.clipRect.scaleStartPosition
	startX = startX - clipperCvsLeft
	startY = startY - clipperCvsTop
	const eventClientX = event.x - clipperCvsLeft 
	const eventClientY = event.y - clipperCvsTop
	let width = Math.abs(eventClientX - startX)
	let height = Math.abs(eventClientY - startY)
	let x, y
	
	if (eventClientX >= startX && eventClientY >= startY) { // 右下
		x = startX
		y = startY
		width = Math.min(width, this.clipperCvs.width - startX )
		height = Math.min(height, this.clipperCvs.height - startY)
	} else if (eventClientX > startX && eventClientY < startY) { // 右上
		x = startX
		y = eventClientY
		width = Math.min(width, this.clipperCvs.width - startX )
		height = Math.min(height,  startY)
	} else if (eventClientX < startX && eventClientY > startY) { // 左下
		x = eventClientX
		y = startY
		width = Math.min(startX, width)
		height = Math.min(height, this.clipperCvs.height - startY)
	} else if (eventClientX < startX && eventClientY < startY) { // 左上
		x = eventClientX
		y = eventClientY
		width = Math.min(startX, width)
		height = Math.min(height,  startY)
	}

	x = Math.min(Math.max(0, x), this.clipperCvs.width)
	y = Math.min(Math.max(0, y), this.clipperCvs.height)

	this.clipRect = {
		...this.clipRect,
		x,
		y,
		width,
		height
	}
}

// 判断缩放状态 -1 缩小 0 无效值 1 放大
export function checkScaleStatus (event) {
	// 手指数量不足2个，直接返回无效值
	if (event.touches.length < 2 || this.startTouchStatus.touches.length < 2) {
		return 0
	}
	const [{clientX: startClientX1, clientY: startClientY1}, {clientX: startClientX2, clientY: startClientY2}] = Array.from(this.startTouchStatus.touches)
	const [{clientX: clientX1, clientY: clientY1}, {clientX: clientX2, clientY: clientY2}] = Array.from(event.touches)
	const startDistance = Math.abs(getDistance({x: startClientX1, y: startClientY1}, {x: startClientX2, y: startClientY2}))
	const endDistance = Math.abs(getDistance({x: clientX1, y: clientY1}, {x: clientX2, y: clientY2}))
	if (endDistance > startDistance) {
		return 1
	}
	if (endDistance < startDistance) {
		return -1
	}
	return 0 
}