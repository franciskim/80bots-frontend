import React from 'react'
import PropTypes from 'prop-types'

// const Wrapper = styled.div`
//   position: relative;
//   margin-bottom: 20px;
//   margin-right: 20px;
//   animation: ${Fade} 200ms ease-in-out;
//   cursor: pointer;
//   ${props => props.styles};
//   ${props =>
//     props.selected &&
// `;

// const Caption = styled.span`
//   position: absolute;
//   top: 50%;
//   left: 0;
//   width: 100%;
//   text-align: center;
//   color: white;
//   font-weight: bold;
// `;

export const TYPE = 'folder'

const Folder = ({ item, onClick = () => null }) => {
  const defaultThumbnail = '/images/thumbnails/folder.png'
  return (
    <div onClick={() => onClick(item)}>
      <img src={item.thumbnail || defaultThumbnail} width="320" alt="" />
      <span>{item.name}</span>
    </div>
  )
}

Folder.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func,
}

export default Folder
