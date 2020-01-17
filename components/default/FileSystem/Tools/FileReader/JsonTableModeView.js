import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import {
  Table as BaseTable,
  Thead,
  Filters,
  LimitFilter,
  SearchFilter,
  ListFilter
} from "/components/default/Table";
import { Paginator } from "/components/default/Paginator";

const Table = styled(BaseTable)`
  min-width: 100%;
  max-height: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  min-height: 100%;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  margin-bottom: 15px;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

const Footer = styled.footer`
  display: flex;
  text-align: right;
  justify-content: flex-end;
`;

const LinkTd = styled.td`
  cursor: pointer;
  color: ${props => props.theme.colors.primary};
  &:hover {
    color: ${props => props.theme.colors.cyan};
  }
`;

const JsonTableModeView = ({ output }) => {
  const [data, setData] = useState(output || []);
  const [slicedChunk, setSlicedChunk] = useState(output || []);
  const [deepViewing, setDeepViewing] = useState(false);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(output.length);
  const [limit, setLimit] = useState(10);

  const viewNestedData = data => {
    setDeepViewing(true);
    setData(data);
  };

  useEffect(() => {
    if (!deepViewing) {
      setData(output);
    }
  }, [deepViewing, output]);

  useEffect(() => {
    if (data && data.length) {
      setSlicedChunk(data.slice(page * limit - limit, page * limit));
    }
  }, [data]);

  useEffect(() => {
    setSlicedChunk(output.slice(page * limit - limit, page * limit));
  }, [page, limit]);

  const getHeader = row => {
    let columns = [];
    for (let key in row) {
      if (row.hasOwnProperty(key)) {
        columns.push(<th key={key}>{key}</th>);
      }
    }
    return columns;
  };

  const renderRow = (row, idx) => {
    let rowData = [];
    let rowIdx = 0;
    for (let key in row) {
      if (row.hasOwnProperty(key)) {
        if (typeof row[key] !== "object") {
          rowData.push(<td key={rowIdx}>{row[key]}</td>);
        } else {
          if (row[key] && row[key].length) {
            rowData.push(
              <LinkTd
                onClick={() => viewNestedData(row[key])}
                key={rowIdx}
              >{`See ${key}`}</LinkTd>
            );
          } else {
            rowData.push(<td key={rowIdx}>{`No ${key}`}</td>);
          }
        }
      }
      rowIdx++;
    }
    return <tr key={idx}>{rowData}</tr>;
  };

  return (
    <Wrapper>
      <Header>
        <LimitFilter
          defaultValue={limit}
          onChange={({ value }) => setLimit(value)}
        />
      </Header>
      <Content>
        <Table>
          {slicedChunk[0] && (
            <Thead>
              <tr>{getHeader(slicedChunk[0])}</tr>
            </Thead>
          )}
          <tbody>{slicedChunk.map(renderRow)}</tbody>
        </Table>
      </Content>
      <Footer>
        <Paginator
          initialPage={page}
          total={total}
          pageSize={limit}
          onChangePage={page => setPage(page)}
        />
      </Footer>
    </Wrapper>
  );
};

JsonTableModeView.propTypes = {
  output: PropTypes.array.isRequired
};

export default JsonTableModeView;
