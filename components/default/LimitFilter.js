import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Label } from 'reactstrap'
import Select from 'react-select'
import Skeleton from 'react-loading-skeleton'

export const LimitFilter = ({ defaultValue, onChange, total, loading }) => {
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
      <Label>Show</Label>
      <Select
        options={LIMIT_OPTIONS}
        value={LIMIT_OPTIONS.find((o) => o.value === pageSize)}
        onChange={handlePageSizeChange}
        styles={{
          container: (provided, state) => ({
            ...provided,
            width: state.selectProps.width,
            minWidth: '80px',
            display: 'inline-block',
            margin: '0 10px',
            fontSize: '14px',
          }),
        }}
      />
      entries. {!loading && <>Showing rows 1 to 10 of {total}</>}
      {loading && <Skeleton style={{ width: 120 }} />}
    </div>
  )
}

LimitFilter.propTypes = {
  total: PropTypes.number,
  loading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.oneOf([20, 50, 100, 500]),
}

LimitFilter.defaultProps = {
  total: 0,
  loading: false,
}
