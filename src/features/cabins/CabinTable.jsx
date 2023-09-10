/* eslint-disable no-unused-vars */
import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import Empty from "../../ui/Empty";


//cabin = [{id: 1, created_at: '2023-08-27T08:54:15.933335+00:00', name: '001', maxCapacity: 2, regularPrice: 250, …},{id: 2, created_at: '2023-08-28T13:53:31.84889+00:00', name: '002', maxCapacity: 4, regularPrice: 400, …}]

function CabinTable() {
  const { isLoading, cabins } = useCabins(); // this is a custom-hook
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;
  if (!cabins.length) return <Empty resourceName="cabins"/>

  // this code is for filtering the cabins
  const filterValue = searchParams.get("discount") || "all"; // get the data stored in the Url by the key of "discount" // if the user coms to this page for firs time there is no data stored in the url so by defuelt make sorting "all"

  let filteredCabins;

  if (filterValue === "all") filteredCabins = cabins;

  if (filterValue === "no-discount") {
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  }

  if (filterValue === "with-discount") {
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);
  }

  // this code is for sorting the cabins

  const sortBy = searchParams.get("sortBy") || "name-asc" // get the sortBy-key value from the url and if its null set to "name-asc"
  // the sortBy is combined from two pices 1. the way of sorting(like with alpabetic or price or capacity) 2. the "asc" and "desc" way of sorting
  // we split of these combined pices by js-splite-method by "-"
  // field : the way of sorting(like with alpabetic or price or capacity) 
  // direction the "asc" and "desc" way of sorting
  const [field, direction] = sortBy.split('-');
  
  // the modifire change the sorting direction by * the item in 1 or -1
  const modifier = direction === 'asc' ? 1 : -1
  
  const sortedCabins = filteredCabins.sort((a,b) => (a[field] - b[field]) * modifier) // this if the regular way of sorting in js 


  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          {" "}
          {/*we used compound-component */}
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={sortedCabins} // finally  recive the the data  comes from the supabase// its an array of obj that obj contains the cabin details after filter-section and sorting-section
          render={(
            // we used render-prop-pattern
            cabin // loop throg the cabin-array and create the rows of table
          ) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
