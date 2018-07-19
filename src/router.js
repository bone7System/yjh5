import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Dynamic from 'dva/dynamic';
import { Layout } from 'antd';
import  getSize  from './utils/getSize'

const { Content } = Layout;

function RouterConfig({ history , app }) {
  //基础组件
  const Top = Dynamic({app,component: () => import('./layouts/Top')});
  const Footer = Dynamic({app,component: () => import('./layouts/Footer')});
  const MyContent = Dynamic({app,component: () => import('./layouts/Content')});
  //业主
  const OwnerHome = Dynamic({app,component: () => import('./app/owner/home')});//首页

  //商家
  const BusinessHome = Dynamic({app,component: () => import('./app/business/home')});//首页
  const BusinessOrder = Dynamic({app,component: () => import('./app/business/orderMng')});//商品发货情况(订单)
  const BusinessMycommodity = Dynamic({app,component: () => import('./app/business/mycommodity')});//我的商品
  const BusinessCommoditymng = Dynamic({app,component: () => import('./app/business/commoditymng')});//商品管理
  const BusinessStaff = Dynamic({app,component: () => import('./app/business/staff')});//员工管理



 




  const Home = Dynamic({app,component: () => import('./routes/IndexPage')});//首页

  return (
      <Router history={history}>
        <Route render={({ location }) => {
            return (
              <div key={location.pathname === '/login' ? 'login' : 'content'} style={{ width: '100%', height: '100%' }}>
                  <Switch location={location}>
                      {/* 只有获取过登录用户数据之后，才能进行操作 */}
                      {/* <Route location={location} path="/" render={() => (<Home />)} />
                      <Route location={location} path="/login" render={() => (<Home />)} /> */}
                      <Route path="/" exact component={Home} />
                      <Route path="/login" exact component={Home} />
                      <Route location={location} render={({ location }) => {
                          return (
                            <div style={{ height: '100%' }}>
                              <Layout style={{ background:'#FFF6F6' }}>
                                <Top />
                                <div style={{height:getSize().windowH-65,overflow:'auto'}}>
                                  <Content style={{paddingTop:'20px'}}>
                                      {/* 页面显示区域 */}
                                      <MyContent height={getSize().windowH-185}>
                                        <Switch location={location} key={location.pathname.split('/')[1]}>
                                            {/* 业主 */}
                                            <Route location={location} path="/owner/home" render={() => <OwnerHome  location={location}/>}/>

                                             {/* 商家 */}
                                             <Route location={location} path="/business/home" render={() => <BusinessHome  location={location}/>}/>
                                             <Route location={location} path="/business/order" render={() => <BusinessOrder minHeight={getSize().windowH-185} location={location}/>}/>
                                             <Route location={location} path="/business/mycommodity" render={() => <BusinessMycommodity  location={location}/>}/>
                                             <Route location={location} path="/business/commoditymng" render={() => <BusinessCommoditymng  location={location}/>}/>
                                             <Route location={location} path="/business/staff" render={() => <BusinessStaff  location={location}/>}/>


                                        </Switch>
                                      </MyContent>
                                  </Content>
                                  <Footer />
                                </div>
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

export default RouterConfig;
