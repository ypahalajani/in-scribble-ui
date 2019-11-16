import React from 'react';

class Login extends React.Component {
  componentDidMount = () => {
    // clear the localStorage
    localStorage.removeItem('user');
  };
  render = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          fontWeight: '200',
        }}
      >
        Welcome to login page
      </h1>
      <div>
        <button
          onClick={() => {
            localStorage.setItem(
              'user',
              JSON.stringify({
                authenticated: true,
                email: 'shreuyb@akjc.com',
              }),
            );
            this.props.history.push(`/`);
          }}
        >
          Click to Login
        </button>
      </div>
    </div>
  );
}

export default Login;
