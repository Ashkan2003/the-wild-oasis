import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";

// this is a custom-hook
export function useDeleteCabin() {

    const queryClient = useQueryClient(); // to invalid the data in the catch to re-render the ui we whant to acces the queryClient in the App.jsx-file. so we use the useQueryClient()-hook to get access to it

    const { isLoading: isDeleting, mutate: deleteCabin } = useMutation({
        // useMutation is a hook from react-query to mutate(change, delete, set ...) data in the serverside(supabase)
        mutationFn: deleteCabinApi, // mutationFn : we pass the function that will mutate the data to this property
        onSuccess: () => {
            // when ever the mutationFn was successfull then run this code
            toast.success("Cabin successfully deleted");
            queryClient.invalidateQueries({
                // when we delete a cabin from the cabins the database will succesfully mutated but the ui will not re-render so we invalidate the catch by the queryKey(this is the name of the data  in the catch)so the catch is change so the ui re-render
                queryKey: ["cabins"], // this is the name of the data in the catch
            });
        },
        onError: (err) => toast.error(err.message),
    });
    return {isDeleting, deleteCabin};
}