import React, {useState} from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Select from 'react-select';

export const Table = styled.table`
  font-size: 11px;
  width: 100%;
  color: #212529;
  border-collapse: collapse;
  vertical-align: middle;
  td, th {
    text-align: start;
    padding: 0.75rem;
    border-top: 1px solid #dee2e6;
  }
`;

Table.propTypes = {
    responsive: PropTypes.bool
};

export const Thead = styled.thead`
  tr {
    background-color: #e8e9ef;
    color: #868e96;
    text-transform: uppercase;
    border: none;
    th {
      font-weight: 300;
      border: none;
    }
  }
`;

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

SearchFilter.propTypes = {
    onChange: PropTypes.func.isRequired
};

const LIMIT_OPTIONS = [
    {value: 10, label: 10},
    {value: 25, label: 25},
    {value: 50, label: 50},
    {value: 100, label: 100},
];

const selectStyles = {
    container: (provided) => ({...provided, minWidth: '75px'})
};

export const LimitFilter = ({onChange}) => <FilterBox>
    <Label>Show</Label>
    <Select components={{IndicatorSeparator: () => null}} options={LIMIT_OPTIONS}
            defaultValue={LIMIT_OPTIONS[0]} onChange={onChange} styles={selectStyles}
    />
    <Label>entries</Label>
</FilterBox>;

LimitFilter.propTypes = {
    onChange: PropTypes.func.isRequired
};

const selectListFilterStyles = {
    container: (provided) => ({...provided, minWidth: '200px'})
};

export const ListFilter = ({options, onChange}) => <FilterBox>
    <Label>Show</Label>
    <Select components={{IndicatorSeparator: () => null}} options={options}
            defaultValue={options[0]} onChange={onChange} styles={selectListFilterStyles}
    />
</FilterBox>;

ListFilter.propTypes = {
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
};
