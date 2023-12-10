import tw from "tailwind-styled-components";
import Map from "../components/Map";
import RideSelector from "../components/RideSelector";
import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";
import Link from "next/link";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { useState, useEffect } from "react";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";

const Confirm = () => {
  const router = useRouter();
  const authUser = getAuth();
  const currentUser = authUser.currentUser;

  const { pickup, dropoff, pickupLocation, dropoffLocation } = router.query;

  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [rideData, setRideData] = useState({
    rideDuration: 0,
    ridePrice: 0,
  });

  useEffect(() => {
    if (currentUser) {
      const userUID = currentUser.uid;

      const userDocRef = doc(db, "users", userUID);
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setUserProfile({
              firstName: data.firstName,
              lastName: data.lastName,
              phoneNumber: data.phoneNumber,
            });
          }
        })
        .catch((error) => {});
    }
  }, [currentUser]);

  const createBooking = async () => {
    if(window.confirm("Are you sure that these details you input are correct?")){
      try {
        const bookingData = {
          pickupCoords: pickup,
          dropoffCoords: dropoff,
          pickupLocation: pickupLocation,
          dropoffLocation: dropoffLocation,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          userPhoneNumber: userProfile.phoneNumber,
          driverId: "",
          driverPhoneNumber: "",
          userId: currentUser.uid,
          rideTime: rideData.rideDuration.toFixed() + " min",
          ridePrice: "₱" + rideData.ridePrice,
          isDropoff: false,
        };
  
        await addDoc(collection(db, "book"), bookingData);
  
        alert("You have successfully booked");
        router.push("/profile");
      } catch (error) {
        alert("Error adding booking");
      }
    }
  };

  return (
    <Wrapper>
      <Link href="/search" passHref>
        <BackButton>
          <BsArrowLeft size={32} />
        </BackButton>
      </Link>
      <Map pickupCoords={pickup} dropoffCoords={dropoff} />

      <RideContainer>
        <RideSelector
          pickupCoords={pickup}
          dropoffCoords={dropoff}
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          onRideDataChange={(data) => setRideData(data)}
        />
        <ConfirmButton onClick={createBooking}>
          Confirm Booking
        </ConfirmButton>
      </RideContainer>
    </Wrapper>
  );
};

const Wrapper = tw.div`
    flex h-screen flex-col overflow-y-hidden relative bg-gray-800 text-white
`;

const RideContainer = tw.div`
    px-2 flex flex-col   
`;

const ConfirmButton = tw.button`
  w-full h-12 px-6 my-4 text-blue-100 
  transition-colors duration-150 bg-gray-600 
  rounded-lg focus:shadow-outline hover:bg-gray-700
`;

const BackButton = tw.button`
    absolute z-50 inset-2 bg-blue-100 h-12 w-12 
    p-2 rounded-full text-blue-700 opacity-90
`;

export default Confirm;
