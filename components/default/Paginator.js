import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { PaginationLink, PaginationItem, Pagination } from 'reactstrap'

export const Paginator = ({ total, initialPage, pageSize, onChangePage }) => {
  const [currentPage, setCurrentPage] = useState(initialPage || 1)
  // const [pages, setPages] = useState([])
  const [totalPages, setTotalPages] = useState(0)

  const [diapasonAndIndexes, setDiapasonAndIndexes] = useState({
    startPage: null,
    endPage: null,
    startIndex: null,
    endIndex: null,
  })
  const setPaginator = (page) => {
    const totalPages = Math.ceil(total / pageSize)
    let startPage, endPage
    if (totalPages <= 10) {
      startPage = 1
      endPage = totalPages
    } else {
      if (page <= 6) {
        startPage = 1
        endPage = 10
      } else if (page + 4 >= totalPages) {
        startPage = totalPages - 9
        endPage = totalPages
      } else {
        startPage = page - 5
        endPage = page + 4
      }
    }

    const startIndex = (page - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize - 1, total - 1)
    // const pages = [...Array(endPage + 1 - startPage).keys()].map(
    //   (i) => startPage + i
    // )

    setCurrentPage(page)
    setTotalPages(totalPages)
    setDiapasonAndIndexes({
      startPage,
      endPage,
      startIndex,
      endIndex,
    })
    // setPages(pages)
  }

  useEffect(() => {
    setPaginator(1)
  }, [])

  useEffect(() => {
    if (initialPage && initialPage !== currentPage) {
      setPaginator(initialPage)
    }
  }, [initialPage])

  useEffect(() => {
    if (total !== total) {
      setTotal(total)
    }
    if (pageSize !== pageSize) {
      setPageSize(pageSize)
    }
    setPaginator(currentPage)
  }, [total, pageSize])

  const setPage = (page) => {
    if (page < 1 || page > Math.ceil(total / pageSize)) {
      return
    }
    setPaginator(page)
    onChangePage(page)
  }

  // if (total <= pageSize) {
  //   return null
  // }

  return (
    <Pagination
      className="pagination justify-content-end mb-0"
      listClassName="justify-content-end mb-0"
    >
      <PaginationItem className={currentPage === 1 ? 'disabled' : ''}>
        <PaginationLink href="#pablo" onClick={() => setPage(1)} tabIndex="-1">
          <i className="fas fa-angle-double-left" />
          <span className="sr-only">First</span>
        </PaginationLink>
      </PaginationItem>
      <PaginationItem className={currentPage === 1 ? 'disabled' : ''}>
        <PaginationLink
          href="#pablo"
          onClick={() => setPage(currentPage - 1)}
          tabIndex="-1"
        >
          <i className="fas fa-angle-left" />
          <span className="sr-only">First</span>
        </PaginationLink>
      </PaginationItem>

      {Array.from({ length: totalPages }, (v, i) => {
        const pageIdx = i + 1
        return (
          <PaginationItem
            key={`page-${i}`}
            className={pageIdx === currentPage ? 'active' : ''}
            onClick={() => setPage(pageIdx)}
          >
            <PaginationLink href="#pablo" onClick={(e) => e.preventDefault()}>
              {pageIdx} <span className="sr-only">(current)</span>
            </PaginationLink>
          </PaginationItem>
        )
      })}

      <PaginationItem className={currentPage < totalPages ? 'disabled' : ''}>
        <PaginationLink href="#pablo" onClick={() => setPage(currentPage + 1)}>
          <i className="fas fa-angle-right" />
          <span className="sr-only">Last</span>
        </PaginationLink>
      </PaginationItem>
      <PaginationItem className={currentPage === totalPages ? 'disabled' : ''}>
        <PaginationLink
          href="#pablo"
          onClick={() => setPage(Math.ceil(total / pageSize))}
        >
          <i className="fas fa-angle-double-right" />
          <span className="sr-only">Last</span>
        </PaginationLink>
      </PaginationItem>
    </Pagination>
  )
}

Paginator.propTypes = {
  total: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  initialPage: PropTypes.number,
  pageSize: PropTypes.number,
}

Paginator.defautProps = {
  pageSize: 10,
  initialPage: 1,
}

export default Paginator
