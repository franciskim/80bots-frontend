import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Cross from './Cross';

export default class Icon extends Component {

  static icons = {
    cross: Cross
  };

  static propTypes = {
    color: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    name: PropTypes.oneOf(['cross'
    ]).isRequired //  coding assistance in IDE to find need icon when typing `name="...`
  };

  render() {
    const { name, color, ...props } = this.props;
    const IconToRender = Icon.icons[name];
    return (
      IconToRender && <IconToRender color={color} {...props}/>
    );
  }
}
