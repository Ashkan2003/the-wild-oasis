import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createEditCabin } from "../../services/apiCabins";

export function useEditCabin() {
    const queryClient = useQueryClient(); // to invalid the data in the catch to re-render the ui we whant to acces the queryClient in the App.jsx-file. so we use the useQueryClient()-hook to get access to it

    const { mutate: editCabin, isLoading: isEditing } = useMutation({
        // when ever we delete,insert,update, the data in the server(supabase) we use useMutaition-hook from react-query-library
        mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id), // pass the func who will insert the cabin-row in to the server(supabase)
        onSuccess: () => {
            // when ever the mutationFn was successfull then run this code
            toast.success("Cabin successfully edited"); //when ever the mutationFn was successfull then run this code show this message
            queryClient.invalidateQueries({ queryKey: ["cabins"] }); // invalidate the data by its key in the catch to re-render the ui
        },
        onError: (err) => toast.error(err.message),
    });

    return {isEditing,editCabin}
}