/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// this component is a reuseble-pagination
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {PAGE_SIZE} from "../utils/constants"
const StyledPagination = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const P = styled.p`
  font-size: 1.4rem;
  margin-left: 0.8rem;

  & span {
    font-weight: 600;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const PaginationButton = styled.button`
  background-color: ${(props) =>
    props.active ? " var(--color-brand-600)" : "var(--color-grey-50)"};
  color: ${(props) => (props.active ? " var(--color-brand-50)" : "inherit")};
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s;

  &:has(span:last-child) {
    padding-left: 0.4rem;
  }

  &:has(span:first-child) {
    padding-right: 0.4rem;
  }

  & svg {
    height: 1.8rem;
    width: 1.8rem;
  }

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

// const PAGE_SIZE = 10;

function Pagination({ count }) {
  // count : the total number of items before the pagination(we need this for calc)
  // PAGE_SIZE : the number of items(booking-row) in one page
  // pageCount : the number of pages in the pagination
  const [searchParams, setSearchParamas] = useSearchParams();

  const currentPage = !searchParams.get("page")
    ? 1 // if the  searchParams.get("page") returns null its becuse the users first-time coming to site so the current page will 1
    : Number(searchParams.get("page")); // get the current-page that the user is in there from the URL

  
  const pageCount = Math.ceil(count / PAGE_SIZE);  

  function nextPage() {
    const next =
      currentPage === pageCount
        ? currentPage // if the currentPage === pageCount was true we are inthe last-page so dont go forther and stay in the current-page
        : currentPage + 1; // if the  currentPage === pageCount was false we are not in the last-page so and the current-page + 1
    searchParams.set("page", next);
    setSearchParamas(searchParams);
  }

  function prevPage() {
    const prev =
      currentPage === 1
        ? currentPage // if the currentPage was 1, we are inthe firs-page so dont go forther and stay in the current-page
        : currentPage - 1; // if the  currentPage was not 1, we are not in the first-page and so set the current-page - 1
    searchParams.set("page", prev);
    setSearchParamas(searchParams);
  }

  if(pageCount <= 1) return null // after calculating the pageCount if the pageCount is 1 or less, is meaningLess to have pagination becuse we have only one page so return null

  return (
    <StyledPagination>
      <P>
        Showing <span>{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
        <span>
          {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
        </span>{" "}
        of <span>{count}</span> results
      </P>

      <Buttons>
        <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
          {" "}
          {/*when we are in the first-page disable this button so the user cant go previos */}
          <HiChevronLeft /> <span>Previos</span>
        </PaginationButton>

        <PaginationButton
          onClick={nextPage}
          disabled={currentPage === pageCount}
        >
          {" "}
          {/** when we are in the last-page disable this buuton so the user cant go to the next-page(becuse it doesint exists) */}
          <span>Next</span> <HiChevronRight />
        </PaginationButton>
      </Buttons>
    </StyledPagination>
  );
}

export default Pagination;
