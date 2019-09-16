import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Link from 'next/link';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { SIDEBAR_ANIMATION_TIME, ROUTES } from 'config';

const Container = styled.div`
  min-width: 250px;
  max-width: 250px;
  background-color: ${ props => props.theme.colors.whiteGrey };
  transition: margin-left ${SIDEBAR_ANIMATION_TIME}ms ease-out;
  ${props => !props.opened ? css`margin-left: -250px` : ''};
`;

const LinkWrap = styled.div`
  padding: 1rem 1.5rem;
`;

const Ul = styled.ul`
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
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const linkHoverStyle = css`
  background-color: rgba(0, 0, 0, 0.2);
  text-decoration: none;
`;

const A = styled.a`
  display: block;
  padding: 0.625rem 1.5rem 0.625rem 2.75rem;
  font-weight: 400;
  text-decoration: none;
  color: ${ props => props.theme.colors.blue };
  &:hover {
    ${linkHoverStyle};
  }
  ${props => props.active && linkHoverStyle};
`;

const Sidebar = ({ opened = false, userRole }) => {
  const renderLink = (link, idx) => <Li key={idx}>
    <Link href={ link.href }>
      <A href="#" active={link.href === Router.router.route}>{ link.name }</A>
    </Link>
  </Li>;

  return(
    <Container opened={opened}>
      <LinkWrap>
        <Link href={'/'}>
          <img src="/static/images/80bots.svg" alt=""/>
        </Link>
      </LinkWrap>
      <Ul>
        { userRole && ROUTES[userRole].map(renderLink) }
      </Ul>
      <Hr/>
    </Container>
  );
};

Sidebar.propTypes = {
  opened: PropTypes.bool,
  userRole: PropTypes.oneOf(['User', 'Admin'])
};

export default Sidebar;
