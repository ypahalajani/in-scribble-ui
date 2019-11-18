import React from 'react';
import axios from 'axios';
import { isEmpty, get } from 'lodash';
import styled from 'styled-components';
// import { parse, format } from 'date-fns';

import LoadingIndicator from 'components/LoadingIndicator';

import ListItemRenderer, { Card } from 'containers/Dashboard/ListRenderer';
import PrescriptionCard from './PrescriptionCard';

const ListItemWrapper = styled(Card)`
  padding: 8px 16px;
  flex-grow: 1;
  cursor: pointer;

  > p {
    margin: 0;
    text-transform: capitalize;
  }
`;

const CloseButtonWrapper = styled.div`
  cursor: pointer;
`;

const Modal = styled.div`
  border: 1px solid;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #ededed;

  ${CloseButtonWrapper} {
    position: absolute;
    top: 0;
    right: 0;
    padding: 16px;
  }
`;

const ListItem = ({ name, createdOn, ...restProps }) => {
  return (
    <ListItemWrapper {...restProps}>
      <p>{name}</p>
      {/* <p>{parse(createdOn, 'T', 'N/A').format(`MMM Mo',' yyyy kk':'ss`)}</p> */}
      <p>{new Date(createdOn).toDateString()}</p>
    </ListItemWrapper>
  );
};

class Listing extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      error: undefined,
    };
  }

  showModal = modalData => {
    if (isEmpty(modalData)) {
      console.log('Empty data');
      return;
    }

    this.setState({
      modalVisible: true,
      modalData,
    });
  };

  hideModal = () => {
    this.setState({
      modalVisible: false,
      modalData: undefined,
    });
  };

  componentDidMount() {
    const { email, role = 'doctor' } =
      JSON.parse(localStorage.getItem('user')) || '{}';
    const basePath = 'https://isscribble.azurewebsites.net/api';
    const getListURL = `/${
      role === 'doctor' ? 'getdoctorprescriptions' : 'getpatientprescriptions'
    }?code=yahihai&email=${email}`;
    this.setState({ loading: true });
    axios
      .get(`${basePath}${getListURL}`)
      .then(({ data: response }) => {
        this.setState({
          loading: false,
          data: response.data,
        });
      })
      .catch(errorResponse => {
        const error = get(errorResponse, 'response.data', {
          code: 500,
          message: 'Something went wrong',
        });
        console.log(errorResponse);
        this.setState({
          loading: false,
          error,
        });
      });
  }

  render() {
    if (this.state.loading) {
      return <LoadingIndicator />;
    }

    if (!isEmpty(this.state.error)) {
      return (
        <p
          style={{
            display: 'flex',
            alignItem: 'center',
          }}
        >
          <i className="material-icons">error_outline</i>
          <span style={{ marginLeft: 8 }}>Oops! Something went wrong.</span>
        </p>
      );
    }

    // TODO: pass extra prop for onClick listener
    return (
      <>
        <ListItemRenderer data={this.state.data}>
          {item => (
            <ListItem
              key={item.id}
              {...item}
              onClick={() => this.showModal(item)}
            />
          )}
        </ListItemRenderer>
        {this.state.modalVisible && (
          <Modal>
            <CloseButtonWrapper onClick={this.hideModal}>
              <i className="material-icons">close</i>
            </CloseButtonWrapper>
            <PrescriptionCard
              prescriptionId={this.state.modalData.id}
              closeModal={this.hideModal}
            />
          </Modal>
        )}
      </>
    );
  }
}

export default Listing;
