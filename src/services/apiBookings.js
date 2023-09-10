/* eslint-disable no-unused-vars */
import { getToday } from "../utils/helpers";
import supabase from "./supabase";
import { PAGE_SIZE } from "../utils/constants"


export async function getBookings({ filter, sortBy, page }) { // this function is for geting the bookings-table and cabins(name)-table-withForigonKey and guests(fullName,email)-table-withForigonKey and also filtering the data coming from the supabase-api 
  // without the filtering and sorting
  let query = supabase
  .from("bookings")
  .select("id,created_at,startDate, endDate,numNights,numGuests,status,totalPrice, cabins(name), guests(fullName,email)", { count: 'exact' }) // get the lenght of the items that arrived from the supabase so we can show it in the pagination-coumponent
  
  // the status for sorting and filtering are in the BookingTableOperations.jsx-file
  // filtering if(filter) was trusly-value => overwrite the query
  if (filter) query = query[filter.method || "eq"](filter.field, filter.value) // if the filter was trusly-value then set the query to query[supabase-filter-mathod(like .eq or .gte or .lte)]("supabase-row-item-key", value) for example query.eq("status", "checked-in")

  // sorting if(sortBy) was trusly-value => overwrite the query
  // the order-method is a supabase-method for ordreing its a recepy to folow
  if (sortBy.field) query = query.order(sortBy.field, { ascending: sortBy.direction === "asc" })

  // pagination
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1
    query = query.range(from, to) // the .range-method is one of the supabase-mathod whitch gets two intris => from: the num of item-start, to: the num of item-end its usecase is in like pagination
  }

  const { data, error, count } = await query

  if (error) {
    console.error("error");
    throw new Error("Bookings coud not be loaded")
  }

  return { data, count }
}

export async function getBooking(id) {// this function is for geting bookings-table and cabins-table and guests-table every-item-row  1-row(by its id)
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id) // get only one-row from its id
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }
  
  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
// date needs to be an ISOString
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date) // get the created_at > data
    .lte("created_at", getToday({ end: true })); // get created_at < todays date

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date) // get startDate > date
    .lte("startDate", getToday()); // get startDate < todays date

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
