import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Label } from 'reactstrap'
import Select from 'react-select'

export const LimitFilter = ({ defaultValue, onChange, total }) => {
  const LIMIT_OPTIONS = [
    { value: 20, label: 20 },
    { value: 50, label: 50 },
    { value: 100, label: 100 },
    { value: 500, label: 500 },
  ]
  const [pageSize, setPageSize] = useState(defaultValue)

  const handlePageSizeChange = ({ value }) => {
    setPageSize(value)
    onChange(value)
  }

  return (
    <div
      id="datatable-basic_filter"
      className="dataTables_filter px-4 pb-1 float-left"
    >
      <Label style={{ display: 'inline-block' }}>Show</Label>
      <Select
        options={LIMIT_OPTIONS}
        value={LIMIT_OPTIONS.find((o) => o.value === pageSize)}
        onChange={handlePageSizeChange}
        styles={{
          container: (provided, state) => ({
            ...provided,
            width: state.selectProps.width,
            minWidth: '120px',
            display: 'inline-block',
            margin: '0 10px',
          }),
        }}
      />
      entries. Showing rows 1 to 10 of {total}
    </div>
  )
}

LimitFilter.propTypes = {
  total: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.oneOf([20, 50, 100, 500]),
}

LimitFilter.defaultProps = {
  total: 0,
}
