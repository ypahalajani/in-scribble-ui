import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

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
      backendResponse: '',
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

    const basePath = 'https://yahihai.azurewebsites.net/api';

    axios
      .post(`${basePath}/prescription`, requestBody)
      .then(response => {
        this.setState({
          backendResponse: JSON.stringify(response.data, null, 2),
        });
      })
      .catch(console.log);
  };

  handleClearButton = () => {
    debugger;
    this.inkCanvas.clear();
  };

  render() {
    console.log('[Mainpage.jsx] inside render');
    return (
      <Container>
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
        {this.state.backendResponse && <p>{this.state.backendResponse}</p>}
      </Container>
    );
  }
}

export default MainPage;
