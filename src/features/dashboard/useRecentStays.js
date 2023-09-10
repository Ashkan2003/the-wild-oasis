import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { getStaysAfterDate } from "../../services/apiBookings";

export function useRecentStays() {
    const [searchParams] = useSearchParams()

    const numDays = !searchParams.get('last') // the numDays is is the time-filter that we want the information from. for examole we want information from 7 days ago// this 7 or 30 or 90 is stored in the URL
        ? 7 //if searchParams havent a value
        : Number(searchParams.get('last')) // //if searchParams have a value

    const queryDate = subDays(new Date(), numDays).toISOString()// for example we need 7 days ago information so we  minese the current-Date from the numDays(for example todayDate - 7) and the result convert to IOString // meanuly the supabase needs the date-information in ISOString-format

    const { isLoading, data: stays } = useQuery({
        queryFn: () => getStaysAfterDate(queryDate),
        queryKey: ["stays", `last-${numDays}`],
    })

    const confirmedStays = stays?.filter(stay => stay.status === "checked-in" || stay.status === "checked-out") // we dont need the unConfirmed status so we filter the stays

    return { isLoading, stays, confirmedStays, numDays }
}