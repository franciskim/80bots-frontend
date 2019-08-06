import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { SIDEBAR_ANIMATION_TIME } from 'config';

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

const A = styled.a`
  display: block;
  padding: 0.625rem 1.5rem 0.625rem 2.75rem;
  font-weight: 400;
  text-decoration: none;
  color: ${ props => props.theme.colors.blue };
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
    text-decoration: none;
  }
`;

const Sidebar = ({ opened = false }) => {
  return(
    <Container opened={opened}>
      <LinkWrap>
        <Link href={'/'}>
          <img src="/static/images/80bots.svg" alt=""/>
        </Link>
      </LinkWrap>
      <Ul>
        <Li>
          <Link href={'/'}>
            <A href="#"> My Bots </A>
          </Link>
        </Li>
        <Li>
          <Link href={'/'}>
            <A href="#"> Bots List </A>
          </Link>
        </Li>
        <Li>
          <Link href={'/'}>
            <A href="#"> Scheduling List </A>
          </Link>
        </Li>
        <Li>
          <Link href={'/'}>
            <A href="#"> My Subscription </A>
          </Link>
        </Li>
      </Ul>
      <Hr/>
    </Container>
  );
};

Sidebar.propTypes = {
  opened: PropTypes.bool
};

export default Sidebar;