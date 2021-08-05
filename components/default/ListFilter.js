import React from 'react'
import PropTypes from 'prop-types'
import { Label } from 'reactstrap'
import Select from 'react-select'

export const ListFilter = ({
  options,
  value,
  label,
  onChange,
  defaultValue,
}) => (
  <div id="datatable-basic_filter" className="dataTables_filter px-4 pb-1">
    <Label>{label || 'Show'}&nbsp;</Label>
    <Select
      components={{ IndicatorSeparator: () => null }}
      options={options}
      defaultValue={defaultValue ? defaultValue : options[0]}
      onChange={onChange}
      width={'200px'}
      value={value}
      styles={{
        container: (provided, state) => ({
          ...provided,
          width: state.selectProps.width,
          minWidth: '120px',
          display: 'inline-block',
          margin: '0 10px',
        }),
        input: () => ({
          '& input': {
            font: 'inherit',
          },
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
