import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import { toast } from "react-hot-toast";

export function useCreateCabin () {

    
    const queryClient = useQueryClient(); // we use useQueryClient-hook to acces to query-client in App.jsx-file to invalidate the data(cabins) inthe catch so the ui will re-render
    
    const { mutate: createCabin, isLoading: isCreating } = useMutation({
        // when ever we delete,insert,update, the data in the server(supabase) we use useMutaition-hook from react-query-library
        mutationFn: createEditCabin,// we want to create-cabin // pass the func who will insert the cabin-row in to the server(supabase)
        onSuccess: () => {
            // when ever the mutationFn was successfull then run this code
            toast.success("New cabin successfull created"); //when ever the mutationFn was successfull then run this code show this message
            queryClient.invalidateQueries({ queryKey: ["cabins"] }); // invalidate the data by its key in the catch to re-render the ui
        },
        onError: (err) => toast.error(err.message),
    });

    return {isCreating, createCabin}
}