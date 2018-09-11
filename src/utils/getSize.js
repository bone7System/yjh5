const getSize = () => {
	let windowW,windowH,contentH,scrollT;
	windowH = window.innerHeight;
	windowW = window.innerWidth;
	scrollT = document.documentElement.scrollTop || document.body.scrollTop;
	contentH = windowH-110;
	return {windowW,windowH,contentH,scrollT}
}

export default getSize;
