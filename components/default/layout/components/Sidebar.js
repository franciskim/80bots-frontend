import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import Router from "next/router";
import PropTypes from "prop-types";
import Feedback from "/components/default/Feedback";
import { css } from "@emotion/core";
import { SIDEBAR_ANIMATION_TIME, ROUTES } from "/config";

const Container = styled.div`
  flex-direction: column;
  min-width: 250px;
  max-width: 250px;
  background-color: ${props => props.theme.colors.darkerGrey};
  transition: margin-left ${SIDEBAR_ANIMATION_TIME}ms ease-out;
  ${props =>
    !props.opened
      ? css`
          margin-left: -250px;
        `
      : ""};
`;

const LinkWrap = styled.div`
  padding: 1rem 1.5rem;
  cursor: pointer;
`;

const Ul = styled.ul`
  flex-direction: column;
  padding: 0;
  list-style: none;
  margin: 0 0 1rem 0;
`;

const Li = styled.li`
  font-size: 12px;
`;

const Hr = styled.hr`
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 0;
  min-height: 1px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const linkHoverStyle = css`
  color: ${props => props.theme.colors.cyan} !important;
  text-decoration: underline;
`;

const A = styled.a`
  display: block;
  padding: 0.625rem 1.5rem 0.625rem 2.75rem;
  font-weight: 400;
  text-decoration: none;
  color: #ffffff;
  &:hover {
    ${linkHoverStyle};
    color: ${props => props.theme.colors.cyan};
  }
  ${props => props.active && linkHoverStyle};
`;

const Bottom = styled.div`
  padding: 0 2.75rem;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

const Sidebar = ({ opened = false, userRole }) => {
  const renderLink = (link, idx) => (
    <Li key={idx}>
      <Link href={link.href}>
        <A href="#" active={link.href === Router.router.route}>
          {link.name}
        </A>
      </Link>
    </Li>
  );

  return (
    <Container opened={opened}>
      <LinkWrap>
        <Link href={"/dashboard"}>
          <img src="/images/80bots-logo.svg" alt="" />
        </Link>
      </LinkWrap>
      <Ul>{userRole && ROUTES[userRole].map(renderLink)}</Ul>
      <Bottom>
        <Feedback />
      </Bottom>
    </Container>
  );
};

Sidebar.propTypes = {
  opened: PropTypes.bool,
  userRole: PropTypes.oneOf(["User", "Admin"])
};

export default Sidebar;
