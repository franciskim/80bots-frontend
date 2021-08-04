import React from 'react'
import PropTypes from 'prop-types'
import Item from './Item'
import { Col, Row, Label, FormGroup } from 'reactstrap'
import { Paginator } from '../Paginator'

const List = ({
  items,
  total,
  limit,
  page,
  onPageChange,
  onItemClick,
  filterItems,
  filter,
}) => {
  let getFiles = filter
    ? items.filter(
        (item) =>
          item.name.split(' ')[0] !== 'black_screenshot' &&
          item.name.split(' ')[0] !== 'blank_screenshot'
      )
    : items

  return (
    <>
      {items[0].type === 'file' && (
        <FormGroup className="row">
          <Col>
            <Label className="mr-2">Filter Blank</Label>
            <label className="custom-toggle custom-toggle-info mr-1">
              <input
                type="checkbox"
                defaultChecked={filter}
                onChange={filterItems}
              />
              <span
                className="custom-toggle-slider rounded-circle"
                data-label-off="No"
                data-label-on="Yes"
              />
            </label>
          </Col>
        </FormGroup>
      )}
      <Row>
        {getFiles.map((item, i) => (
          <Item item={item} key={i} onClick={onItemClick} />
        ))}
      </Row>

      <Paginator
        initialPage={page}
        total={total}
        pageSize={limit}
        onChangePage={(page) => onPageChange(page)}
      />
    </>
  )
}

List.propTypes = {
  items: PropTypes.array.isRequired,
  filterItems: PropTypes.func.isRequired,
  total: PropTypes.number,
  limit: PropTypes.number,
  page: PropTypes.number,
  onLimitChange: PropTypes.func,
  onPageChange: PropTypes.func,
  onItemClick: PropTypes.func,
  className: PropTypes.string,
  filter: PropTypes.bool,
}

export default List
