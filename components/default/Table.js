import React, { useState } from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import Select from 'react-select'
import Icon from './icons'
import { Label } from 'reactstrap'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'

const { SearchBar } = Search

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
      {order && <Icon name={'arrow'} />}
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

export const SearchFilter = (props) => {
  // const [term, setTerm] = useState('')
  // const onChange = (e) => {
  //   setTerm(e.target.value)
  //   props.onChange(e.target.value)
  // }

  return (
    <>
      <div
        id="datatable-basic_filter"
        className="dataTables_filter px-4 pb-1 float-right"
      >
        <label>
          Search:
          <SearchBar
            className="form-control-sm"
            placeholder=""
            {...props.searchProps}
          />
        </label>
      </div>
    </>
  )
}
SearchFilter.propTypes = {
  searchProps: PropTypes.object.isRequired,
}

const LIMIT_OPTIONS = [
  { value: 20, label: 20 },
  { value: 50, label: 50 },
  { value: 100, label: 100 },
  { value: 500, label: 500 },
]

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

export const LimitFilter = ({ defaultValue, onChange, ...props }) => (
  <div
    id="datatable-basic_filter"
    className="dataTables_filter px-4 pb-1 float-left"
  >
    <Label style={{ display: 'inline-block' }}>Show</Label>
    <Select
      id={props.id}
      instanceId={props.instanceId}
      inputId={props.instanceId}
      components={{ IndicatorSeparator: () => null }}
      options={LIMIT_OPTIONS}
      defaultValue={
        defaultValue
          ? LIMIT_OPTIONS.find((item) => item.value === defaultValue)
          : LIMIT_OPTIONS[0]
      }
      onChange={onChange}
      styles={{
        container: (provided, state) => ({
          ...provided,
          width: state.selectProps.width,
          minWidth: '120px',
          display: 'inline-block',
          margin: '0 10px',
        }),
        menuPortal: (base) => ({ ...base, zIndex: 5 }),
        singleValue: (provided, state) => ({
          ...provided,
          color: '#fff',
        }),
      }}
      // menuPortalTarget={document.body}
      // menuPosition={"absolute"}
      // menuPlacement={"bottom"}
    />
    entries
  </div>
)

export const ListFilter = ({
  options,
  value,
  label,
  onChange,
  defaultValue,
  ...props
}) => (
  <div id="datatable-basic_filter" className="dataTables_filter px-4 pb-1">
    <Label>{label || 'Show'}&nbsp;</Label>
    <Select
      id={props.id}
      instanceId={props.instanceId}
      inputId={props.instanceId}
      components={{ IndicatorSeparator: () => null }}
      options={options}
      defaultValue={defaultValue ? defaultValue : options[0]}
      onChange={onChange}
      width={'200px'}
      // menuPortalTarget={document.body}
      // menuPosition={"absolute"}
      // menuPlacement={"bottom"}
      value={value}
      styles={{
        container: (provided, state) => ({
          ...provided,
          width: state.selectProps.width,
          minWidth: '120px',
          display: 'inline-block',
          margin: '0 10px',
        }),
        menuPortal: (base) => ({ ...base, zIndex: 5 }),
        singleValue: (provided, state) => ({
          ...provided,
          color: '#fff',
        }),
      }}
    />
  </div>
)

ListFilter.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.any,
  value: PropTypes.any,
  label: PropTypes.string,
}

// Table.propTypes = {
//   responsive: PropTypes.bool,
// }

LimitFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.oneOf([10, 25, 50, 100]),
}

Th.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc', '']),
  children: PropTypes.string,
  field: PropTypes.string,
  onClick: PropTypes.func,
}
