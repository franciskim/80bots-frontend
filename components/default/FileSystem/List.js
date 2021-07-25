import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import Item from './Item'
import { CardBody } from '../Card'
import { Paginator } from '../Paginator'
import { Button } from '../Button'
import Toggle from 'react-toggle'

const Row = styled.div`
  display: flex;
  flex-flow: row;
`

const Col = styled.div`
  display: flex;
  flex-flow: column;
`

const Content = styled(CardBody)`
  display: flex;
  flex-flow: column wrap;
  height: 77vh;
  ${(props) => props.styles};
`

const ListWrapper = styled.div`
  display: flex;
  flex: 1;
  align-content: flex-start;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  ${(props) => props.styles};
`

const PaginatorRow = styled(Row)`
  justify-content: flex-end;
`

const FilterButton = styled(Button)`
  padding: 0 5px;
`

const WrapperButton = styled.div`
  margin-left: 20px;
  display: flex;
  padding-bottom: 1.25rem;
`

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
    <Col className={className}>
      <Row>
        <Content>
          <Col>
            {items[0].type === 'file' ? (
              <WrapperButton>
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
              </WrapperButton>
            ) : null}
            <ListWrapper>
              {getFiles.map((item, i) => (
                <Item item={item} key={i} onClick={onItemClick} />
              ))}
            </ListWrapper>
          </Col>
        </Content>
      </Row>

      <PaginatorRow>
        <Col>
          <Paginator
            initialPage={page}
            total={total}
            pageSize={limit}
            onChangePage={(page) => onPageChange(page)}
          />
        </Col>
      </PaginatorRow>
    </Col>
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
