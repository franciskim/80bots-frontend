import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import Item from "./Item";
import { CardBody } from "../Card";
import { Paginator } from "../Paginator";

const Row = styled.div`
  display: flex;
  flex-flow: row;
`;

const Col = styled.div`
  display: flex;
  flex-flow: column;
`;

const Content = styled(CardBody)`
  display: flex;
  flex-flow: column wrap;
  height: 77vh;
  ${props => props.styles};
`;

const ListWrapper = styled.div`
  display: flex;
  flex: 1;
  align-content: flex-start;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  ${props => props.styles};
`;

const PaginatorRow = styled(Row)`
  justify-content: flex-end;
`;

const List = ({
  items,
  total,
  limit,
  page,
  onPageChange,
  onItemClick,
  className
}) => {
  return (
    <Col className={className}>
      <Row>
        <Content>
          <ListWrapper>
            {items.map((item, i) => (
              <Item item={item} key={i} onClick={onItemClick} />
            ))}
          </ListWrapper>
        </Content>
      </Row>

      <PaginatorRow>
        <Col>
          <Paginator
            initialPage={page}
            total={total}
            pageSize={limit}
            onChangePage={page => onPageChange(page)}
          />
        </Col>
      </PaginatorRow>
    </Col>
  );
};

List.propTypes = {
  items: PropTypes.array.isRequired,
  total: PropTypes.number,
  limit: PropTypes.number,
  page: PropTypes.number,
  onLimitChange: PropTypes.func,
  onPageChange: PropTypes.func,
  onItemClick: PropTypes.func,
  className: PropTypes.string
};

export default List;
