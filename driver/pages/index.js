import Link from "next/link";
import tw from "tailwind-styled-components";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../firebase";
import { HiOutlineLogout } from "react-icons/hi";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import { 
  getAuth,
  signOut,
  onAuthStateChanged, 
} from "firebase/auth";
import { 
  doc, 
  getDoc,
  getDocs, 
  updateDoc,
  collection, 
} from "firebase/firestore";

const Index = () => {
  const router = useRouter();
  const authUser = getAuth();
  const currentUser = authUser.currentUser;
  const [bookData, setBookData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(""); 
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "" ,
    motorcycleModel: ""
  });

  const locations = [
    "Bonuan Binloc, Dagupan City",
    "Bonuan Gueset, Dagupan City",
    "Herrero-Perez, Dagupan City",
    "Lucao, Dagupan, Pangasinan",
    "Mangin, Dagupan City",
    "Pantal, Dagupan City",
    "Tapuac, Dagupan City",
  ];

  const fetchBookData = async () => {
    try {
      const bookCollectionRef = collection(db, "book");
      const querySnapshot = await getDocs(bookCollectionRef);
      const books = [];
      querySnapshot.forEach((doc) => {
        const bookData = doc.data();
        const bookId = doc.id;
        books.push({ id: bookId, ...bookData });
      });
      books.sort((a, b) => b.id - a.id);
      setBookData(books);
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        const userUID = user.uid;

        const userDocRef = doc(db, "drivers", userUID);
        getDoc(userDocRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              if (data.role === "driver") {
                setUserData({
                  firstName: data.firstName,
                  lastName: data.lastName,
                  phoneNumber: data.phoneNumber,
                  motorcycleModel: data.motorcycleModel
                });
              } else {
                alert("Your account doesn't register as a driver!");
                signOut(auth);
                router.push("/landing");
              }
            } else {
              alert("Your account doesn't register as a driver!");
              signOut(auth);
              router.push("/landing");
            }
          })
          .catch((error) => {});
      } else {
        router.push("/landing");
      }
      fetchBookData();
    });
  }, [bookData]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      signOut(auth);
    }
  };

  const handleConfirmBooking = async (bookId) => {
    try {
      if (window.confirm("Are you sure you want to confirm this booking?")) {
        const bookRef = doc(db, "book", bookId);
        await updateDoc(bookRef, {
          driverId: currentUser.uid,
          driverName: `${userData.firstName}  ${userData.lastName}`,
          driverPhoneNumber: userData.phoneNumber,
          motorcycleModel: userData.motorcycleModel,
        });
        alert("You have successfully confirmed this booking!");
        fetchBookData();
      }
    } catch (error) {
      alert("Error confirming booking:", error);
    }
  };

  return (
    <Wrapper>
      <ActionItems>
        <Header>
          <Title>
            <GiFullMotorcycleHelmet size={30} /> Driver Angkas
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
      </ActionItems>

      <InputContainer>
        <SearchInput
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <LocationSelect
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </LocationSelect>
      </InputContainer>
      <TableWrapper>
        <ResponsiveTableContainer>
          <ResponsiveTable>
            <TableHead>
              <TableRow>
                <TableHeader>ID</TableHeader>
                <TableHeader>Pickup Location</TableHeader>
                <TableHeader>Dropoff Location</TableHeader>
                <TableHeader>First Name</TableHeader>
                <TableHeader>Last Name</TableHeader>
                <TableHeader>Ride Price</TableHeader>
                <TableHeader>Ride Time</TableHeader>
                <TableHeader>Phone Number</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookData
                .filter((book) => {
                  const locationMatch =
                    selectedLocation === "" ||
                    book.pickupLocation.toLowerCase().includes(selectedLocation.toLowerCase()) ||
                    book.dropoffLocation.toLowerCase().includes(selectedLocation.toLowerCase());
                  const searchTermMatch =
                    book.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    book.dropoffLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    book.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    book.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    book.userPhoneNumber.toLowerCase().includes(searchTerm.toLowerCase());

                    const unconfirmed = currentUser && currentUser.uid && (book.driverId === "" || currentUser.uid === book.driverId);


                    return locationMatch && searchTermMatch && unconfirmed;
                  })
                .map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.id}</TableCell>
                    <TableCell>{book.pickupLocation}</TableCell>
                    <TableCell>{book.dropoffLocation}</TableCell>
                    <TableCell>{book.firstName}</TableCell>
                    <TableCell>{book.lastName}</TableCell>
                    <TableCell>{book.ridePrice}</TableCell>
                    <TableCell>{book.rideTime}</TableCell>
                    <TableCell>
                        {
                          currentUser && book.driverId === currentUser.uid ? 
                          <h1>{book.userPhoneNumber}</h1>
                          : book.driverId ? 
                          null
                          : null
                        }
                    </TableCell>

                    <TableCell>
                    {
                      book.isDropoff ? (
                        <h1>The user has already arrived at their destination</h1>
                      ) : currentUser && book.driverId === currentUser.uid ? (
                        <Link
                          href={{
                            pathname: "/view",
                            query: {
                              id: book.id,
                              pickup: book.pickupCoords,
                              dropoff: book.dropoffCoords,
                              firstName: book.firstName,
                              lastName: book.lastName,
                              userPhoneNumber: book.userPhoneNumber,
                              pickupLocation: book.pickupLocation,
                              dropoffLocation: book.dropoffLocation,
                              ridePrice: book.ridePrice,
                              rideTime: book.rideTime,
                            },
                          }}
                          passHref
                        >
                          <ViewButton>View</ViewButton>
                        </Link>
                      ) : book.driverId ? (
                        <h1>Already confirmed by another driver</h1>
                      ) : (
                        <ConfirmButton onClick={() => handleConfirmBooking(book.id)}>
                          Confirm
                        </ConfirmButton>
                      )}

                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </ResponsiveTable>
        </ResponsiveTableContainer>
      </TableWrapper>
    </Wrapper>
  );
};


  const Wrapper = tw.div`
    flex flex-col  h-screen bg-gray-800 text-white
  `;

  const ActionItems = tw.div`
    bg-gray-900  p-4 rounded
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
  const InputContainer = tw.div`
      flex flex-wrap	 flex-row items-center gap-3
  `;
  const Name = tw.div`
      mr-2 text-sm font-semibold
  `;

  const UserImage = tw.img`
      h-8 w-8 cursor-pointer rounded-full object-cover	
  `;

  const SearchInput = tw.input`
    w-full border-solid border-2 border-gray-500 m-2 rounded-md px-4 py-2
    focus:outline-none text-black xl:max-w-lg 
  `;

  const LocationSelect = tw.select`
    w-full border-solid border-2 border-gray-500 m-2 rounded-md px-4 py-2
    focus:outline-none text-black xl:max-w-lg 
  `;

  const ConfirmButton = tw.button`
      w-full bg-green-500 text-white flex-1 m-1 flex flex-col 
      p-4 justify-between items-center text-xl
      rounded transform hover:scale-90 transition
  `;

  const ViewButton = tw.button`
    w-full bg-blue-500 text-white flex-1 m-1 flex flex-col 
    p-4 justify-between items-center text-xl
    rounded transform hover:scale-90 transition
  `;

  const LogoutButton = tw.div`
      bg-red-500 text-white py-2 px-5
      flex items-center  rounded font-semibold gap-1
  `;

  const TableWrapper = tw.div`
  p-2
  overflow-x-auto text-black
`;

const ResponsiveTableContainer = tw.div`
  max-w-screen-xl
  mx-auto
  
`;

const ResponsiveTable = tw.table`
  min-w-full
  table-fixed
  bg-white
  shadow-md
  rounded-xl	
`;

const TableHead = tw.thead`
  text-left
  bg-gray-300
`;

const TableRow = tw.tr`
  border-b border-gray-200
  hover:bg-gray-100
`;

const TableHeader = tw.th`
  p-3
  font-semibold
  text-sm
`;

const TableBody = tw.tbody`
  text-gray-700
  text-left
`;

const TableCell = tw.td`
  p-3
  text-sm
`;


  export default Index;
