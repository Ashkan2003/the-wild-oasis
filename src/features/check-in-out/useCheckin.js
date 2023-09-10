// the way of this app => unconfirmed => isPaid === true => checkin => checkout

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useCheckin() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { mutate: checkin, isLoading: isCheckingIn } = useMutation({
        mutationFn: ({bookingId, breakfast}) => updateBooking(bookingId, {
            status: "checked-in",
            isPaid: true,
            ...breakfast,
        }),
        onSuccess: (data) => { // the data in coming from the mutaionFn that returns the data from supabase
            toast.success(`Booking #${data.id} successfully checked in`)
            queryClient.invalidateQueries({active: true})
            navigate("/") // when the work finished navigate to the home page
        },
        onError: () => toast.error("there was an error while checking in ")
    })

    return {checkin, isCheckingIn}


}