export default `
.clipper-img-box {
	width: 100%;
	height: 100%;
	position: relative;
}
.clipper-img-box canvas, .clipper-bg-cvs{
	width: 100%;
	height: 100%;
}
.clipper-bg-cvs {
	background: url('./src/assets/images/bg.png');
	position: absolute;
	left: 0;
	top:  0; 
	width: 100%;
	height: 100%;
	z-index: -1;
}
.clipper-cvs {
	cursor: pointer;
	user-select: none;
}
.clipper-mask {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: #000;
	opacity: 0.5;
	user-select: none;
}
.clipper-clip {
	position: absolute;
	left: 0;
	width: 0;
	top: 0;
	height: 0;
	cursor: move;
	user-select: none;
}
.clipper-border-line {
	position: absolute;
}
.clipper-border-line-left::after {
	content: '';
	display: block;
	height: 100%;
	border-left: 1px solid #3399ff;
}
.clipper-border-line-top::after {
	content: '';
	display: block;
	height: 100%;
	background-color: ;
	border-top: 1px solid #3399ff;
}
.clipper-border-line-right::after {
	content: '';
	display: block;
	height: 100%;
	border-right: 1px solid #3399ff;
}
.clipper-border-line-bottom::after {
	content: '';
	display: block;
	height: 100%;
	border-bottom: 1px solid #3399ff;
}
.clipper-border-line-left {
	left: 0;
	top: 0;
	bottom: 0;
	width: 10px;
	cursor: ew-resize;
}
.clipper-border-line-top {
	left: 0;
	top: 0;
	right: 0;
	height: 10px;
	cursor: ns-resize;
}
.clipper-border-line-right {
	right: 0;
	top: 0;
	bottom: 0;
	width: 10px;
	cursor: ew-resize;
}
.clipper-border-line-bottom {
	left: 0;
	right: 0;
	bottom: 0;
	height: 10px;
	cursor: ns-resize;
}
.clipper-border-block {
	position: absolute;
	width: 10px;
	height: 10px;
	background-color: #3399ff;
}
.clipper-border-block-left-top {
	left: 0;
	top: 0;
	cursor: nwse-resize;
}
.clipper-border-block-right-top {
	right: 0;
	top: 0;
	cursor: nesw-resize;
}
.clipper-border-block-right-bottom {
	right: 0;
	bottom: 0;
	cursor: nwse-resize;
}
.clipper-border-block-left-bottom {
	left: 0;
	bottom: 0;
	cursor: nesw-resize;
}

.clipper-sup-line {
	position: absolute;
}
.clipper-sup-line-row-1 {
	left: 0;
	top: 33.3333333%;
	width: 100%;
	height: 5px;
	border-top: 1px dashed rgba(255,255,255,.5);
}
.clipper-sup-line-row-2 {
	left: 0;
	top: 66.6666667%;
	width: 100%;
	height: 5px;
	border-top: 1px dashed rgba(255,255,255,.5);
}
.clipper-sup-line-col-1 {
	left: 33.3333333%;
	top: 0;
	height: 100%;
	border-left: 1px dashed rgba(255,255,255,.5);
}
.clipper-sup-line-col-2 {
	left: 66.6666667%;
	top: 0;
	height: 100%;
	border-left: 1px dashed rgba(255,255,255,.5);
}
`