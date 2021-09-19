import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Th = styled.th`
  cursor: pointer;
  svg {
    transform: ${(props) =>
      props.order === 'asc' ? 'rotate(-90deg);' : 'rotate(90deg);'};
    margin: 0 0 1px 4px;
  }
`

export const TableHeader = ({ order, field, children, onClick, ...props }) => {
  const handle = () => {
    const newOrder = order === '' || order === 'desc' ? 'asc' : 'desc'
    onClick && onClick(field || children, newOrder)
  }

  return (
    <Th
      scope="col"
      data-sort={field}
      className="sort"
      order={order}
      onClick={handle}
      {...props}
    >
      {children}
      {order && <i className={'arrow'} />}
    </Th>
  )
}

TableHeader.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc', '']),
  children: PropTypes.string,
  field: PropTypes.string,
  onClick: PropTypes.func,
}
