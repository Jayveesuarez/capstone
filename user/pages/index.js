import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signOut, onAuthStateChanged, getAuth } from "firebase/auth";
import { auth, db } from "../firebase";
import { HiOutlineLogout } from "react-icons/hi";
import tw from "tailwind-styled-components";
import Map from "../components/Map";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import { FaBiking } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

const Index = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const authUser = getAuth();
  const currentUser = authUser.currentUser;
  const [userData, setUserData] = useState({ firstName: "", lastName: "" });
  const [showBookingForm, setShowBookingForm] = useState(true); // Add state

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user.displayName,
          photoUrl: user.photoURL,
        });

        const userUID = user.uid;

        const userDocRef = doc(db, "users", userUID);
        getDoc(userDocRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              if (data.role === "user") {
                setUserData({
                  firstName: data.firstName,
                  lastName: data.lastName,
                });
              } else {
                alert("Your account doesn't register as a user!");
                signOut(auth);
                router.push("/landing");
              }
            } else {
              alert("Your account doesn't register as a user!");
              signOut(auth);
              router.push("/landing");
            }
          })
          .catch((error) => {});
      } else {
        setUser(null);
        router.push("/landing");
      }
    });
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      signOut(auth);
    }
  };

  return (
    <Wrapper>
      <Map />
      <ActionItems>
        <Header>
          <Title>
            <GiFullMotorcycleHelmet size={30} /> Angkas
          </Title>
          <Link href="/profile" passHref>
            <ProfileContainer>
              <Profile>
                <Name>
                  {currentUser && userData.firstName} {currentUser && userData.lastName}
                </Name>
                <UserImage
                  src={
                    "https://www.pngfind.com/pngs/m/676-6764065_default-profile-picture-transparent-hd-png-download.png"
                  }
                />
              </Profile>
              <LogoutButton onClick={handleLogout}>
                <HiOutlineLogout size={25} />
                Logout
              </LogoutButton>
            </ProfileContainer>
          </Link>
        </Header>
        {showBookingForm ? ( 
          <Link href="/search" passHref>
            <ActionButton>
              <ActionButtonImage>
                <FaBiking size={34} />
              </ActionButtonImage>
              Create a booking
            </ActionButton>
          </Link>
        ) : (
          <YourBookingFormComponent hideForm={() => setShowBookingForm(false)} />
        )}
      </ActionItems>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col  h-screen
`;

const ActionItems = tw.div`
  bg-gray-800  p-4 rounded text-white
`;

const Header = tw.div`
    flex justify-between items-center
`;

const Title = tw.h1`
    flex items-center gap-2 text-2xl font-bold
`;

const Profile = tw.div`
    flex flex-row items-center
`;

const ProfileContainer = tw.div`
    flex flex-row items-center gap-3
`;

const Name = tw.div`
    mr-2 text-sm font-semibold
`;

const UserImage = tw.img`
    h-8 w-8 cursor-pointer rounded-full object-cover	
`;

const ActionButton = tw.button`
    w-full bg-gray-600 flex-1 m-1 flex flex-col 
    p-4 justify-between items-center text-xl
    rounded transform hover:scale-90 transition 
`;

const ActionButtonImage = tw.div`
    h-3/5
    mb-4
`;

const LogoutButton = tw.div`
    bg-red-500 text-white py-2 px-5
    flex items-center  rounded font-semibold gap-1
`;

export default Index;
