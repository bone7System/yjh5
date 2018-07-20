import React from 'react';
import { Router, Route , Switch ,Link } from 'dva/router';
import Dynamic from 'dva/dynamic';
import { Layout , Menu  , Icon } from 'antd';
import getSize  from '../utils/getSize'
import {getLoginUser} from '../utils/NHCore';
import logo_collapsed from './images/logo-s.png';
import styles from './style.css';
/**图标 */
const userIconImg = require.context("./images/icons", true, /(\.gif|\.jpeg|\.png|\.jpg|\.bmp)/);
const { Content , Sider } = Layout;
const { SubMenu } = Menu;


function RouterConfig({ history , app }) {
  let collapsed=false;
  let openKeys=[];
  let iconData={};//图标
  let imgIconData = userIconImg.keys().map(userIconImg);
  userIconImg.keys().map((imgName, key) => {
      iconData[imgName] = imgIconData[key];
  });
  const initState = getLoginUser();
  let leftMenu=initState.menus?initState.menus:[];
  let selectedKeys=getSelectedKeys(leftMenu);
  

  //基础组件
  const Top = Dynamic({app,component: () => import('../app/background/layouts/Top')});
  //功能模块
  const Home = Dynamic({app,component: () => import('../app/background/home')});//首页
  const Dmk = Dynamic({app,component: () => import('../app/background/dmk')});//代码库


  


  return (
    <Router history={history}>
      <Route render={({ location }) => {
          return (
            <div key={'content'} style={{ width: '100%', height: '100%',background:'red' }}>
                <Switch location={location}>
                    <Route location={location} render={({ location }) => {
                        return (
                          <div style={{ height: '100%' }}>
                            <Layout style={{ height: '100%' }}>
                              {/* 左侧菜单栏 */}
                              <Sider
                                trigger={null}
                                collapsible
                                collapsed={collapsed}
                                width={255}
                              >
                                <div className={styles.logo}>
                                    <img style={{maxWidth:40,maxHeight:40}} src={logo_collapsed}/>
                                    {!collapsed &&
                                        <span><b>Demo项目</b></span>}
                                </div>
                                <Menu theme="dark"
                                      mode="inline"
                                      openKeys={openKeys}
                                      // onOpenChange={this.onOpenChange}
                                      selectedKeys={selectedKeys}
                                      onClick={(item) => {}}
                                >
                                     {leftMenu.map((item, index) => {
                                        if (item.children && item.children != '') {
                                            let htmlct = [];
                                            let menuItem = item.children.map((itemM, index) => {
                                                return <Menu.Item key={itemM.key}>
                                                    <Link key={1} to={itemM.url} >
                                                        {iconData[itemM.icon]?<img className='anticon'  src={iconData[itemM.icon]} style={{width:'14px',height:'14px',marginRight:'10px'}}/>:<Icon type={itemM.icon} />}
                                                        <span>{itemM.name}</span>
                                                    </Link></Menu.Item>
                                            })
                                            htmlct.push(<SubMenu key={item.key} title={<span>
                                                {iconData[item.icon]?<img className='anticon'  src={iconData[item.icon]} style={{width:'14px',height:'14px',marginRight:'10px'}}/>:<Icon type={item.icon} />}
                                                <span>{item.name}</span></span>}>{menuItem}</SubMenu>)
                                            return htmlct
                                        }else{
                                            return <Menu.Item key={item.key}>
                                                <Link key={1} to={item.url} >
                                                    {iconData[item.icon]?<img className='anticon'  src={iconData[item.icon]} style={{width:'14px',height:'14px',marginRight:'10px'}}/>:<Icon type={item.icon} />}
                                                    <span>{item.name}</span>
                                                </Link>
                                            </Menu.Item>
                                        }
                                    })} 
                                </Menu>
                            </Sider>
                            <Layout>
                              <Top />
                              <Content style={{height:getSize().windowH-65,overflow:'auto',paddingTop:'15px',paddingLeft:'15px',paddingRight:'15px'}}>
                                  <div style={{background:'white',height:'100%',width:'100%'}}>
                                    <Switch location={location} key={'switchKey'} >
                                      <Route location={location} path="/background/home" render={() => <Home  location={location}/>}/>
                                      <Route location={location} path="/background/dmk" render={() => <Dmk  location={location}/>}/>


                                    </Switch>
                                  </div>
                              </Content>
                            </Layout>
                            </Layout>
                          </div>
                        )
                    }} />
                </Switch>
            </div>
          )
      }} />
    </Router>
  );
}

function getSelectedKeys(menus){
    let selectedKeys=[];
    let curUrls = window.location.href.split('#')[1];
    if(curUrls){
        menus.map((item,index) => {
            if(item.children && item.children.length>0){
                item.children.map((cItem,index) => {
                    if(curUrls.startsWith(cItem.url)){
                        selectedKeys.push(cItem.key);
                    }
                });
            }else{
                if(curUrls.startsWith(item.url)){
                    selectedKeys.push(item.key);
                }
            }
        });
    }
    return selectedKeys;
}

export default RouterConfig;



