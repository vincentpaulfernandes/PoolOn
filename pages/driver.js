import { useState,useContext } from 'react';
import { ethers } from 'ethers';
import { client } from '../lib/sanity';
import { UberContext } from '../context/uberContext';
import Link from 'next/link';


const DriverPage = () => {
  const [selectedTripType, setSelectedTripType] = useState(null);
  const [trips, setTrips] = useState([]);
  const [rideCount, setRideCount] = useState({});

  const {
    metamask,
  } = useContext(UberContext);

  const tripTypes = ['Hatchback', 'MUV', 'Electric', 'Sedan', 'SUV','Bike'];

  const handleTripTypeClick = async (tripType) => {
    setSelectedTripType(tripType);
    const query = `*[_type == "trips" && rideCategory == "${tripType}"] | order(rideTimestamp desc)`;
    const results = await client.fetch(query);
    setTrips(results);
  };

 const handleConfirmClick = async (price, pickup, dropoff) => {
  const rideCountForLocationPair = rideCount[pickup]?.[dropoff] ?? 0;
  if (rideCountForLocationPair >= 4) {
    console.log('Cannot accept more than 4 rides for the same pickup and dropoff location');
    return;
  }

  try {
    const transaction = {
      from: process.env.NEXT_PUBLIC_UBER_ADDRESS,
      to: process.env.NEXT_PUBLIC_DRIVER_ADDRESS,
      value: ethers.utils.hexlify(Math.round(price * 1e18)),
    };
    await metamask.request({ method: 'eth_sendTransaction', params: [transaction] });

    // Increment the ride count for the pickup and dropoff location pair
    setRideCount(prevRideCount => {
      const newRideCount = { ...prevRideCount };
      newRideCount[pickup] = { ...(newRideCount[pickup] ?? {}) };
      newRideCount[pickup][dropoff] = (newRideCount[pickup][dropoff] ?? 0) + 1;
      return newRideCount;
    });

    // Wait for 1 minute before checking the ride count
    setTimeout(() => {
      const rideCountForLocationPair = rideCount[pickup]?.[dropoff] ?? 0;

if (rideCountForLocationPair === 1) {
  const transaction = {
    from: process.env.NEXT_PUBLIC_DRIVER_ADDRESS,
    to: process.env.NEXT_PUBLIC_UBER_ADDRESS,
    value: ethers.utils.hexlify(Math.round(price * 1e18)),
  };
  metamask.request({ method: 'eth_sendTransaction', params: [transaction] });
} else if (rideCountForLocationPair === 2) {
  const transaction = {
    from: process.env.NEXT_PUBLIC_DRIVER_ADDRESS,
    to: process.env.NEXT_PUBLIC_UBER_ADDRESS,
    value: ethers.utils.hexlify(Math.round(price * 2 * 1e18)),
  };
  metamask.request({ method: 'eth_sendTransaction', params: [transaction] });
} else if (rideCountForLocationPair === 3) {
  const transaction = {
    from: process.env.NEXT_PUBLIC_DRIVER_ADDRESS,
    to: process.env.NEXT_PUBLIC_UBER_ADDRESS,
    value: ethers.utils.hexlify(Math.round(price * 3 * 1e18)),
  };
  metamask.request({ method: 'eth_sendTransaction', params: [transaction] });
}

      
      
    }, 15000); // Wait for 1 minute (60000 milliseconds)
  } catch (error) {
    console.error(error);
  }
};

  
  // ...
  
  const handleRejectClick = () => {
    console.log('Trip rejected');
  };

  return (
    <div style={{ backgroundColor: 'black', color: 'white', padding: '20px' }}>
  <Link href="/RiderDriverLogin" passHref>
    <button style={{ 
      backgroundColor: 'blue', 
      color: 'white',
      fontSize: '1.2rem', 
      padding: '0.5rem 2rem' // Increase padding to make the button larger
    }}>
      Home
    </button>
  </Link>

  <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
    {tripTypes.map((tripType) => (
      <button
        key={tripType}
        onClick={() => handleTripTypeClick(tripType)}
        style={{
          backgroundColor: 'blue',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        {tripType}
      </button>
    ))}
  </div>


      {selectedTripType && (
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>{selectedTripType} Trips:</h2>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid white', padding: '10px' }}>Drop Off</th>
                <th style={{ border: '1px solid white', padding: '10px' }}>Pick Up</th>
                <th style={{ border: '1px solid white', padding: '10px' }}>Price</th>
                <th style={{ border: '1px solid white', padding: '10px' }}>Timestamp</th>
                <th style={{ border: '1px solid white', padding: '10px' }}></th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip._id}>
                  <td style={{ border: '1px solid white', padding: '10px' }}>{trip.dropoff}</td>
                  <td style={{ border: '1px solid white', padding: '10px' }}>{trip.pickup}</td>
                  <td style={{ border: '1px solid white', padding: '10px' }}>{trip.price}</td>
                  <td style={{ border: '1px solid white', padding: '10px' }}>
                    {new Date(trip.rideTimestamp).toLocaleString()}
                  </td>
                  <td style={{ border: '1px solid white', padding: '10px' }}>
                  {metamask && metamask.isMetaMask && (
                  <button
  onClick={() => handleConfirmClick(trip.price)}
  style={{
    backgroundColor: 'blue', // change the background color to blue
    color: 'white',
    padding: '5px 10px',
    marginRight: '10px',
  }}
>
  Confirm
</button>)}

<button
  onClick={() => handleRejectClick(trip)}
  style={{
    backgroundColor: 'red', // change the background color to red
    color: 'white',
    padding: '5px 10px',
  }}
>
  Reject
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DriverPage;