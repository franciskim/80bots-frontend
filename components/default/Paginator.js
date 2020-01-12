import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Button } from '/components/default';

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 0 1 auto;
  justify-content: flex-end;
`;

const PaginationList = styled.ul`
  list-style: none; 
  border-radius: 4px;
  margin: 20px 20px;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ListItem = styled.li`
  padding: 5px 10px;
  background-color: ${ props => props.active ? props.theme.colors.primary : 'transparent' };
  color: ${ props => props.active ? props.theme.colors.white : props.theme.colors.primary };
  transition: all 100ms ease-in-out;
  &:hover {
    cursor: pointer;
    background-color: ${ props => !props.active && props.theme.colors.paleGrey };
  }
`;

export const Paginator = props => {
  const [total, setTotal] = useState(props.total || 0);
  const [currentPage, setCurrentPage] = useState(props.initialPage || 1);
  const [pageSize, setPageSize] = useState(props.pageSize || 10);
  const [pages, setPages] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [diapasonAndIndexes, setDiapasonAndIndexes] = useState({
    startPage: null,
    endPage: null,
    startIndex: null,
    endIndex: null,
  });
  const [jumpPage, setJumpPage] = useState(props.jumpPage || 0);

  const setPaginator = page => {
    const totalPages = Math.ceil(total / pageSize);
    let startPage, endPage;
    if (totalPages <= 10) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (page <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (page + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = page - 5;
        endPage = page + 4;
      }
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, total - 1);
    const pages = [...Array((endPage + 1) - startPage).keys()]
      .map(i => startPage + i);

    setTotalItems(total);
    setCurrentPage(page);
    setTotalPages(totalPages);
    setDiapasonAndIndexes({
      startPage,
      endPage,
      startIndex,
      endIndex,
    });
    setPages(pages);
  };

  useEffect(() => {
    setPaginator(1);
  }, []);

  useEffect(() => {
    if(props.initialPage && props.initialPage !== currentPage) setPaginator(props.initialPage);
  }, [props.initialPage]);

  useEffect(() => {
    if(total !== props.total) {
      setTotal(props.total);
    }
    if(pageSize !== props.pageSize) {
      setPageSize(props.pageSize);
    }
    setPaginator(currentPage);
  }, [props.total, total, props.pageSize, pageSize]);

  const setPage = page => {
    const { total, onChangePage } = props;
    if (page < 1 || page > Math.ceil(total / pageSize)) {
      return;
    }
    setPaginator(page);
    onChangePage(page);
  };

  if (total <= pageSize) {
    return null;
  }

  const pageJumpStyle = {
    'text-align': 'center'
  };


  return(
    <PaginationContainer>
      <PaginationList>
        <ListItem onClick={() => setPage(1)}>&laquo;</ListItem>
        <ListItem onClick={() => setPage(currentPage - 1)}>
          &lsaquo;
        </ListItem>
        {pages.map((page, index) =>
          <ListItem active={page === currentPage} key={index} onClick={() => setPage(page)}>
            {page}
          </ListItem>
        )}
        <ListItem onClick={() => setPage(currentPage + 1)}>
          &rsaquo;
        </ListItem>
        <ListItem onClick={() => setPage(Math.ceil(total / pageSize))}>
              &raquo;
        </ListItem>
      &nbsp;Page&nbsp;<input type={'text'} style={pageJumpStyle} size={'3'} onChange={event => setJumpPage(event.target.value)}
          placeholder={currentPage} />&nbsp;of {totalPages}&nbsp;<Button type={'primary'} onClick={() => setPage(parseInt(jumpPage))}>Go</Button>
      </PaginationList>
    </PaginationContainer>
  );
};

Paginator.propTypes = {
  total: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  initialPage: PropTypes.number,
  pageSize: PropTypes.number,
  jumpPage: PropTypes.number
};

export default Paginator;
