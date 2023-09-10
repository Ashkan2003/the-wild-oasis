/* eslint-disable no-unused-vars */
import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "../bookings/useBooking";
import Spinner from "../../ui/Spinner";
import { useEffect, useState } from "react";
import Checkbox from "../../ui/Checkbox";
import { formatCurrency } from "../../utils/helpers";
import { useCheckin } from "./useCheckin";
import { useSettings } from "../settings/useSettings";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false); // with this state we add a check-box for adding a breakfast for the guests who dont have chosed breakfast initioaly(inthe supasbase)

  const { booking, isLoading } = useBooking();

  const { settings, isLoading: isLoadingSettings } = useSettings(); // this is a custm-hook

  // isPaid is one of the supabase-row-items of booking-table that tell the quest paid the amount or not, so we get these information from supabase and store it into confirmPaid-state
  // when the guest paid the amout the check-box blow has beed cheched
  // when the guest has not paid the amout, the check-box blow has not beed cheched
  useEffect(() => setConfirmPaid(booking?.isPaid ?? false), [booking]);

  const moveBack = useMoveBack();

  const { checkin, isCheckingIn } = useCheckin();

  if (isLoading || isLoadingSettings) return <Spinner />;

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking;

  const optionalBreafastPrice = settings.breakfastPrice * numNights * numGuests; // calc the breakfast-price for the quests (if they dont have breakfast initialy(from supabase))
  //status: "checked-in",isPaid: true,
  function handleCheckin() { // when ever the user clicks this btn we need to send the new-information(check-box-information) like "the quest paid his amount" or "the quest want breakfast " so we calc the breakfast-price and total-price and the quest-status and sent it to the server(supabase)
    
    if (!confirmPaid) return; // if the quest doesing paid yet(the conferm-piad-check-box doesing selected yet) dont run the code bellow 

    if (addBreakfast) {//checking in the qeust so set status: "checked-in" and isPaid: true  and if the quest wants breakfast calc "hasBreakfast" and "extrasPrice" and "totalPrice" and then send these to the server(supabase)
      checkin({
        bookingId,
        breakfast: {
          hasBreakfast: true,
          extrasPrice: optionalBreafastPrice,
          totalPrice: totalPrice + optionalBreafastPrice,
        },
      });
    } else {//only checking in the qeust so set status: "checked-in" and isPaid: true // the quest dont want breakfast(he have it initialy)
      checkin({ bookingId, breakfast: {} });
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!hasBreakfast && (
        <Box>
          <Checkbox // this check-box is for selecting breakfast
            checked={addBreakfast}
            onChange={() => {
              setAddBreakfast((add) => !add);
              setConfirmPaid(false);
            }}
            id="breakfast" // this id if for "htmlFor"
          >
            Want to add breakfast for {formatCurrency(optionalBreafastPrice)}?
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox // // this check-box is for conferming the quest paid the amount 
          checked={confirmPaid}
          onChange={() => setConfirmPaid((confirm) => !confirm)}
          disabled={confirmPaid || isCheckingIn} //when the quest has paid the amount then disable this check-box-btn so it canot be changed
          id="confirm" // this id if for "htmlFor"
        >
          I confirm that {guests.fullName} has paid the total amount of{" "}
          {!addBreakfast
            ? formatCurrency(totalPrice) // if the quest have paid breakfast initialy
            : `${formatCurrency(
                // if the qest dont have breakfast initialy and when he comes he want the breakfast so calc the breakfast-price then add it on the total-price
                totalPrice + optionalBreafastPrice
              )} (${formatCurrency(totalPrice)} + ${formatCurrency(
                optionalBreafastPrice
              )})`}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button onClick={handleCheckin} disabled={!confirmPaid || isCheckingIn}>
          Check in booking #{bookingId}
        </Button>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
