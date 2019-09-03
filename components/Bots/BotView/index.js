import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Card, CardBody } from 'components/default/Card';
import { Button, Badge } from 'components/default';
import { connect } from 'react-redux';
import { addExternalListener, removeAllExternalListeners } from 'store/socket/actions';

const Container = styled(Card)` 
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const BotView = ({ addExternalListener }) => {
  useEffect(() => {
  }, []);

  return(
    <>
      <Container>
        <CardBody>
        </CardBody>
      </Container>
    </>
  );
};

BotView.propTypes = {
  addExternalListener: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  addExternalListener: (...args) => dispatch(addExternalListener(...args)),
  removeAllExternalListeners: () => dispatch(removeAllExternalListeners()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BotView);
