import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Item from './Item';
import {CardBody} from '../Card';

const Content = styled(CardBody)`
  display: flex;
  flex-flow: column wrap;
  height: 77vh;
  ${ props => props.styles };
`;

const ListWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  ${ props => props.styles };
`;

const List = ({ items, ...props }) => {
  return(
    <Content>
      <ListWrapper>
        { items.map((item, i) => <Item item={item} key={i} {...props} />) }
      </ListWrapper>
    </Content>
  );
};

List.propTypes = {
  items: PropTypes.array.isRequired
};

export default List;