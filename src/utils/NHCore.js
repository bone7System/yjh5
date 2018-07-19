/**
 * 获取登陆用户信息 
 * {
 *  userId:'admin', //登录账号
 *  userType:'owner', //用户类型，owner：业主，business：商家
 *  userName:'管理员', //用户名
 * }
 * 
 */
export const getLoginUser = () => {
    let loginUser = sessionStorage.getItem('userLogin') ? JSON.parse(sessionStorage.getItem('userLogin')) : {};
    loginUser = {
        userId:'18820160160',
        userType:'business',
        userName:'用户名'
    }
    return loginUser;
}

/**
 * 获取UUID
 */
export const createUuid= () => {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}


/**
 * 获取对象高度
 * @param {*} node 节点对象
 */
export const getSuitHeight = (node) => {
    var height=SuitHeight(node)-2;//设置合适高度的时候减去两个边框的高度，可以保证紧密镶嵌式不会因为上下边框产生滚动条
    return height;
}

function SuitHeight(node){
    var parentObj=node.parentNode;
    //获得parentObj所有直接非grid子节点
    var childrenObj=parentObj.childNodes;
    var elseChildrenHeight=0;
    for(var i=0;i<childrenObj.length;i++){
        if(childrenObj[i].nodeName === "#text" && !/\s/.test(childrenObj.nodeValue)){
            continue;
        }
        if(childrenObj[i]!==node && childrenObj[i].tagName!=="SCRIPT"&& childrenObj[i].tagName!=="STYLE"
            && childrenObj[i].style.display!=="none" && childrenObj[i].style.position!=="absolute"
            ){//吧script的高度也排除掉
            let marginTop=getDomStyle(childrenObj[i],"marginTop")?parseInt(getDomStyle(childrenObj[i],"marginTop"),10):0;
            let marginBottom=getDomStyle(childrenObj[i],"marginBottom")?parseInt(getDomStyle(childrenObj[i],"marginBottom"),10):0;
            if(childrenObj[i].offsetHeight && childrenObj[i].offsetHeight>0){
                //获得所有非本元素的其他父类子元素的margin的值
                elseChildrenHeight+=childrenObj[i].offsetHeight+marginTop+marginBottom;
            }
        }
    }
    //父级对象的高度-其他对象的高度
    var gridSuitHeight=parentObj.clientHeight-elseChildrenHeight;
    return gridSuitHeight;
}

/**
 * 获取对象的样式的值
 * @param {*} element 
 * @param {*} attr 
 */
export const getStyle = (element, attr) => {
    return getDomStyle(element, attr);
}

function getDomStyle(curEle,attr){
    if("getComputedStyle" in window){
        return window.getComputedStyle(curEle,null)[attr];
    }else{
        if(attr === "opacity"){
            let val = curEle.currentStyle["filter"];
            let reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;
            return reg.test(val)?reg.exec(val)[1]/100:1;
        }else{
            return curEle.currentStyle[attr];
        }
    }
}