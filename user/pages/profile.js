import Link from "next/link";
import tw from "tailwind-styled-components";
import { BsArrowLeft } from "react-icons/bs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import {
  doc,
  getDoc,
  getDocs,
  query,
  where,
  collection
} from 'firebase/firestore';

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({});
  const [userBookings, setUserBookings] = useState([]);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userUID = user.uid;
        const userDocRef = doc(db, 'users', userUID);

        try {
          const docSnapshot = await getDoc(userDocRef);

          if (docSnapshot.exists()) {
            const data = docSnapshot.data();

            if (data.role === 'user') {
              setUserData(data);
              const bookingsCollection = collection(db, 'book');
              const userBookingsQuery = query(bookingsCollection, where('userId', '==', auth.currentUser.uid));
              const userBookingsSnapshot = await getDocs(userBookingsQuery);
              const userBookingsData = userBookingsSnapshot.docs.map(doc => doc.data());
              setUserBookings(userBookingsData);
            } else {
              alert("Your account doesn't register as a driver!");
              signOut(auth);
              router.push('/landing');
            }
          } else {
            alert("Your account doesn't register as a driver!");
            signOut(auth);
            router.push('/landing');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        router.push('/landing');
      }
    });
  }, [router]);


  return (
    <Wrapper>
      <Link href="/" passHref>
        <BackButton>
          <BsArrowLeft size={32} />
        </BackButton>
      </Link>
      <ProfileCard>
        <UserImage src="https://www.pngfind.com/pngs/m/676-6764065_default-profile-picture-transparent-hd-png-download.png" />
        <ProfileInfo>
          <h1 className="text-3xl font-bold mb-2">User Profile</h1>
          <p className="mb-2">First Name: {userData.firstName}</p>
          <p className="mb-2">Last Name: {userData.lastName}</p>
          <p className="mb-2">Phone Number: {userData.phoneNumber}</p>
          <p className="mb-2">Birthday: {userData.birthday}</p>
        </ProfileInfo>
      </ProfileCard>
      <h1 className="text-2xl font-bold mt-4 mb-2 text-white">My Reservations</h1>
      <div className="flex flex-col-reverse">
        {userBookings.length === 0 ? (
          <h1>You have no reservations.</h1>
        ) : (
          userBookings.map((booking, index) => (
            <div key={index} className="bg-white p-4 my-4 rounded-md shadow-lg">
              <p className="text-xl"><span className="font-semibold">Pickup Location:</span> {booking.pickupLocation}</p>
              <p className="text-xl"><span className="font-semibold">Dropoff Location:</span> {booking.dropoffLocation}</p>
              <p className="mb-2">
                {booking.isDropoff
                  ? <span className="rounded py-2 px-4 ">You have arrived in your destination!</span>
                  : booking.driverId
                  ? <span className="rounded py-2 px-4 ">In Progress</span>
                  : <span className="rounded py-2 px-4 ">Pending</span>}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Driver: </span>{booking.driverName}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Driver Phone: </span>{booking.driverPhoneNumber}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Motorcycle Model: </span>{booking.motorcycleModel}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Ride Time: </span>{booking.rideTime}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Ride Price: </span>{booking.ridePrice}
              </p>
            </div>
          ))
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex justify-center items-center min-h-screen h-full flex-col overflow-y-hidden relative bg-gray-800 
`;

const ProfileCard = tw.div`
  bg-white p-6 rounded-lg shadow-lg mx-auto mt-8 w-full max-w-lg
`;

const UserImage = tw.img`
  h-16 w-16 cursor-pointer rounded-full object-cover
`;

const ProfileInfo = tw.div`
  text-left
`;

const BackButton = tw.button`
  absolute top-6 left-6 bg-blue-100 h-12 w-12 p-2 rounded-full text-blue-700 opacity-90
`;

export default Profile;
