import React from 'react';
import PropTypes from 'prop-types';
import CardWithPreview from '/components/default/CardWithPreview';

const StyledCard = CardWithPreview``;

const ScreenShot = ({ ...props }) => {
  return( <StyledCard {...props} />);
};

ScreenShot.propTypes = {
  src:     PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired
};

export default ScreenShot;
