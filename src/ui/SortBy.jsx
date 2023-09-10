/* eslint-disable react/prop-types */
import { useSearchParams } from "react-router-dom";
import Select from "./Select";


function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy") || ""; // get the current sortBy from the URL-search-params by "sortBy"-key and if its null then put "" 

  function handleChange(e) {
      // set the select-box-current-value into the URL by the key of "sortBy"
    searchParams.set("sortBy", e.target.value); 
    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      type="white"
      value={sortBy}
      onChange={handleChange}
    />
  );
}

export default SortBy;
