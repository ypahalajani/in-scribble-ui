import React from 'react';
// import styled from 'styled-components';

import HeaderLink from 'components/Header/HeaderLink';

const Dashboard = props => {
  const push = props.history.push;
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <HeaderLink to="/main-page">
          <i className="material-icons">gesture</i>
          <span
            style={{
              marginLeft: 8,
            }}
          >
            Let's Scribble some prescriptions!
          </span>
        </HeaderLink>
        <div
          onClick={() => {
            push('/login');
          }}
        >
          <HeaderLink to="/main-page">
            <span>Logout</span>
            <i
              style={{
                marginLeft: 8,
              }}
              className="material-icons"
            >
              exit_to_app
            </i>
          </HeaderLink>
        </div>
      </div>
      <div />
    </>
  );
};

export default Dashboard;
