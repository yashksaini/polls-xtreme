import React, { useEffect, useState } from "react";
import pollStyle from "./../polls.module.css";
const Paging = (props) => {
  const { currentPage, updateCurrentPage, pageCount } = props;
  const [pageNumbers, setPageNumbers] = useState([1]);
  const showPages = () => {
    let array = [];
    for (let i = 0; i < pageCount; i++) {
      array.push(i + 1);
    }
    setPageNumbers(array);
  };
  useEffect(() => {
    showPages(); // eslint-disable-next-line
  }, [pageCount]);
  return (
    <div
      className={
        pageCount === 1 || pageCount === 0
          ? `${pollStyle.hide}`
          : `${pollStyle.paging}`
      }
    >
      <div
        className={pollStyle.arrow}
        onClick={() => {
          let pageNo = currentPage;
          if (pageNo > 1) {
            pageNo--;
          }
          updateCurrentPage(pageNo);
        }}
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </div>
      <div className={pollStyle.allPages}>
        {pageNumbers.map((page, index) => {
          return (
            <div
              className={
                page === currentPage
                  ? `${pollStyle.pageData} ${pollStyle.activePage}`
                  : `${pollStyle.pageData}`
              }
              onClick={() => {
                updateCurrentPage(page);
              }}
              key={index}
            >
              {page}
            </div>
          );
        })}
      </div>

      <div
        className={pollStyle.arrow}
        onClick={() => {
          let pageNo = currentPage;
          if (pageNo < pageCount) {
            pageNo++;
          }
          updateCurrentPage(pageNo);
        }}
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </div>
    </div>
  );
};

export default Paging;
