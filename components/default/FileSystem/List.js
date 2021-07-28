import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import Item from './Item'
import { CardBody, CardFooter, Card, Button } from 'reactstrap'
import { Paginator } from '../Paginator'
import Toggle from 'react-toggle'

const Row = styled.div`
  display: flex;
  flex-flow: row;
`

// const ListWrapper = styled.div`
//   display: flex;
//   flex: 1;
//   align-content: flex-start;
//   flex-flow: row wrap;
//   justify-content: flex-start;
//   align-items: center;
//   ${(props) => props.styles};
// `
// const WrapperButton = styled.div`
//   margin-left: 20px;
//   display: flex;
//   padding-bottom: 1.25rem;
// `

const List = ({
  items,
  total,
  limit,
  page,
  onPageChange,
  onItemClick,
  className,
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
    <Card>
      <CardBody>
        {items[0].type === 'file' ? (
          <div>
            <Toggle
              defaultChecked={filter}
              className="custom-classname"
              onChange={filterItems}
              icons={{
                checked: 'I',
                unchecked: 'O',
              }}
            />
            <span>Filter Blank</span>
          </div>
        ) : null}
        <div>
          {getFiles.map((item, i) => (
            <Item item={item} key={i} onClick={onItemClick} />
          ))}
        </div>
      </CardBody>

      <CardFooter>
        <Paginator
          initialPage={page}
          total={total}
          pageSize={limit}
          onChangePage={(page) => onPageChange(page)}
        />
      </CardFooter>
    </Card>
  )
}

List.propTypes = {
  items: PropTypes.array.isRequired,
  filterItems: PropTypes.array.isRequired,
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
