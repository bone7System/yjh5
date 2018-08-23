import React from 'react';
import { Route} from 'dva/router';
import {getLoginUser} from '../utils/NHCore';
import createHashHistory from 'history/createHashHistory';
import {fullPageUrl} from '../utils/menu';
const hashHistory = createHashHistory();


/**
 * @author yizhiqiang
 * @date 2018/8/3
 * @time 14:34
 * @Description: 为路由提供登录过滤，访问某些页面时，如果没有登录则跳转到登录页
 */
class AuthorizedRoute extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      flag: true,      //是否需要进行重定向
      nextUrl:undefined //重定向的路径
    };
  }

  render() {
    const {component: Component, ...rest} = this.props;
    let isLogin = getLoginUser().userId?true:false;
    let menus=getLoginUser().menus?getLoginUser().menus:[];
    let curUrl= window.location.href.split('#')[1]+"/";

    //如果当前访问的是登录界面
    let menu = window.location.href.split('#')[1];
    //先判断改链接是否是完整的路径
    let isFullUrl=false;
    for(let i=0;i<fullPageUrl.length;i++){
      let url=fullPageUrl[i].url;
      if(curUrl.startsWith(url+"/")){
        isFullUrl=true;
        //判断是是否满足权限,或者是不需要设置权限
        if(!fullPageUrl[i].auth){
          //判断是否是必须登录才能访问且没有登录，此时跳转到登录界面
          if(fullPageUrl[i].isLogin!==false && !isLogin){
             //跳转到登登录界面
            hashHistory.push({
              pathname: "/login",
            });
          }
        }else{//该路径如果没有权限访问，就跳转到403界面
          hashHistory.push({
            pathname: "/403",
          });
        }
      }
    }
    //如果不是完整页面的路径，此时需要根据菜单判断是否有权限访问
    if(!isFullUrl){
        if(menu==='/login'){//如果此时是登录链接，如果已经登录了就直接跳转到第一个界面
          if(isLogin){
            let nextUrl=menus[0].url;//第一个菜单
            if(menus[0].children && menus[0].children.length>0){
                nextUrl=menus[0].children[0].url;
            }
            hashHistory.push({
              pathname: nextUrl,
            });
          }
        }else if(!isLogin){
          //跳转到登登录界面
          hashHistory.push({
            pathname: "/login",
          });
        }else{//如果是其他的链接，则需要判断是否有权限访问
          let ishaveAuth=false;
          for(let i = 0; i < menus.length; i++) {
              if(menus[i].children) {
                  for(let j = 0; j < menus[i].children.length; j++) {
                      if(curUrl.startsWith(menus[i].children[j].url+"/")) {
                          ishaveAuth=true;
                      }
                  }
              }else{
                  if(curUrl.startsWith(menus[i].url+"/")) {
                      ishaveAuth=true;
                  }
              }
          }
          //如果是已经登录，且访问了没有权限的菜单，则跳转到403界面
          if(!ishaveAuth){
              //跳转到403界面
              hashHistory.push({
                pathname: "/403",
              });
          }
        }

    }


    return (

      <Route {...rest} render={
        (props) => {
          return <Component {...props} {...rest} />
        }}
      />
    );
  }
}

export default AuthorizedRoute
