import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import tw from "tailwind-styled-components";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";

const BookingForm = ({ hideForm }) => {
  const router = useRouter();
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");

  const authUser = getAuth();
  const currentUser = authUser.currentUser;

  const createBooking = async () => {
    try {
      const pickupCoords = "your_pickup_coords";
      const dropoffCoords = "your_dropoff_coords"; 

      const bookingData = {
        pickupCoords,
        dropoffCoords,
        pickupLocation,
        dropoffLocation,
        firstName: currentUser.displayName,
        lastName: "YourLastName", 
        userPhoneNumber: "YourPhoneNumber",
        driverId: "",
        driverPhoneNumber: "",
        rideTime: "0 min", 
        ridePrice: "₱0", 
        isDropoff: false,
      };

      await addDoc(collection(db, "book"), bookingData);

      alert("You have successfully booked");
      router.push("/");
    } catch (error) {
      alert("Error adding booking");
    }
  };

  return (
    <BookingFormContainer>
      <BookingFormTitle>Booking Form</BookingFormTitle>
      <BookingFormGroup>
        <BookingFormLabel htmlFor="pickupLocation">Pickup Location:</BookingFormLabel>
        <BookingFormInput
          type="text"
          id="pickupLocation"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          required
        />
      </BookingFormGroup>
      <BookingFormGroup>
        <BookingFormLabel htmlFor="dropoffLocation">Dropoff Location:</BookingFormLabel>
        <BookingFormInput
          type="text"
          id="dropoffLocation"
          value={dropoffLocation}
          onChange={(e) => setDropoffLocation(e.target.value)}
          required
        />
      </BookingFormGroup>
      <BookingFormButton onClick={createBooking}>Confirm Booking</BookingFormButton>
      <BookingFormButton onClick={hideForm}>Cancel</BookingFormButton>
    </BookingFormContainer>
  );
};

const BookingFormContainer = tw.div`
  p-4 bg-white rounded-lg shadow-md
`;

const BookingFormTitle = tw.h2`
  text-2xl text-center mb-4 font-semibold
`;

const BookingFormGroup = tw.div`
  mb-4
`;

const BookingFormLabel = tw.label`
  block mb-2
`;

const BookingFormInput = tw.input`
  w-full p-2 border-solid border border-gray-400 rounded
`;

const BookingFormButton = tw.button`
  w-full p-2 text-white bg-gray-800 rounded hover:bg-gray-600
`;

export default BookingForm;
