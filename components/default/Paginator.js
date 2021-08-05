import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { PaginationLink, PaginationItem, Pagination } from 'reactstrap'

const MaximumShownPages = 10

export const Paginator = ({ total, initialPage, pageSize, onChangePage }) => {
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    setPaginator(1)
  }, [])

  useEffect(() => {
    if (initialPage && initialPage !== currentPage) {
      setPaginator(initialPage)
    }
  }, [initialPage])

  const setPaginator = (page) => {
    const totalPages = Math.ceil(total / pageSize)
    let startPage, endPage
    if (totalPages <= MaximumShownPages) {
      startPage = 1
      endPage = totalPages
    } else {
      if (page <= MaximumShownPages / 2 + 1) {
        startPage = 1
        endPage = MaximumShownPages
      } else if (page + 4 >= totalPages) {
        startPage = totalPages - MaximumShownPages + 1
        endPage = totalPages
      } else {
        startPage = page - MaximumShownPages / 2
        endPage = page + MaximumShownPages / 2 - 1
      }
    }

    setCurrentPage(page)
    setTotalPages(totalPages)

    setPages(
      [...Array(endPage + 1 - startPage).keys()].map((i) => startPage + i)
    )
  }

  useEffect(() => {
    setPaginator(currentPage)
  }, [total, pageSize])

  const setPage = (page) => {
    if (page < 1 || page > Math.ceil(total / pageSize)) {
      return
    }
    setPaginator(page)
    onChangePage(page)
  }

  if (total <= pageSize) {
    return null
  }
  return (
    <Pagination
      className="pagination justify-content-end mb-0"
      listClassName="justify-content-end mb-0"
    >
      <PaginationItem className={currentPage === 1 ? 'disabled' : ''}>
        <PaginationLink href="#pablo" onClick={() => setPage(1)} tabIndex="-1">
          <i className="fas fa-angle-double-left" />
        </PaginationLink>
      </PaginationItem>
      <PaginationItem className={currentPage === 1 ? 'disabled' : ''}>
        <PaginationLink
          href="#pablo"
          onClick={() => setPage(currentPage - 1)}
          tabIndex="-1"
        >
          <i className="fas fa-angle-left" />
        </PaginationLink>
      </PaginationItem>

      {pages.map((page) => (
        <PaginationItem
          key={`page-${page}`}
          className={page === currentPage ? 'active' : ''}
          onClick={() => setPage(page)}
        >
          <PaginationLink href="#pablo" onClick={(e) => e.preventDefault()}>
            {page} <span className="sr-only">(current)</span>
          </PaginationLink>
        </PaginationItem>
      ))}

      <PaginationItem className={currentPage === totalPages ? 'disabled' : ''}>
        <PaginationLink href="#pablo" onClick={() => setPage(currentPage + 1)}>
          <i className="fas fa-angle-right" />
        </PaginationLink>
      </PaginationItem>
      <PaginationItem className={currentPage === totalPages ? 'disabled' : ''}>
        <PaginationLink
          href="#pablo"
          onClick={() => setPage(Math.ceil(total / pageSize))}
        >
          <i className="fas fa-angle-double-right" />
        </PaginationLink>
      </PaginationItem>
    </Pagination>
  )
}

Paginator.propTypes = {
  total: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  initialPage: PropTypes.number,
  pageSize: PropTypes.number.isRequired,
}

Paginator.defautProps = {
  initialPage: 1,
}

export default Paginator
