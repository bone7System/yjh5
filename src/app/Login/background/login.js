import 'isomorphic-fetch';
import {Modal,message } from 'antd';
import { allMenu } from '../../../utils/menu' //左侧菜单数据
import createHashHistory from 'history/createHashHistory';

const hashHistory = createHashHistory();



export const userLogin = (params,func) => {
  console.info(params);
  fetch("api/wechat/login", {
        method:"POST",
        credentials:"include",
        headers:{
            // "Content-Type":"application/x-www-form-urlencoded",
            "Content-Type":"application/json; charset=utf-8",
            "X-Requested-With":"XMLHttpRequest"
        },
        body:JSON.stringify(params)
    })
        .then((response) => response.json())
        .then((res) => {
            console.info(res)
            if(res.code && res.code===500){
              func && func();
              message.error(res.massage);
            }else{
              let data=res.user;
              data.menus=handleMenus(res.mens);
              sessionStorage.setItem("userLogin",JSON.stringify(data));
              sessionStorage.setItem('access_token', res.token);
              //跳转到第一个菜单
              let nextUrl=data.menus[0].url;
              if(data.menus[0].children && data.menus[0].children.length>0){
                  nextUrl=res.data.menus[0].children[0].url;
              }
              hashHistory.push({
                  pathname: nextUrl,
              });
            }
            return res;
        })
        .catch((error) => {
            if(func){
                func();
            }
            // 网络请求失败返回执行该回调函数，得到错误信息
            Modal.error({ title: '错误提示', content: '网络请求异常,请联系管理员'});
            return error;
        })
}

export const userLogout = () => {
    fetch("logout", {
        method:"GET",
        credentials:"include",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
            "X-Requested-With":"XMLHttpRequest",
        }
    })
        .then((response) => response.json())
        .then((res) => {
            if(res.meta && res.meta.statusCode===200){
                sessionStorage.removeItem("userLogin");
                sessionStorage.removeItem("access_token");
                hashHistory.push({
                    pathname: '/login',
                });
            }else{
                message.error("退出登陆失败，请稍后再试一次！");
            }
            return res;
        })
        .catch((error) => {
            // 网络请求失败返回执行该回调函数，得到错误信息
            Modal.error({ title: '错误提示', content: '网络请求异常,请联系管理员'});
            return error;
        })
}

/**
 * 获取已经登录的用户信息
 * @param func
 */
// export const tryLoginUserInfo = (func) => {
//     //第一步，清空缓存
//     sessionStorage.removeItem("userLogin");
//     sessionStorage.removeItem("access_token");
//     fetch("tryLoginUserInfo", {
//         method:"POST",
//         credentials:"include",
//         headers:{
//             "Content-Type":"application/x-www-form-urlencoded",
//             "X-Requested-With":"XMLHttpRequest",
//         }
//     })
//         .then((response) => response.json())
//         .then((res) => {
//             if(res.meta && res.meta.statusCode===200){
//                 if(res.data){
//                     res.data.menus=handleMenus(res.data.authorization);
//                     sessionStorage.setItem("userLogin",JSON.stringify(res.data));
//                     sessionStorage.setItem('access_token', res.data.tokenId);
//                 }else{
//                     sso(func);
//                 }
//             }
//             sso(func);
//             return res;
//         })
//         .catch((error) => {
//             sso(func);
//             // 网络请求失败返回执行该回调函数，得到错误信息
//             Modal.error({ title: '错误提示', content: '网络请求异常,请联系管理员'});
//             return error;
//         })
// }

const handleMenus = (menus) => {
  if(!menus || menus.length<=0){
    let leftMenu=[];
    leftMenu.push({
        name: '首页',
        key: '403',
        url:'/background/403',
        icon: 'home',
    });
    return leftMenu;
  }else{
    return buildMenus(menus,-1);
  }
}

const buildMenus = (menus,parentKey) => {
  let resultList=[];
  for(let i=0;i<menus.length;i++){
      let pid=menus[i].parentId?menus[i].parentId:-1;
      if(pid===parentKey){
          let childrenList=buildMenus(menus,menus[i].id);
          if(childrenList.length>0){
            menus[i].children=childrenList;
          }
          resultList.push({
                url:menus[i].url,
                key:menus[i].id,
                name:menus[i].title,
                icon: menus[i].icon,
                children:menus[i].children
            });
      }
  }
  return resultList;
}
