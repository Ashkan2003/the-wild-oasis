import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

// this is a custom-hook
export function useCabins() {

    const {
        // these states are enternal-react-query-state for manage the error or the isLoading and ect...
        isLoading,
        data: cabins, // the data is coming from the supabase// its an array of obj that obj contains the cabin details
        error,
    } = useQuery({
        queryKey: ["cabins"], // this is a optioanall key for access the data in other component in the catch
        queryFn: getCabins, // the queryFn : pass the function who will fetch the data from the api
    });
    return {isLoading, cabins, error}
}