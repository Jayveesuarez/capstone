import Link from "next/link";
import Map from "../components/Map";
import tw from "tailwind-styled-components";
import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const View = () => {
  const router = useRouter();

  const { id, pickup, dropoff,firstName, lastName,userPhoneNumber, pickupLocation, dropoffLocation, ridePrice, rideTime } = router.query;

  const handleDropoff = async () => {

    try {
      if(window.confirm("Are you sure that the passenger is already arrived on their destination? ")){
        if (id) {
          const bookingRef = doc(db, "book", id)
          await updateDoc(bookingRef, { isDropoff: true })
          alert("You have successfully arrived the passenger to their destinations")
          router.push("/")
        }
      }
    } catch (error) {
      alert("Error updating isDropoff:", error);
    }
  };
  
  return (
    <Wrapper>
      <Link href="/" passHref>
        <BackButton>
          <BsArrowLeft size={32} />
        </BackButton>
      </Link>
      <Map pickupCoords={pickup} dropoffCoords={dropoff} />

      <RideContainer>
        <h1 className="text-2xl mb-4 font-bold">In Progress</h1>
        <div className="mb-4">Starting point: <span className="text-xl mb-4 font-semibold">{pickupLocation}</span></div>
        <div className="mb-4">End point:  <span className="text-xl mb-4 font-semibold">{dropoffLocation}</span></div>
        <div className="text-xl mb-4 font-semibold">{firstName} {lastName}</div>
        <div className="text-lg mb-4">{userPhoneNumber}</div>
        
        <div className="text-lg mb-4">{rideTime}</div>
        <div className="text-lg mb-4">{ridePrice}</div>
        <DropoffButton onClick={handleDropoff}> 
          Dropoff
        </DropoffButton>
      </RideContainer>
    </Wrapper>
  );
};

const Wrapper = tw.div`
    flex h-screen flex-col overflow-y-hidden relative bg-gray-800 text-white
`;

const RideContainer = tw.div`
    flex-1 px-2 flex flex-col   
`;

const DropoffButton = tw.button`
    w-full py-4 px-6 my-4 text-blue-100 
    transition-colors duration-150 bg-red-700 
    rounded-lg focus:shadow-outline hover:bg-red-800
`;

const BackButton = tw.button`
    absolute z-50 inset-2 bg-blue-100 h-12 w-12 
    p-2 rounded-full text-blue-700 opacity-90
`;

export default View;
