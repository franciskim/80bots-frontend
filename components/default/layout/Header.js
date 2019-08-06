import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from '../icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import DropDown from 'components/default/DropDown';
import HamburgerButton from '../HamburgerButton';
import { logout } from 'store/auth/actions';
import Router from 'next/router';

const Container = styled.nav`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  flex-flow: row nowrap;
  border-bottom: 1px solid #dee2e6;
  background-color: white;
  width: 100%;
  max-height: 50px;
`;

const Arrow = styled.div`
  transform: rotate(90deg);
  margin: 1px 0 0 6px;
`;

const Header = ({ user, sidebarOpened, onHamburgerClick, logout }) => {
  const onLogoutClick = () => {
    logout();
    Router.push('/login');
  };

  return(
    <Container>
      <HamburgerButton opened={sidebarOpened} onClick={onHamburgerClick}/>
      <div className="nav-right">
        <DropDown toggleItem={<Fragment>{ user ? user.name : 'User'}<Arrow><Icon name={'arrow'}/></Arrow></Fragment>}>
          <a href="#" className="dropdown-item d-flex align-items-center justify-content-between">
            Profile <Icon name={'user'} width={20} height={20}/>
          </a>
          <a className="dropdown-item d-flex align-items-center justify-content-between" href="#" onClick={onLogoutClick}>
            Logout <Icon name={'exit'} />
          </a>
        </DropDown>
      </div>
    </Container>
  );
};

Header.propTypes = {
  user: PropTypes.object,
  onHamburgerClick: PropTypes.func,
  sidebarOpened: PropTypes.bool,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);