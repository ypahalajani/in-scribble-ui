import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { get, isEmpty } from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';

import HeaderLink from 'components/Header/HeaderLink';

const Container = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;

  > div {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const ButtonGroup = styled.div`
  button {
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

class MainPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      backendResponse: '',
      error: undefined,
    };
  }

  componentDidMount() {
    this.inkCanvas = new window.InkCanvas('inkCanvas');
  }

  handleSubmitButton = () => {
    var strokes = this.inkCanvas.strokes;

    // TODO: do something about `getLanguageTag`
    const inkRecognizer = new window.Recognizer(
      window.ENDPOINT_URL,
      window.SUBSCRIPTION_KEY,
      'en-US',
    );

    strokes.map(function(stroke) {
      var strokeString = stroke.toJsonString(PIXEL_TO_MILLIMETERS);
      inkRecognizer.addStroke(stroke.id, strokeString);
    });

    const requestBody = JSON.parse(inkRecognizer.data());

    console.log(`This is the requestbody:
    ${JSON.stringify(requestBody, null, 2)}
    `);

    const basePath = 'https://isscribble.azurewebsites.net/api';

    this.setState({
      loading: true,
      error: undefined,
    });

    axios
      .post(`${basePath}/prescription?code=yahihai`, requestBody)
      .then(response => {
        this.setState({
          loading: false,
          backendResponse: JSON.stringify(response.data, null, 2),
        });
      })
      .catch(errorResponse => {
        const error = get(errorResponse, 'response.data', {
          code: 500,
          message: 'Something went wrong',
        });
        console.log('error', errorResponse);
        this.setState({
          loading: false,
          error,
        });
      });
  };

  handleClearButton = () => {
    this.inkCanvas.clear();
    this.setState({ loading: false, backendResponse: '', error: undefined });
  };

  renderContent = () => {
    if (this.state.loading) {
      return <LoadingIndicator />;
    }

    if (!isEmpty(this.state.error)) {
      return (
        <div>
          <p
            style={{
              display: 'flex',
              alignItem: 'center',
            }}
          >
            <i className="material-icons">error_outline</i>
            <span style={{ marginLeft: 8 }}>Oops! Something went wrong.</span>
          </p>
          {this.state.error && (
            <pre>{JSON.stringify(JSON.parse(this.state.error), null, 2)}</pre>
          )}
        </div>
      );
    } else {
      return <pre>{this.state.backendResponse}</pre>;
    }
  };

  render() {
    return (
      <Container>
        <HeaderLink to="/">
          <i className="material-icons">arrow_back</i>
          <span
            style={{
              marginLeft: 8,
            }}
          >
            Back to dashboard
          </span>
        </HeaderLink>
        <div>
          <canvas
            id="inkCanvas"
            width="700"
            height="350"
            style={{
              border: '2px solid #CCC',
              touchAction: 'none',
            }}
          />
        </div>
        <ButtonGroup>
          <button onClick={this.handleSubmitButton}>
            Let Backend know what you are writing
          </button>
          <button onClick={this.handleClearButton}>Clear</button>
        </ButtonGroup>
        {this.renderContent()}
      </Container>
    );
  }
}

export default MainPage;
