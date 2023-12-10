import { useState, useEffect } from "react"
import tw from "tailwind-styled-components"
import {
    BsArrowLeft,
    BsCircleFill,
    BsPlusLg,
    BsThreeDotsVertical,
} from "react-icons/bs"
import { FaSquareFull } from "react-icons/fa"
import { AiOutlineForm } from "react-icons/ai"
import Link from "next/link"
import { accessToken } from "../components/Map"

const Search = () => {
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropoffLocation, setDropoffLocation] = useState("");
    const [pickupCoordinates, setPickupCoordinates] = useState([0, 0]);
    const [dropoffCoordinates, setDropoffCoordinates] = useState([0, 0]);
    const locations = [
        "Bonuan Binloc, Dagupan City",
        "Bonuan Gueset, Dagupan City",
        "Herrero-Perez, Dagupan City",
        "Lucao, Dagupan, Pangasinan",
        "Mangin, Dagupan City",
        "Pantal, Dagupan City",
        "Tapuac, Dagupan City"
      ];
    const getCoords = (location, callback) => {
        fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?${new URLSearchParams(
                { access_token: accessToken, limit: 1 }
            )}`
        )
            .then((response) => response.json())
            .then((data) => {
                const points = data.features[0].center
                callback(points)
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        if (pickupLocation) {
          getCoords(pickupLocation, setPickupCoordinates);
        }
      }, [pickupLocation]);
    
      useEffect(() => {
        if (dropoffLocation) {
          getCoords(dropoffLocation, setDropoffCoordinates);
        }
      }, [dropoffLocation]);
      
    return (
        <Wrapper>
            {/* Button Container */}
            <ButtonContainer>
                <Link href='/' passHref>
                    <BackButton>
                        <BsArrowLeft size={30} />
                    </BackButton>
                </Link>
            </ButtonContainer>
            <Title><AiOutlineForm size={30}/> Create a booking</Title>
            {/* Input Container */}
            <InputContainer>
                <FromToIcons>
                    <BsCircleFill size={12} opacity={0.5} />
                    <BsThreeDotsVertical size={30} opacity={0.5} />
                    <FaSquareFull size={12} opacity={0.5} />
                </FromToIcons>

                <InputBoxes>
                    <Select
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="Enter pickup location"
                        required
                        >
                        <option value="">Select Pickup Location</option>
                        {locations.map((location, index) => (
                            <option key={index} value={location}>
                            {location}
                            </option>
                        ))}
                    </Select>
                    <Select
                        value={dropoffLocation}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                        placeholder="Where to?"
                        required
                        >
                        <option value="">Select Dropoff Location</option>
                        {locations.map((location, index) => (
                            <option key={index} value={location}>
                            {location}
                            </option>
                        ))}
                    </Select>
                </InputBoxes>

              
            </InputContainer>
            {/* Confirm Locations */}
            <Link
                href={{
                    pathname: "/confirm",
                    query: {
                        pickup: pickupCoordinates,
                        dropoff: dropoffCoordinates,
                        pickupLocation: pickupLocation,
                        dropoffLocation: dropoffLocation
                    },
                }}
                passHref>
                    <ConfirmLocation
                    disabled={!pickupLocation || !dropoffLocation}
                    >
                    Confirm Location
                    </ConfirmLocation>
            </Link>
        </Wrapper>
    )
}

const Wrapper = tw.div`
    p-4 bg-gray-800 h-screen
`
const ButtonContainer = tw.div`
    p-2 h-12 text-white
`

const BackButton = tw.button` `

const InputContainer = tw.div`
    flex items-center py-4 my-4
`
const FromToIcons = tw.div`
    w-10 h-16 flex flex-col items-center justify-between
`

const InputBoxes = tw.div`
    flex flex-col flex-1
`
const Title = tw.h1`
    flex items-center gap-2 text-2xl font-bold text-white
`

const Select = tw.select`
    h-14 bg-gray-200 px-4 my-2 rounded-2 outline-none border-none
`

const PlusIcon = tw.button`
      bg-gray-200 m-4 p-2 rounded-full
`
    
const ConfirmLocation = tw.button`
    w-full h-12 px-6 my-4 text-blue-100 
    transition-colors duration-150 bg-gray-600 
    rounded-lg focus:shadow-outline hover:bg-gray-700
`
export default Search