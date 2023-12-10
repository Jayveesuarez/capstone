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
} from 'firebase/firestore';

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        const userUID = user.uid;
        const userDocRef = doc(db, 'drivers', userUID);

        getDoc(userDocRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();

              if (data.role === 'driver') {
                setUserData(data);
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
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
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
          <h1 className="text-3xl font-bold mb-2">Driver Profile</h1>
          <p className="mb-2">First Name: {userData.firstName}</p>
          <p className="mb-2">Last Name: {userData.lastName}</p>
          <p className="mb-2">Birthday: {userData.birthday}</p>
          <p className="mb-2">Motorcycle Model: {userData.motorcycleModel}</p>
          <p className="mb-2">Motorcycle Reg. No: {userData.motorcycleRegNo}</p>
        </ProfileInfo>
      </ProfileCard>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex justify-center items-center h-screen flex-col overflow-y-hidden relative bg-gray-800 
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
