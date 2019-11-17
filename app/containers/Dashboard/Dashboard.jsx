import React from 'react';
import styled from 'styled-components';

import HeaderLink from 'components/Header/HeaderLink';
import Listing from './Listing';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ListingWrapper = styled.div`
  width: 640px;
`;

class Dashboard extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render = () => {
    const push = this.props.history.push;
    const { role = 'doctor' } = JSON.parse(localStorage.getItem('user')) || {};
    console.log('role', role);
    return (
      <>
        <Container>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {role === 'doctor' && (
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
            )}
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
          <ListingWrapper>
            <Listing role={role} />
          </ListingWrapper>
        </Container>
      </>
    );
  };
}

export default Dashboard;
