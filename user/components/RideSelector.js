import { useState, useEffect } from "react"
import tw from "tailwind-styled-components"
import { carList } from "../data/carList"
import { accessToken } from "./Map"
const RideSelector = ({ pickupCoords, dropoffCoords, pickupLocation, dropoffLocation, onRideDataChange }) => {
    const [rideDuration, setRideDuration] = useState(0);
    const [ridePrice, setRidePrice] = useState(0);

    useEffect(() => {
        fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoords[0]},${pickupCoords[1]};${dropoffCoords[0]},${dropoffCoords[1]}?access_token=${accessToken}`
        )
            .then((res) => res.json())
            .then((data) => {
                const duration = data.routes[0].duration / 100;
                setRideDuration(duration);

                const price = (duration * carList[0].multipiler).toFixed(2);
                setRidePrice(price);

                onRideDataChange({ rideDuration: duration, ridePrice: price });
            })
            .catch((e) => console.log(e));
    }, [pickupCoords, dropoffCoords, onRideDataChange]);

    return (
        <Wrapper>
            <Title>Click the button down below to confirm your booking</Title>

            {carList.map((car, idx) => (
                <Car key={idx}>
                    <CarDetails>
                        <Service>Starting point: {pickupLocation}</Service>
                        <Service>End point: {dropoffLocation}</Service>
                        <Time>{rideDuration.toFixed()} min away</Time>
                    </CarDetails>
                    <Price>
                        ₱{ridePrice}
                    </Price>
                </Car>
            ))}
        </Wrapper>
    )
}

const Wrapper = tw.div`
    flex-1 flex flex-col
`

const Title = tw.div`
    text-center text-gray-500 text-xs border-b py-2
`
const Car = tw.div`
    flex flex-row py-4 items-center cursor-pointer
`
const CarDetails = tw.div`
    flex-1
`
const Service = tw.div`
    text-2xl font-bold
`
const Time = tw.div`
    text-lg text-blue-500
`
const Price = tw.div`
    text-3xl
`

export default RideSelector
