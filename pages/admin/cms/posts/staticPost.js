import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const CustomStyles = styled.div`
  ${props => props.customStyle};
`;

const StaticPage = ({ title, content, style }) => {
  document.title = title;
  return (
    <CustomStyles customStyle={style}>
      <div className='page'>
        <div className='page-container'>
          <div className='page-content' dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
      </div>
    </CustomStyles>
  );
};

StaticPage.propTypes = {
  standalonePage: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.string,
  style: PropTypes.string,
};

export default StaticPage;
