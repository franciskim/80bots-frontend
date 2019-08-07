import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Arrow from './Arrow';
import Bubbles from './Bubbles';
import Cross from './Cross';
import Exit from './Exit';
import SpinningBubbles from './SpinningBubbles';
import User from './User';

export default class Icon extends Component {

  static icons = {
    arrow: Arrow,
    cross: Cross,
    exit: Exit,
    user: User,
    bubbles: Bubbles,
    'spinning-bubbles': SpinningBubbles
  };

  static propTypes = {
    color: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    name: PropTypes.oneOf(['cross', 'exit', 'user', 'arrow', 'bubbles', 'spinning-bubbles'
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
