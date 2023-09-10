/* eslint-disable no-unused-vars */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateCurrentUser } from "../../services/apiAuth";

export function useUpdateUser() {
    const queryClient = useQueryClient(); // to invalid the data in the catch to re-render the ui we whant to acces the queryClient in the App.jsx-file. so we use the useQueryClient()-hook to get access to it

    const { mutate: updateUser, isLoading: isUpdating } = useMutation({
        // when ever we delete,insert,update, the data in the server(supabase) we use useMutaition-hook from react-query-library
        mutationFn: updateCurrentUser, // pass the func who will insert the password, fullName, avatar  to the server(supabase)
        onSuccess: ({user}) => {
            // when ever the mutationFn was successfull then run this code
            toast.success("User account successfully updated"); //when ever the mutationFn was successfull then run this code show this message
            queryClient.setQueryData(["user"], user )
            // queryClient.invalidateQueries({ queryKey: ["user"] }); // invalidate the data by its key in the catch to re-render the ui
        },
        onError: (err) => toast.error(err.message),
    });
    
    return {isUpdating,updateUser}
}