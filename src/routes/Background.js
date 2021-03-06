import React from 'react';
import { Route } from 'dva/router';
import Dynamic from 'dva/dynamic';
import AuthorizedRoute from './AuthorizedRoute';
import BackLayout from '../layouts/background/layout/index';


function RouterConfig({ history , app }) {

  return (
    <BackLayout>
      <Route  path="/background/home" exact component={Dynamic({app,component: () => import("../app/background/home")})}/>
      <Route  path="/background/dmk" exact component={Dynamic({app,component: () => import("../app/background/dmk")})}/>
      <AuthorizedRoute  path="/background/commondity" exact component={Dynamic({app,component: () => import("../app/erp/commondity")})}/>
      <AuthorizedRoute  path="/background/menu" exact component={Dynamic({app,component: () => import("../app/background/menu")})}/>
      <AuthorizedRoute  path="/background/dept" exact component={Dynamic({app,component: () => import("../app/erp/dept")})}/>
      <AuthorizedRoute  path="/background/permission" exact component={Dynamic({app,component: () => import("../app/background/permission")})}/>
      <AuthorizedRoute  path="/background/role" exact component={Dynamic({app,component: () => import("../app/background/role")})}/>
      <AuthorizedRoute  path="/background/user" exact component={Dynamic({app,component: () => import("../app/erp/user")})}/>
      <AuthorizedRoute  path="/background/purchase" exact component={Dynamic({app,component: () => import("../app/erp/purchase")})}/>
      <AuthorizedRoute  path="/background/take" exact component={Dynamic({app,component: () => import("../app/erp/take")})}/>
      <AuthorizedRoute  path="/background/supplier" exact component={Dynamic({app,component: () => import("../app/erp/supplier")})}/>
      <AuthorizedRoute  path="/background/customer" exact component={Dynamic({app,component: () => import("../app/erp/customer")})}/>
    </BackLayout>
  );
}

export default RouterConfig;



