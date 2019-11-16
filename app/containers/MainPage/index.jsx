import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 16px;
`;

class MainPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.inkCanvas = new window.InkCanvas('inkCanvas');
  }

  printResponseInConsole = () => {
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

    console.log(JSON.parse(inkRecognizer.data()));
  };

  render() {
    console.log('[Mainpage.jsx] inside render');
    return (
      <Container>
        <canvas
          id="inkCanvas"
          width="700"
          height="350"
          style={{
            border: '2px solid #CCC',
            touchAction: 'none',
          }}
        />
        <button onClick={this.printResponseInConsole}>See response</button>
      </Container>
    );
  }
}

export default MainPage;
