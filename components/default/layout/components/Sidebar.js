import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import Router from "next/router";
import PropTypes from "prop-types";
import { css } from "@emotion/core";
import { SIDEBAR_ANIMATION_TIME, ROUTES } from "/config";

const sidebarWidth = "225";

const Container = styled.div`
  flex-direction: column;
  min-width: ${sidebarWidth}px;
  max-width: ${sidebarWidth}px;
  background-color: ${props => props.theme.colors.darkerGrey};
  transition: margin-left ${SIDEBAR_ANIMATION_TIME}ms ease-out;
  ${props =>
    !props.opened
      ? css`
          margin-left: ${sidebarWidth * -1}px;
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

const linkHoverStyle = (props) => css`
  color: ${props.theme.colors.cyan} !important;
  text-decoration: underline;
`;

const A = styled.a`
  cursor: pointer;
  display: block;
  padding: 0.625rem 1.5rem 0.625rem 1.5rem;
  font-weight: 400;
  text-decoration: none;
  color: #ffffff;
  &:hover {
    ${linkHoverStyle};
    color: ${props => props.theme.colors.cyan};
  }
  &.active {
    cursor: pointer;
    color: ${props => props.theme.colors.pink};
  }
`;

const Bottom = styled.div`
  padding: 0 2.75rem;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

const Sidebar = ({ opened = false }) => {
  const renderLink = (link, idx) => (
    <Li key={idx}>
      <Link href={link.href}>
        <A
          href='#'
          active={link.href === Router.router.route}
          className={
            link.href === Router.router.route ? "active" : "not-active"
          }
        >
          {link.name}
        </A>
      </Link>
    </Li>
  );

  return (
    <Container opened={opened}>
      <LinkWrap>
        <Link href={"/"}>
          <a
            href="/dashboard/"
            className="sidebar-brand text-decoration-none"
            style={{
              display: "inline-block",
              position: "relative",
              zIndex: "-1",
              width: "100%",
              height: "25px",
              textAlign: "left",
              marginBottom: "8px"
            }}
          >
            <span
              className={"pewpew"}
              style={{
                display: "inline-block",
                width: "100px",
                height: "25px"
              }}
            >
              <object
                type="image/svg+xml"
                data="/images/80bots-logo.svg"
                className={"logo"}
                style={{
                  position: "relative",
                  zIndex: "-1",
                  width: "100px",
                  height: "25px"
                }}
              />
            </span>
          </a>
        </Link>
      </LinkWrap>
      <Ul>{ROUTES.map(renderLink)}</Ul>
    </Container>
  );
};

Sidebar.propTypes = {
  opened: PropTypes.bool,
};

export default Sidebar;
