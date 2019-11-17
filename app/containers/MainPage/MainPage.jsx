import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { get, isEmpty } from 'lodash';

import LoadingIndicator from 'components/LoadingIndicator';
import HeaderLink from 'components/Header/HeaderLink';
import ListItemRenderer, { Card } from 'containers/Dashboard/ListRenderer';

const Container = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ededed;

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

const ListItemWrapper = styled(Card)`
  padding: 8px;
  flex-grow: 1;
  width: 320px;

  > p {
    margin: 0;
    text-transform: capitalize;
  }
`;

const ListItem = ({ name, frequency, ...restProps }) => {
  return (
    <ListItemWrapper {...restProps}>
      <p>{name}</p>
      <p>{frequency}</p>
    </ListItemWrapper>
  );
};

class MainPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      backendResponse: [],
      error: undefined,
    };
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.inkCanvas = new window.InkCanvas('inkCanvas');
  }

  handleMedicationSubmit = () => {
    console.log(this.inputRef.current.value);
    debugger;
    const { email } = JSON.parse(localStorage.getItem('user')) || {};
    const requestBody = {
      doctorEmail: email,
      patientEmail: this.inputRef.current.value,
      medications: this.state.backendResponse,
    };

    const basePath = 'https://isscribble.azurewebsites.net/api';
    const URL = '/submit?code=yahihai';
    axios
      .post(`${basePath}${URL}`, requestBody)
      .then(() => {
        debugger;
        // redirect
        this.props.history.push('/');
      })
      .catch(errorResponse => {
        debugger;
      });
  };

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
        debugger;
        this.setState({
          loading: false,
          backendResponse: response.data,
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
    this.setState({ loading: false, backendResponse: [], error: undefined });
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
      return (
        <>
          {/* TODO: uncomment this when checking for backend response. */}
          {/* <pre>{JSON.stringify(this.state.backendResponse, null, 2)}</pre> */}
          <ListItemRenderer data={this.state.backendResponse}>
            {(item, index) => <ListItem key={index} {...item} />}
          </ListItemRenderer>
          <input
            type="email"
            placeholder="Enter email address of patient"
            ref={this.inputRef}
            style={{ width: '320px' }}
          />
          <button
            type="button"
            onClick={this.handleMedicationSubmit}
            style={{
              marginTop: 8,
            }}
            disabled={this.state.backendResponse.length === 0}
          >
            Submit
          </button>
        </>
      );
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
            height="600"
            style={{
              backgroundColor: 'white',
              boxShadow: 'rgba(0, 0, 0, 0.16) 0px 4px 16px 0px',
              borderRadius: 8,
              backgroundColor: 'white',
              border: '2px solid #CCC',
              touchAction: 'none',
            }}
          />
        </div>
        <ButtonGroup>
          <button onClick={this.handleSubmitButton}>Recognize</button>
          <button onClick={this.handleClearButton}>Clear</button>
        </ButtonGroup>
        {this.renderContent()}
      </Container>
    );
  }
}

export default MainPage;
