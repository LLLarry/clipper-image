/* 获取类型 */
export const getType = v => Object.prototype.toString.call(v).replace(/\[object\s(.+)\]/, '$1').toLowerCase()

/* 获取随机字符串 */
export const getRandom = (repeat = 3) => {
	const getNum = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
	let result = ''
	while(repeat > 0) {
		result += getNum()
		repeat--
	} 
	return result
}

/* 获取单个dom元素 */
export const query = (selctor, parent = document) => parent.querySelector(selctor)
/* 获取所有的dom元素 */
export const queryAll =  (selctor, parent = document) => Array.from(parent.querySelectorAll(selctor))

/* 转化为驼峰命名 */
export const toHumpName = name => name.replace(/-(\w)/g, (match, $1) => {
	return $1.toUpperCase()
})

/* 节流函数 */
export const jieliu = (fn, time) => {
	let lastTime = 0
	return function (...argu)  {
		const nowTime = Date.now()
		if (nowTime - lastTime >= time) {
			fn && fn.apply(this, argu)
			lastTime = nowTime
		}
	}
}

/* 判断是否是child元素是否是parent的后代 / 本身 */
export const isDescendant = (parent, child) => {
	if (!child) return false
	if (parent.isSameNode(child)) return true
	return isDescendant(parent, child.parentNode)
}

// 创建元素
export const createElement = (tagName, props = {}, children = '') => {
	props = props === null ? {} : props
	children = children === null ? '' : children
	const el = document.createElement(tagName)
	for (let [key, value] of Object.entries(props)) {
		el.setAttribute(key, value)
	}
	if (getType(children) === 'string') {
		el.innerHTML = children
		return el
	}
	for (let child of children) {
		if (getType(child) === 'string') {
			child = document.createHTMLNode(child)
		} else if (getType(child) === 'object') {
			child = createElement(child.tagName, child.props, child.children)
		}
		el.appendChild(child)
	}
	return el
}

// 生成图片临时路径
export function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

/**
 * 获取两点间距离
 * @param {object} a 第一个点坐标
 * @param {object} b 第二个点坐标
 * @returns
 */
export function getDistance(a, b) {
    const x = a.x - b.x;
    const y = a.y - b.y;
    return Math.hypot(x, y); // Math.sqrt(x * x + y * y);
}

/**
 * 获取两点间中心坐标
 * @param {object} a 第一个点坐标
 * @param {object} b 第二个点坐标
 * @returns
 */
export function getCenterPoint(a, b) {
    const x = (a.x + b.x) / 2;
    const y = (a.y + b.y) / 2;
    return {x, y}
}

/* 深拷贝 */
export const deepCopy = (v) => {
	if (v instanceof Date) return new Date(v)
	if (v instanceof RegExp) return new RegExp(v)
	if (typeof v === 'object' && v !== null) {
		const newV = new v.constructor()
		for (let key in v) {
			if (v.hasOwnProperty(key)) {
				newV[key] = deepCopy(v[key])
			}
		}
		return newV
	} else {
		return v
	}
}

// export const getImageFileFromUrl = (url, imageName) => {
//     return new Promise((resolve, reject) => {
//         var blob = null;
//         var xhr = new XMLHttpRequest();
//         xhr.open("GET", url);
//         xhr.setRequestHeader('Accept', 'image/png');
//         xhr.responseType = "blob";
//         // 加载时处理
//         xhr.onload = () => {
//         	// 获取返回结果
//             blob = xhr.response;
//             let imgFile = new File([blob], imageName, { type: 'image/png' });
//             // 返回结果
//             resolve(imgFile);
//         };
//         xhr.onerror = (e) => {
//             reject(e)
//         };
//         // 发送
//         xhr.send();
//     });
// }