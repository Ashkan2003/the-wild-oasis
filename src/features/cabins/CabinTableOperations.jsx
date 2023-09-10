import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter // in Filter.jsx-file we created search-param and send the options.value to the url by the key of "discount" like ?discount=no-discount
        filterField="discount"
        options={[
          { value: "all", label: "All" },
          { value: "no-discount", label: "No discount" },
          { value: "with-discount", label: "With discount" },
        ]}
      />

      <SortBy options={[ // in Sort.jsx-file we created search-param and send the options.value to the url by the key of "sortBy"
        {value: 'name-asc', label: "Sort by name (A-Z)"},
        {value: 'name-desc', label: "Sort by name (Z-A)"},
        {value: 'regularPrice-asc', label: "Sort by price (low first)"},
        {value: 'regularPrice-desc', label: "Sort by price (high first)"},
        {value: 'maxCapacity-asc', label: "Sort by capacity (low first)"},
        {value: 'maxCapacity-desc', label: "Sort by capacity (high first)"},
      ]}/>
    </TableOperations>
  );
}

export default CabinTableOperations;
