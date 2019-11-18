/* eslint react/prop-types: 0 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import MainPage from 'containers/MainPage/Loadable';
import Dashboard from 'containers/Dashboard/Loadable';
import Login from 'containers/Login/Loadable';

import GlobalStyle from '../../global-styles';

const AppWrapper = styled.div``;

const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = localStorage.getItem('user') || '{}';
  const { authenticated: userAuthenticated = false } = JSON.parse(user);
  return (
    <Route
      {...rest}
      render={props =>
        userAuthenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const App = () => (
  <AppWrapper>
    <Helmet
      titleTemplate="%s - React.js Boilerplate"
      defaultTitle="React.js Boilerplate"
    >
      <meta name="description" content="A React.js Boilerplate application" />
    </Helmet>
    {/* <Header /> */}
    <Switch>
      <PrivateRoute exact path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/main-page" component={MainPage} />
      <Route path="/features" component={FeaturePage} />
      <PrivateRoute path="/home" component={HomePage} />
      <Route path="" component={NotFoundPage} />
    </Switch>
    {/* <Footer /> */}
    <GlobalStyle />
  </AppWrapper>
);

export default App;
