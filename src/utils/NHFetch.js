import 'isomorphic-fetch';
import { Modal,message} from 'antd';
import {getLoginUser} from './NHCore';

const startWith = (aimStr,str) => {
  aimStr=aimStr+"";
  if(str == null || str== "" || aimStr.length== 0 || str.length > aimStr.length){
	 return false;
  }
  if(aimStr.substr(0,str.length) == str){
     return true;
  }else{
     return false;
   }
  return true;
}

const hasClass = (node,className)=> {
    let exist=false;
    if (node.getAttribute('class')) {  // 存class属性
        // 式1
        if (node.getAttribute('class').indexOf(className) > -1) {
            exist=true;
        }
        // 式2
        if (node.className.indexOf(className) > -1) {
            exist=true;
        }
    }
    return exist;
}

const parents = (obj,className) => {
    if(obj.tagName==='BODY'){
        return undefined;
    }
    if(hasClass(obj,className)){
        return obj;
    }else{
        return parents(obj.parentNode,className);
    }
}

const getTitles = (fields)=> {
    let errorInfo="";
    for(let i=0;i<fields.length;i++){
        let obj=document.getElementById(fields[i]);
        if(obj){
            //获取标签的上级第一个存在ant-form-item-control-wrapper类的标签
            let parentObj=parents(obj,'ant-form-item-control-wrapper');
            if(parentObj){
                let prevObj=parentObj.previousSibling;
                if(prevObj){
                    let labelObj=prevObj.getElementsByTagName("label");
                    if(labelObj && labelObj.length>0){
                        let title=labelObj[0].attributes["title"].nodeValue;
                        if(title){
                            errorInfo+=","+title;
                        }
                    }
                }
            }
        }
    }
    return errorInfo?errorInfo.substring(1):"";
}

/**
 * 唯一性约束错误提示
 */
const onlyDataErrorTip = (res) => {
    let fieldStr=res.message.substring(14,res.message.length-1);
    let fields=fieldStr.split(",");
    let errorInfo=getTitles(fields);
    if(errorInfo){
        message.info(errorInfo+"已经存在！");
    }else{
        message.info("存在数据违反了唯一性约束，请检查之后再提交！");
    }
}

/**
 * 数据太长错误提示
 */
const dataToLongErrorTip = (res) => {
    let fieldStr=res.message.substring(16,res.message.length-1);
    let fields=fieldStr.split(",");
    let errorInfo=getTitles([fields[0]]);
    if(errorInfo){
        message.info(errorInfo+"数据太长(要求长度："+fields[2]+"，实际长度："+fields[1]+")！");
    }else{
        message.info("存在数据值太长，请检查之后再提交！");
    }
}

/**
 * 数据不能为空
 */
const columnNotNullTip = (res) => {
    let fieldStr=res.message.substring(14,res.message.length-1);
    let fields=fieldStr.split(",");
    let errorInfo=getTitles(fields);
    if(errorInfo){
        message.info(errorInfo+"不能为空！");
    }else{
        message.info("存在数据不能为空，请检查之后再提交！");
    }
}

const NHFetch =  (pUrl,pMethod,params,errorFunc) => {
    let opts = {};
    let tmpHeader = "";
    let url = pUrl;
    let method = "";

    if(startWith(url,"/")){
        url='api'+url;
    }

    //默认的请求方式是POST
    if (pMethod === undefined || pMethod === "" ) {
        method = "POST";
    }else{
        method = pMethod;
    }

    if(method.toLowerCase()==='get'){//如果是get方式，则把参数拼凑到url路径上面
        if(params !== undefined && params !== ""){
            //如果params是Map对象，则需要先转换成字符串
            if((typeof params)==='string'){
                url = url+"?"+params;
            }else{//不是字符串就一定是map对象
                let paramsStr="";
                for(let key in params){
                    if((typeof params[key])==='object'){
                        let params2=params[key];
                        for(let key2 in params2){
                            paramsStr+="&"+key+"."+key2+"="+params2[key2];
                        }
                    }else{
                        paramsStr+="&"+key+"="+params[key];
                    }
                }
                url = url+"?"+paramsStr;
            }
        }
        tmpHeader = "application/x-www-form-urlencoded;charset=UTF-8";
    }else{//除了get，所有方法改为post
        method = "POST";
        tmpHeader = "application/json;charset=UTF-8";
        if(params !== undefined && params !== ""){
            opts.body = JSON.stringify(params);
        }
    }
    opts.method = method;
    //  credentials: 'include',
    opts.headers = {"Content-Type": tmpHeader};

    let token=window.sessionStorage.getItem("access_token");
    if (token){
        opts.headers['x-auth-token']=token;
    }
    const nodeEnv = process.env.NODE_ENV || 'development';
    if(nodeEnv==='development'){
        opts.headers.loginUserId=getLoginUser().userId;
    }

    opts.credentials='include';
    if (pMethod==='nbpost'){
        return fetch(url, opts)
        .then((response) => response.blob())
        .then((res) => {
            //post请求获取流
            return res;
        })
        .catch((error) => {
            // 网络请求失败返回执行该回调函数，得到错误信息
            Modal.error({ title: '网络请求异常,请联系管理员', content: error,});
            var res={
                code: 400,
                message: error
            }
            return res;
        })
    }else{
        return fetch(url, opts)
        .then((response) => {
           if(response.status === 200){
                return response.json()
            }else if(response.status === 302){
                message.error("未登录或登录已过期,请刷新页面重新登录！");
                sessionStorage.removeItem("userLogin");
                sessionStorage.removeItem("access_token");
            }else if(response.status === 401){
                message.error("您正在尝试访问未授权的功能!");
            }else{
                //如果存在错误的回调方法，则调用回调方法，否则提示网络请求异常
                if(errorFunc){
                  errorFunc();
              }else{
                  Modal.error({ title: '错误提示', content: '网络请求异常,请联系管理员'});
              }
            }
            return undefined;
       })
        .then((res) => {
            if(res === undefined){
              return undefined;
            }else if((res.meta && res.meta.statusCode===401) || res.code===302){
                //判断是否没有权限
                message.error("您正在尝试访问未授权的功能!");
                return undefined;
            }else if(res.meta && res.meta.statusCode===500){
                Modal.error({ title: '错误提示', content:'系统出现异常，请联系管理员！'});
                return undefined;
            }else if(res && res.code && res.code !==200 ){//判断出现的问题
                let msg=res.message;
                if(startWith(msg,"businessLogicError[")){//自定义的提示（错误）
                    Modal.error({ title: '错误提示', content: res.message.substring(19,res.message.length-1),});
                }else if(startWith(msg,"businessLogicWarm[")){//自定义的提示（警告）
                    Modal.warning({ title: '警告提示', content: res.message.substring(19,res.message.length-1),});
                }else if(startWith(msg,"businessLogicInfo[")){//自定义的提示（消息）
                    Modal.info({ title: '消息提示', content: res.message.substring(19,res.message.length-1),});
                }else if(startWith(msg,"onlyDataError[")){//数据唯一性异常
                    onlyDataErrorTip(res);
                }else if(startWith(msg,"dataToLongError[")){//数据太长
                    dataToLongErrorTip(res);
                }else if(startWith(msg,"columnNotNull[")){//数据不能为空异常
                    columnNotNullTip(res);
                }else{
                    Modal.error({ title: '错误提示', content:'系统出现异常，请联系管理员！'});
                }
                return undefined;
           }else if(res.status && res.status===404){
                Modal.error({ title: '错误提示', content:'系统出现异常，请联系管理员！'});
                return undefined;
            }else if(res && res.code && res.code ===200 ){//返回的是正确的结果,公司通用放回格式
                return res;
            }else if(res && res.meta && res.meta.statusCode===200){//返回的是正确的结果，四部返回格式
                return res;
            }else{//剩下的情况都是有错误
                Modal.error({ title: '错误提示', content:'系统出现异常，请联系管理员！'});
            }
          //在此处统一对后台抛出来的异常进行处理
          return undefined;
        })
        .catch((error) => {
            if(error.status===302){
                message.error("未登录或登录已过期,请刷新页面重新登录！");
                sessionStorage.removeItem("userLogin");
                sessionStorage.removeItem("access_token");
            }else{
                Modal.error({ title: '错误提示', content: '网络请求异常,请联系管理员'});
            }
            return error;
        })
    }

}

export default NHFetch;
