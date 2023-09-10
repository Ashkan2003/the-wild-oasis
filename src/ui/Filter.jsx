/* eslint-disable react/prop-types */
// this is a reuseble-component for creating filter-Buttons
import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const FilterButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

function Filter({ filterField, options }) {
  // the filterField is the URL-searchParam-key
  // the options is an array of obj that has a value for search and a lable like { value: "no-discount", label: "No discount" }
  const [searchParams, setSearchParams] = useSearchParams(); // useSearchParams in a hook for reading and writing search-parametrs(like value or data) in the url with out using global-states
  const currentFilter = searchParams.get(filterField) || options.at(0).value; //get the current-selected-btn// if the searchParams.get(filterField) was null then run the first option given by the user (options.at(0).value)

  function handleClick(value) {
    // we store the value in the URL by the name of filterField
    searchParams.set(filterField, value);
    if (searchParams.get("page")) { // this setting is for pagination-filter and doesint connected with other fiters
      searchParams.set("page", 1);
    }
    setSearchParams(searchParams);
  }

  return (
    <StyledFilter>
      {options.map( // loop trogh the options Array and create the FilterButton
        (option) => (
          <FilterButton
            key={option.value}
            onClick={() => handleClick(option.value)}
            active={option.value === currentFilter}
            disabled={option.value === currentFilter}
          >
            {option.label}
          </FilterButton>
        )
      )}
    </StyledFilter>
  );
}

export default Filter;
