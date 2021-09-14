import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { /*ToolkitProvider,*/ Search } from 'react-bootstrap-table2-toolkit'
import { Label } from 'reactstrap'

const { SearchBar } = Search

export const SearchFilter = ({ onChange }) => {
  const [keyword, setKeywoard] = useState('')

  const handleChange = (value) => {
    setKeywoard(value)
    onChange(value)
  }
  return (
    <>
      <div
        id="datatable-basic_filter"
        className="dataTables_filter px-4 pb-1 float-right"
      >
        <Label htmlFor="table-search">Search:</Label>
        <SearchBar
          id="table-search"
          className="form-control-sm"
          onSearch={handleChange}
          searchText={keyword}
        />
      </div>
    </>
  )
}

SearchFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
}
