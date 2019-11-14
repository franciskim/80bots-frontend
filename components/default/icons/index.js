import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Arrow from './Arrow';
import Bubbles from './Bubbles';
import Cross from './Cross';
import Danger from './Danger';
import Download from './Download';
import Edit from './Edit';
import Eye from './Eye';
import Exit from './Exit';
import Garbage from './Garbage';
import Help from './Help';
import LightPlus from './LightPlus';
import Plus from './Plus';
import SpinningBubbles from './SpinningBubbles';
import User from './User';
import Dollar from './Dollar';
import Restore from './Restore';
import Copy from './Copy';

export default class Icon extends Component {

  static icons = {
    arrow: Arrow,
    bubbles: Bubbles,
    cross: Cross,
    download: Download,
    danger: Danger,
    edit: Edit,
    eye: Eye,
    exit: Exit,
    garbage: Garbage,
    help: Help,
    'light-plus': LightPlus,
    plus: Plus,
    'spinning-bubbles': SpinningBubbles,
    user: User,
    dollar: Dollar,
    restore: Restore,
    copy: Copy,
  };

  static propTypes = {
    color: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    name: PropTypes.oneOf(['cross', 'exit', 'user', 'arrow', 'bubbles', 'spinning-bubbles', 'edit', 'eye',
      'garbage', 'plus', 'download', 'help', 'dollar', 'light-plus', 'danger', 'restore', 'copy'
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
