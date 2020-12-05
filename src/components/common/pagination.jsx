import React, { Component } from "react";
import _ from "lodash";
import { func, number } from "prop-types";

class Pagination extends Component {
  render() {
    const { itemCount, pageSize, currentPage, onPageChange } = this.props;

    const pageCount = Math.ceil(itemCount / pageSize);
    if (pageCount === 1) return null;
    const pages = _.range(1, pageCount + 1);

    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          {pages.map((page) => (
            <li
              key={page}
              className={
                currentPage === page ? "page-item active" : "page-item"
              }
            >
              {/* eslint-disable-next-line */}
              <a className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

Pagination.propTypes = {
  itemCount: number.isRequired,
  pageSize: number.isRequired,
  currentPage: number.isRequired,
  onPageChange: func.isRequired,
};

export default Pagination;
