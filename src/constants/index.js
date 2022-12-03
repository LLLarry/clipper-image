export const CLIPPER_DEFAULT_OPTIONS = {
	clipRect: {
		visible: false, // 默认不显示
		size: [0.5, 0.5], // [0.5, 0.1] 宽为父元素的1/2, 高为父元素的1/10; ['50px', '60px'] 宽为50px, 高为父元素的60px; center 自动计算后居中
		position: 'center', // [0.5, 0.1] 距离左边1/2, 距离顶部 1/10; ['50px', '60px'] 距离左边50像素, 距离顶部 60像素; center 自动计算后居中
		isCanHidden: true, // 是否支持隐藏
		isCanResize: true, // 是否可以更改尺寸大小
		isCanPosition: true // 是否可以改变位置
	}
}

// 裁剪的默认信息
export const CLIP_RECT_DEFAULT = {
	x: 0, // 距离canvas的横向坐标
	y: 0, // 距离canvas的纵向坐标
	width: 0, // 截取矩形的宽度
	height: 0, // 截取矩形的高度
	scaleBorder: 'none', // 那条边在滑动 none left top right bottom left-top right-top right-bottom left-bottom all
	scaleDirection: 'none', //  滑动的方向  none left top right bottom
}

export const IMG_STATUS_IDLE = 'IMG_STATUS_IDLE'
export const IMG_STATUS_SUCCESS = 'IMG_STATUS_SUCCESS'
export const IMG_STATUS_FAIL = 'IMG_STATUS_FAIL'

export const CLIPPER_STATUS_IDLE = 'CLIPPER_STATUS_IDLE' // 空闲
export const CLIPPER_STATUS_DESTORY = 'CLIPPER_STATUS_DESTORY' // 销毁
export const CLIPPER_STATUS_RUN = 'CLIPPER_STATUS_RUN' // 正在运行