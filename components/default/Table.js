import React, { useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Icon from './icons';
import { useTheme } from 'emotion-theming';

export const Table = styled.table`
  font-size: 12px;
  width: 100%;
  color: ${ props => props.theme.colors.table.color };
  border-collapse: collapse; 
  vertical-align: middle;
  td, th {
    text-align: start;
    padding: 0.75rem;
    border-top: 1px solid ${ props => props.theme.colors.table.border };
  }
  @media(min-width: 1400px) {
    font-size: 14px;
  }
`;

export const Thead = styled.thead`
  tr {
    background-color: ${ props => props.theme.colors.table.headerBackground };
    color: ${ props => props.theme.colors.table.headerColor };
    text-transform: uppercase;
    border: none;
    white-space: nowrap;
    th {
      font-weight: 300;
      border: none;
    }
  }
`;

export const Th = ({ order, children, onClick, ...props }) => {
  const theme = useTheme();

  const Th = styled.th`
    ${props};
    font-weight: 300;
    border: none;
    cursor: pointer;
    svg {
      transform: ${ props => props.order === 'asc' ? 'rotate(-90deg);': 'rotate(90deg);' };
      margin: 0 0 1px 4px;
    }
  `;

  const handle = () => {
    const newOrder = order === '' || order === 'desc' ? 'asc' : 'desc';
    onClick && onClick(children, newOrder);
  };

  return(
    <Th order={order} onClick={handle} {...props}>
      {children}
      {order && <Icon name={'arrow'} color={theme.colors.whiteGrey}/>}
    </Th>
  );
};

export const Filters = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const FilterBox = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.label`
  display: flex;
  margin: 0 5px 0 0;
  &:last-child {
    margin: 0 0 0 5px;
  }
`;

export const SearchFilter = props => {
  const [term, setTerm] = useState('');

  const onChange = e => {
    setTerm(e.target.value);
    props.onChange(e.target.value);
  };

  return (
    <FilterBox>
      <Label>Search:</Label>
      <input type={'text'} className={'form-control'} value={term} onChange={onChange}/>
    </FilterBox>
  );
};

const LIMIT_OPTIONS = [
  {value: 10, label: 10},
  {value: 25, label: 25},
  {value: 50, label: 50},
  {value: 100, label: 100},
];

const selectStyles = {
  container: (provided) => ({...provided, minWidth: '75px'}),
  menuPortal: base => ({ ...base, zIndex: 5 }),
};

export const LimitFilter = ({ defaultValue, onChange }) => <FilterBox>
  <Label>Show</Label>
  <Select components={{IndicatorSeparator: () => null}} options={LIMIT_OPTIONS}
    defaultValue={defaultValue ? LIMIT_OPTIONS.find(item => item.value === defaultValue) : LIMIT_OPTIONS[0]}
    onChange={onChange} styles={selectStyles} menuPortalTarget={document.body} menuPosition={'absolute'}
    menuPlacement={'bottom'}
  />
  <Label>entries</Label>
</FilterBox>;

const selectListFilterStyles = {
  container: (provided) => ({...provided, minWidth: '200px'})
};

export const ListFilter = ({ options, onChange, defaultValue, ...props }) => <FilterBox { ...props }>
  <Label>Show&nbsp;</Label>
  <Select components={{IndicatorSeparator: () => null}} options={options}
    defaultValue={defaultValue ? defaultValue : options[0]} onChange={onChange} styles={selectListFilterStyles}
    menuPortalTarget={document.body} menuPosition={'absolute'} menuPlacement={'bottom'}
  />
</FilterBox>;

ListFilter.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.any
};

Table.propTypes = {
  responsive: PropTypes.bool
};

LimitFilter.propTypes = {
  onChange:     PropTypes.func.isRequired,
  defaultValue: PropTypes.oneOf([10, 25, 50, 100])
};

SearchFilter.propTypes = {
  onChange: PropTypes.func.isRequired
};

Th.propTypes = {
  order:    PropTypes.oneOf(['asc', 'desc', '']),
  children: PropTypes.string,
  onClick:  PropTypes.func
};
