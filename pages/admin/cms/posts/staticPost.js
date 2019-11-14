import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

const Page = styled.div`
    ${props =>
      props.standalonePage &&
        css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: 60px 20px;
            background-color: #f5f9fc;
            min-height: 100vh;
            .page-container {
              width: 100%;
              max-width: 720px;
            }
            .page-content {
              background-color: #fff;
              padding: 1rem;
              box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
              border-radius: 0.25rem;
            }
        `};
    .page-content {
      text-align: left;
      img {
          max-width: 100%;
          height: auto;
      }
      p {
          &:last-child {
              margin-bottom: 0;
          }
      }
    }
`;

const CustomStyles = styled.div`
  ${props => props.customStyle};
`;

const StaticPage = ({ standalonePage = true, title, content, style, scripts }) => {
  document.title = title;
  return (
    <CustomStyles customStyle={style}>
      <Page className='page' standalonePage={standalonePage}>
        <div className='page-container'>
          <div className='page-content' dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
      </Page>
    </CustomStyles>
  );
};

StaticPage.propTypes = {
  standalonePage: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.string,
  style: PropTypes.string,
  scripts: PropTypes.string,
};

export default StaticPage;
