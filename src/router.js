import React from 'react';
import { Redirect ,Router, Route, Switch } from 'dva/router';
import Dynamic from 'dva/dynamic';
import AuthorizedRoute from './routes/AuthorizedRoute';



function RouterConfig({ history , app }) {
  const Background = Dynamic({app,component: () => import('./routes/Background')});
  const Page = Dynamic({app,component: () => import('./routes/Page')});

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" render={() => (<Redirect to="/login" />)} />
        <AuthorizedRoute path='/login' exact component={Dynamic({app,component: () => import("./app/Login/background")})} />
        <AuthorizedRoute path='/403' exact component={Dynamic({app,component: () => import("./layouts/Exception/403")})} />
        <Route path="/background" component={Background} />
        <Route path='/page' component={Page} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
