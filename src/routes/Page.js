import React from 'react';
import { Route } from 'dva/router';
import Dynamic from 'dva/dynamic';
import AuthorizedRoute from './AuthorizedRoute';
import PageLayout from '../layouts/page/layout/index';



function RouterConfig({ history , app }) {

  return (
    <PageLayout>
      {/* 业主 */}
      <AuthorizedRoute  path="/page/owner/home" exact component={Dynamic({app,component: () => import("../app/owner/home")})}/>
      {/* 商家 */}
      <AuthorizedRoute  path="/page/business/home" exact component={Dynamic({app,component: () => import("../app/business/home")})}/>
      <AuthorizedRoute  path="/page/business/order" exact component={Dynamic({app,component: () => import("../app/business/orderMng")})}/>}/>
      <AuthorizedRoute  path="/page/business/mycommodity" exact component={Dynamic({app,component: () => import("../app/business/mycommodity")})}/>
      <AuthorizedRoute  path="/page/business/commoditymng" exact component={Dynamic({app,component: () => import("../app/business/commoditymng")})}/>
      <AuthorizedRoute  path="/page/business/staff" exact component={Dynamic({app,component: () => import("../app/business/staff")})}/>}/>
    </PageLayout>
  );
}

export default RouterConfig;



