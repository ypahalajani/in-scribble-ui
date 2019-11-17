import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { isEmpty } from 'lodash';

import LoadingIndicator from 'components/LoadingIndicator';
import { Card } from 'containers/Dashboard/ListRenderer';

const StyledCard = styled(Card)`
  width: 640px;
  padding: 16px;
  margin: 32px 0;
`;

class PrescriptionCard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: {},
      error: undefined,
    };
  }

  componentDidMount() {
    this.setState({
      loading: true,
    });
    const basePath = 'https://isscribble.azurewebsites.net/api';
    const URL = `/getprescription?prescriptionId=${
      this.props.prescriptionId
    }&code=yahihai`;
    axios
      .get(`${basePath}${URL}`)
      .then(({ data: response }) => {
        this.setState({
          loading: false,
          data: response.data,
        });
      })
      .catch(error => {
        console.log(error);
        this.props.closeModal();
      });
  }

  render() {
    if (this.state.loading) {
      return <LoadingIndicator />;
    }

    const { role = 'doctor' } = JSON.parse(localStorage.getItem('user')) || {};

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          height: '100%',
          flexGrow: 1,
        }}
      >
        <StyledCard>
          <span>
            {role === 'doctor' ? 'Prescription for: ' : 'Prescription by: '}
          </span>
          <span>{this.state.data.name}</span>
          <ul>
            {!isEmpty(this.state.data) &&
              this.state.data.medications.map(item => {
                return (
                  <li>
                    <span>{item.name}</span>
                    {' - '}
                    <span>{item.frequency}</span>
                  </li>
                );
              })}
          </ul>
        </StyledCard>
      </div>
    );
  }
}

export default PrescriptionCard;
