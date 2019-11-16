import React from 'react';
import styled from 'styled-components';

import HeaderLink from 'components/Header/HeaderLink';

const Dashboard = () => {
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
      </div>
      <div />
    </>
  );
};

export default Dashboard;
