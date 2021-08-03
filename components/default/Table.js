import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { Label } from 'reactstrap'

// export const Table = styled.table`
//   font-size: 12px;
//   width: 100%;
//   background: #333;
//   border-collapse: collapse;
//   vertical-align: middle;

//   td,
//   th {
//     text-align: start;
//     padding: 0.75rem;
//   }

//   td.td-controls {
//     white-space: nowrap;

//     svg {
//       max-width: 100%;
//       height: auto;
//     }
//   }

//   @media (min-width: 1400px) {
//     font-size: 14px;
//   }
// `

// export const Thead = styled.thead`
//   tr {
//     text-transform: uppercase;
//     border: none;
//     white-space: nowrap;

//     th {
//       font-weight: 300;
//       border: none;
//     }
//   }
// `

export const Th = ({ order, field, children, onClick, ...props }) => {
  const Th = styled.th`
    font-weight: 300;
    border: none;
    cursor: pointer;
    svg {
      transform: ${(props) =>
        props.order === 'asc' ? 'rotate(-90deg);' : 'rotate(90deg);'};
      margin: 0 0 1px 4px;
    }
  `

  const handle = () => {
    const newOrder = order === '' || order === 'desc' ? 'asc' : 'desc'
    onClick && onClick(field || children, newOrder)
  }

  return (
    <Th order={order} onClick={handle} {...props}>
      {children}
      {/* {order && <Icon name={'arrow'} />} */}
    </Th>
  )
}

// export const Filters = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
//   margin-bottom: 10px;
// `

// const FilterBox = styled.div`
//   display: flex;
//   align-items: center;
// `

// const Label = styled.label`
//   display: flex;
//   margin: 0 5px 0 0;

//   &:last-child {
//     margin: 0 0 0 5px;
//   }
// `

// const selectStyles = {
//     control: (provided, {selectProps: {width}}) => ({
//         ...provided,
//         width: width,
//         minWidth: "75px",
//         border: "solid 1px hsl(0,0%,80%)",
//         borderRadius: "4px",
//         color: "#fff",
//         backgroundColor: "transparent",
//         "&:hover": {
//             borderColor: "#7dffff"
//         }
//     }),
//     singleValue: (provided, state) => ({
//         ...provided,
//         color: "#fff"
//     }),
//     menu: (provided, state) => ({
//         ...provided,
//         border: "solid 1px hsl(0,0%,80%)",
//         borderRadius: "4px",
//     }),
//     menuList: (provided, state) => ({
//         ...provided,
//         backgroundColor: "#333",
//     }),
//     option: (provided, state) => ({
//         ...provided,
//         color: state.isFocused ? "black" : "#fff",
//     }),
// };

// Table.propTypes = {
//   responsive: PropTypes.bool,
// }

Th.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc', '']),
  children: PropTypes.string,
  field: PropTypes.string,
  onClick: PropTypes.func,
}
