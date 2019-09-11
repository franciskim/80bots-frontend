import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Arrow from './Arrow';
import Bubbles from './Bubbles';
import Cross from './Cross';
import Download from './Download';
import Edit from './Edit';
import Eye from './Eye';
import Exit from './Exit';
import Garbage from './Garbage';
import Help from './Help';
import SpinningBubbles from './SpinningBubbles';
import Plus from './Plus';
import User from './User';
import Dollar from './Dollar';

export default class Icon extends Component {

  static icons = {
    arrow: Arrow,
    bubbles: Bubbles,
    cross: Cross,
    download: Download,
    edit: Edit,
    eye: Eye,
    exit: Exit,
    garbage: Garbage,
    help: Help,
    'spinning-bubbles': SpinningBubbles,
    plus: Plus,
    user: User,
    dollar: Dollar
  };

  static propTypes = {
    color: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    name: PropTypes.oneOf(['cross', 'exit', 'user', 'arrow', 'bubbles', 'spinning-bubbles', 'edit', 'eye',
      'garbage', 'plus', 'download', 'help', 'dollar'
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
