import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { getBookingsAfterDate } from "../../services/apiBookings";

export function useRecentBookings() {
    const [searchParams] = useSearchParams()

    const numDays = !searchParams.get('last')
        ? 7 //if searchParams havent a value
        : Number(searchParams.get('last')) // //if searchParams have a value

    const queryDate = subDays(new Date(), numDays).toISOString() // for example we need 7 days ago information so we  minese the current-Date from the numDays(for example todayDate - 7) and the result convert to IOString // meanuly the supabase needs the date-information in ISOString-format

    const {isLoading, data: bookings } =useQuery({
        queryFn: () => getBookingsAfterDate(queryDate),
        queryKey: ["bookings", `last-${numDays}`],
    })

    return {isLoading, bookings}
}