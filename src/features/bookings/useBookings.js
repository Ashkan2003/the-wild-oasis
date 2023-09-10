import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

export function useBookings() {
    const queryClient = useQueryClient()
    const [searchParams] = useSearchParams()

    // filter 
    const filterValue = searchParams.get("status");
    const filter = !filterValue || filterValue === "all"
        ? null // if the filterValue geted from the URL-search-params was empty or the filterValue was "all" => it means that we want all the items so dont filter
        : { field: 'status', value: filterValue } // else => create an obj whit field(supabase-row-item-key) and value(comes from the URL)

    // sort 
    const sortByRaw = searchParams.get('sortBy') || "startDate-desc"
    const [field, direction] = sortByRaw.split("-") // split the sortByRaw into two parts and then store it as a array
    const sortBy = { field, direction } // store field and direction as a obj in the sortBy

    //pagination
    const page = !searchParams.get("page")
        ? 1 // if the  searchParams.get("page") returns null its becuse the users first-time coming to site so the current page will 1
        : Number(searchParams.get("page")); // get the current-page that the user is in there from the URL

    // query
    const {
        // these states are enternal-react-query-state for manage the error or the isLoading and ect...
        isLoading,
        data: { data: bookings, count } = {}, // the data is coming from the supabase// its an array of obj that obj contains the bookings details
        error,
    } = useQuery({
        queryKey: ["bookings", filter, sortBy, page],// the queryKey also its like a dependency array => when ever the filter and sortBy was chenge so re-render the ui // this is a optioanall key for access the data in other component in the catch
        queryFn: () => getBookings({ filter, sortBy, page }), // the queryFn : pass the function who will fetch the data from the api
    });


    // pre-fetching : is a way for pre-fetch the data from the catch so the page dont wait for loding the data so the user-experince(ux) is better  
    // this pre-fetching is only for sites pagination, so when ever the user clicks on "next" or "prev" btn then the data imiditily shows-up and the user dont wait for loading
    const pageCount = Math.ceil(count / PAGE_SIZE)

    // this pre-fetching is for next-page
    // the way that this pre-fetching works is when we are in the current-page(for ezample page num-6),then the pre-fetching loads the next-page-data(for example page num-7) in from api(supabase) into the catch 
    if (page < pageCount) { // if we are not in the last-page, do pre-fetching

        queryClient.prefetchQuery({ // we use prefetchQuery-method from react-query for pre-fetching the data
            queryKey: ["bookings", filter, sortBy, page + 1],// the queryKey also its like a dependency array => when ever the filter and sortBy was chenge so re-render the ui // this is a optioanall key for access the data in other component in the catch
            queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),// page: page + 1 it means that fetch the next page-data // the queryFn : pass the function who will fetch the data from the api
        })

    }

    // this pre-fetching is for prev-page
    // the way that this pre-fetching works is when we are in the current-page(for ezample page num-6),then the pre-fetching loads the prev-page-data(for example page num-5) from api(supabase) into the catch 
    if (page > 1) { // if we are not in the firts-page, do pre-fetching

        queryClient.prefetchQuery({ // we use prefetchQuery-method from react-query for pre-fetching the data
            queryKey: ["bookings", filter, sortBy, page - 1],// the queryKey also its like a dependency array => when ever the filter and sortBy was chenge so re-render the ui // this is a optioanall key for access the data in other component in the catch
            queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),// page: page - 1 it means that fetch the prev page-data // the queryFn : pass the function who will fetch the data from the api
        })

    }

    return { isLoading, bookings, error, count }
}