import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteBooking as deleteBookingApi } from "../../services/apiBookings";

// this is a custom-hook for delete a single-booking from the bookings-table from the server
export function useDeleteBooking() {

    const queryClient = useQueryClient(); // to invalid the data in the catch to re-render the ui we whant to acces the queryClient in the App.jsx-file. so we use the useQueryClient()-hook to get access to it

    const { isLoading: isDeleting, mutate: deleteBooking } = useMutation({
        // useMutation is a hook from react-query to mutate(change, delete, set ...) data in the serverside(supabase)
        mutationFn: deleteBookingApi, // mutationFn : we pass the function that will mutate the data to this property
        onSuccess: () => {
            // when ever the mutationFn was successfull then run this code
            toast.success("Booking successfully deleted");
            queryClient.invalidateQueries({
                // when we delete a booking from the bookings the database will succesfully mutated but the ui will not re-render so we invalidate the catch by the queryKey(this is the name of the data  in the catch)so the catch is change so the ui re-render
                queryKey: ["bookings"], // this is the name of the data in the catch
            });
        },
        onError: (err) => toast.error(err.message),
    });
    return {isDeleting, deleteBooking};
}