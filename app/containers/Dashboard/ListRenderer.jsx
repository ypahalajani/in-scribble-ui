import React from 'react';
import styled from 'styled-components';

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const Card = styled.div`
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 4px 16px 0px;
  border-radius: 4px;
`;

const ListRenderer = props => {
  return (
    <ListWrapper>{props.data.map(item => props.children(item))}</ListWrapper>
  );
};

export default ListRenderer;
