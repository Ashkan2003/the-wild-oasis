import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBookings";
import { useParams } from "react-router-dom";

// this is a custom-hook
export function useBooking() {
    const {bookingId} = useParams()

    const {
        // these states are enternal-react-query-state for manage the error or the isLoading and ect...
        isLoading,
        data: booking, // the data is coming from the supabase// its an array of obj that obj contains the cabin details
        error,
    } = useQuery({
        queryKey: ["booking", bookingId], // this is a optioanall key for access the data in other component in the catch
        queryFn: () => getBooking(bookingId), // the queryFn : pass the function who will fetch the data from the api
        retry: false,
    });
    
    return {isLoading, booking, error}
    
}