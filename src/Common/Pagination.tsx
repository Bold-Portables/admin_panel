import React from "react";
import { usePagination, DOTS } from "./UsePagination";

interface MyComponentProps {
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (currentPage: number) => void;
  onChangePageLimit: (pageLimit: number) => void;
  resData: any[];
}

function Pagination(props: MyComponentProps) {
  let siblingCount: number = 1;
  let {
    totalCount,
    currentPage,
    itemsPerPage,
    resData,
    onPageChange,
    onChangePageLimit,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    itemsPerPage,
  });

  // if (currentPage === 0 || paginationRange.length < 2) {
  //   return null;
  // }

  const paginate = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  const handleNextbtn = () => {
    onPageChange(currentPage + 1);
  };

  const handlePrevbtn = () => {
    onPageChange(currentPage - 1);
  };

  const renderPageNumbers = paginationRange.map(
    (pageNumber: any, index: number) => {
      if (pageNumber === DOTS) {
        return (
          <li key={index + 1} className="page-item">
            <span className="page-link">
              <em className="icon ni ni-more-h"></em>
            </span>
          </li>
        );
      }

      return (
        <li
          key={index + 1}
          onClick={() => paginate(pageNumber)}
          className={`page-item ${currentPage === pageNumber && "active"}`}
        >
          <a className="page-link page_num"> {pageNumber} </a>
        </li>
      );
    }
  );

  const handleChangePageLimit = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    if (value) {
      onChangePageLimit(parseInt(value));
      onPageChange(1);
    }
  };

  return (
    <div className="card">
      <div className="card-inner">
        <div className="nk-block-between-md g-3">
          <div className="g">
            <ul className="pagination justify-content-center justify-content-md-start">
              {currentPage !== paginationRange[0] && (
                <li className="page-item">
                  <span
                    className={`page-link ${
                      currentPage !== paginationRange[0] && "btn_active"
                    }`}
                    onClick={handlePrevbtn}
                  >
                    Prev
                  </span>
                </li>
              )}
              {renderPageNumbers}
              {currentPage !== paginationRange[paginationRange.length - 1] && (
                <li className="page-item">
                  <span
                    className={`page-link ${
                      currentPage !==
                        paginationRange[paginationRange.length - 1] &&
                      "btn_active"
                    }`}
                    onClick={handleNextbtn}
                  >
                    Next
                  </span>
                </li>
              )}
            </ul>
          </div>
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {(currentPage - 1) * itemsPerPage + resData.length} of {totalCount}{" "}
            {totalCount > 1 ? "entries" : "entry"}
          </div>
          <div className="g">
            <div className="pagination-goto d-flex justify-content-center justify-content-md-start gx-3">
              <div>Page</div>
              <div>
                <select
                  className="form-select js-select2"
                  data-search="on"
                  data-dropdown="xs center"
                  onChange={(e) => handleChangePageLimit(e)}
                >
                  <option value="">Select</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
