// the way of this app => unconfirmed => isPaid === true => checkin => checkout

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import { toast } from "react-hot-toast";

export function useCheckout() {
    const queryClient = useQueryClient()

    const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
        mutationFn: (bookingId) => updateBooking(bookingId, {
            status: "checked-out",
        }),
        onSuccess: (data) => { // the data in coming from the mutaionFn that returns the data from supabase
            toast.success(`Booking #${data.id} successfully checked out`)
            queryClient.invalidateQueries({ active: true })
        },
        onError: () => toast.error("there was an error while checking out ")
    })

    return { checkout, isCheckingOut }


}