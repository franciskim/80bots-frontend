import React from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Icon from "../../icons";
import "bootstrap/dist/css/bootstrap.min.css";
import DropDown from "/components/default/DropDown";
import HamburgerButton from "../../HamburgerButton";
import { logout } from "/store/auth/actions";
import Router from "next/router";
import Link from "next/link";

const Container = styled.nav`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  flex-flow: row nowrap;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  max-height: 50px;
`;

const Arrow = styled.div`
  transform: rotate(90deg);
  margin: 1px 0 0 6px;
  color: #ffffff;
`;

const User = styled.div`
  display: inline-flex;
  margin: 0 5px 0 0;
`;

const UserName = styled.span`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #fff;
`;

const Header = ({ user, sidebarOpened, onHamburgerClick, logout }) => {
  const onLogoutClick = () => {
    logout();
    Router.push("/");
  };

  return (
    <Container>
      <HamburgerButton opened={sidebarOpened} onClick={onHamburgerClick} />
      <div className="nav-right">
        <DropDown
          side="right"
          toggleItem={
            <UserName>
              {user ? user.name : "User"}
              <Arrow>
                <Icon name={"arrow"} color={"white"} />
              </Arrow>
            </UserName>
          }
        >
          <Link href={"/profile"}>
            <a
              href="#"
              className="dropdown-item d-flex align-items-center justify-content-between"
            >
              Profile <Icon name={"user"} width={20} height={20} />
            </a>
          </Link>
          <a
            className="dropdown-item d-flex align-items-center justify-content-between"
            href="#"
            onClick={onLogoutClick}
          >
            Logout <Icon name={"exit"} />
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
