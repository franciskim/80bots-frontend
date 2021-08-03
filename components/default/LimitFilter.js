import React from 'react'
import PropTypes from 'prop-types'
import { Label } from 'reactstrap'
import Select from 'react-select'

const LIMIT_OPTIONS = [
  { value: 20, label: 20 },
  { value: 50, label: 50 },
  { value: 100, label: 100 },
  { value: 500, label: 500 },
]

export const LimitFilter = ({ defaultValue, onChange, instanceId }) => (
  <div
    id="datatable-basic_filter"
    className="dataTables_filter px-4 pb-1 float-left"
  >
    <Label style={{ display: 'inline-block' }}>Show</Label>
    <Select
      id={instanceId}
      instanceId={instanceId}
      inputId={instanceId}
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
        singleValue: (provided) => ({
          ...provided,
          color: '#fff',
        }),
      }}
    />
    entries
  </div>
)

LimitFilter.propTypes = {
  instanceId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.oneOf([20, 50, 100, 500]),
}
